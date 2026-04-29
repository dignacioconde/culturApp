# TECHDOC — CulturaApp

Documento técnico de referencia del estado real del proyecto. Para Codex, la fuente principal de contexto es `AGENTS.md`; `CLAUDE.md` se mantiene como espejo para Claude Code.

---

## Stack y versiones

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | React | 19.2.5 |
| Build | Vite | 8.0.10 |
| Estilos | Tailwind CSS | v4 |
| Iconos | Lucide React | 1.9.0 |
| Calendario | React Big Calendar | 1.19.4 |
| Fechas | Day.js | 1.11.20 |
| Routing | React Router DOM | 7.14.2 |
| Backend/Auth | Supabase JS | 2.104.1 |
| Deploy | Vercel | — |

---

## Inventario de archivos

### Configuración raíz

| Archivo | Líneas | Función |
|---------|--------|---------|
| `index.html` | 13 | Entry point HTML |
| `vite.config.js` | 7 | Build config con plugins React + Tailwind |
| `eslint.config.js` | — | Linting |
| `.env.local` | — | Variables de entorno (no en git) |

### Core de la aplicación

| Archivo | Líneas | Función |
|---------|--------|---------|
| `src/main.jsx` | 10 | Entry point React con StrictMode |
| `src/App.jsx` | 40 | Router + guardas PrivateRoute/PublicRoute |
| `src/index.css` | 29 | Estilos globales + overrides React Big Calendar |
| `src/supabaseClient.js` | 6 | Singleton de Supabase |

### Componentes UI (`src/components/ui/`)

| Componente | Líneas | Variantes/Notas |
|-----------|--------|-----------------|
| `Button.jsx` | 23 | Variantes: primary, secondary, danger, ghost / Tamaños: sm, md, lg |
| `Input.jsx` | 53 | Input, Select, Textarea — con label y estado de error |
| `Card.jsx` | 10 | Wrapper básico con borde y sombra |
| `Badge.jsx` | 17 | Badge genérico + StatusBadge para estados de proyecto |
| `Modal.jsx` | 36 | Cierre con Escape y click fuera, contenido scrollable |
| `Toast.jsx` | 38 | Hook `useToast` + ToastContainer, auto-dismiss a 3.5s |

### Layout (`src/components/layout/`)

| Componente | Líneas | Función |
|-----------|--------|---------|
| `Sidebar.jsx` | 41 | Navegación principal con NavLink activo |
| `TopBar.jsx` | 25 | Título de página + email usuario + botón salir |
| `PageWrapper.jsx` | 16 | Composición Sidebar + TopBar + área de contenido |

### Hooks (`src/hooks/`)

| Hook | Líneas | Responsabilidad |
|------|--------|-----------------|
| `useAuth.js` | 40 | Sesión, signIn, signUp, signOut, listener onAuthStateChange |
| `useProjects.js` | 57 | CRUD proyectos + refetch callback |
| `useEvents.js` | 63 | CRUD eventos, filtro opcional por projectId + refetch |
| `useIncomes.js` | 66 | CRUD ingresos, filtros por projectId, eventId y eventIds |
| `useExpenses.js` | 66 | CRUD gastos, filtros por projectId, eventId y eventIds |

Todos los hooks exponen `loading`, `error`, métodos CRUD y `refetch`. Los datos se devuelven con nombres específicos: `projects`, `events`, `incomes` o `expenses`.

### Páginas (`src/pages/`)

| Página | Líneas | Estado |
|--------|--------|--------|
| `Auth/Login.jsx` | 81 | Completo |
| `Auth/Register.jsx` | 109 | Completo |
| `Dashboard/Dashboard.jsx` | 305 | Completo |
| `Dashboard/KpiCard.jsx` | 27 | Completo |
| `Calendar/CalendarView.jsx` | 156 | Completo |
| `Calendar/CalendarEvents.jsx` | 227 | Completo |
| `Calendar/CalendarProjects.jsx` | 208 | Completo |
| `Events/EventList.jsx` | 220 | Completo |
| `Events/EventDetail.jsx` | 492 | Completo |
| `Events/EventForm.jsx` | 174 | Completo |
| `Projects/ProjectList.jsx` | 198 | Completo |
| `Projects/ProjectDetail.jsx` | 452 | Completo |
| `Projects/ProjectForm.jsx` | 159 | Completo |
| `Settings/Settings.jsx` | 131 | Completo |

### Utilidades (`src/lib/`)

| Archivo | Función |
|---------|---------|
| `constants.js` | PROJECT_STATUSES, EVENT_STATUSES, PROJECT_CATEGORIES, EVENT_CATEGORIES, EXPENSE_CATEGORIES, STATUS_COLORS, DEFAULT_PROJECT_COLORS |
| `formatters.js` | `formatCurrency` (EUR, es-ES), `formatCurrencyPerHour`, `formatHours`, `formatDate`, `formatDateRange`, `formatDatetime`, `toDatetimeLocal` |

---

## Estadísticas del código

| Métrica | Valor |
|---------|-------|
| Líneas totales de código fuente | ~3.812 |
| Componentes React | 24 |
| Hooks personalizados | 5 |
| Vistas/Páginas | 12 |
| Tablas en base de datos | 5 |
| Rutas definidas | 12 |

---

## Estado de implementación

### Implementado y funcionando

- Autenticación completa (login, registro, sesión persistente)
- CRUD completo de proyectos (crear, leer, editar, eliminar)
- CRUD completo de eventos (crear, leer, editar, eliminar)
- CRUD completo de ingresos (añadir, editar, marcar como cobrado con `paid_date`)
- CRUD completo de gastos (añadir, editar, marcar como deducible)
- Dashboard con 5 KPIs + filtro por período + criterio de agrupación
- Métrica de cobro bruto/hora: ingresos cobrados asociados a eventos, antes de IRPF, divididos entre horas de eventos con `end_datetime`
- Lista de cobros pendientes (próximos 30 días)
- Lista de proyectos activos
- Calendario de eventos con fecha/hora exacta, navegación controlada y creación desde huecos
- Calendario de proyectos con rangos de fecha, navegación controlada y creación desde selección de días
- Panel lateral en calendarios con resumen rápido
- Lista y detalle de eventos con ingresos/gastos propios
- Detalle de proyecto con resumen financiero (bruto, retenciones, gastos, neto)
- ProjectDetail agrega ingresos/gastos del proyecto y de sus eventos en KPIs
- ProjectDetail mantiene tablas editables solo para ingresos/gastos directos del proyecto
- Búsqueda y filtros en listas de proyectos y eventos
- Gestión de perfil (nombre, profesión, tipo IRPF por defecto)
- Sistema de notificaciones toast (éxito/error)
- RLS habilitado en todas las tablas
- Agentes OpenCode especializados en `.opencode/agents` para frontend, datos, testing, review, release y documentacion

### Agentes OpenCode

La carpeta `.opencode/` contiene el agente principal `cultura-lead` y siete subagentes especializados:

| Agente | Modo | Estado |
|--------|------|--------|
| `cultura-lead` | primary | Verificado |
| `cultura-frontend` | subagent | Verificado via `cultura-lead` |
| `cultura-data` | subagent | Verificado via `cultura-lead` |
| `cultura-testing` | subagent | Verificado via `cultura-lead` |
| `cultura-review` | subagent | Verificado via `cultura-lead` |
| `cultura-release` | subagent | Verificado via `cultura-lead` |
| `cultura-docs` | subagent | Verificado via `cultura-lead` |

Verificacion realizada el 29/04/2026 con OpenCode `1.14.29`. El modelo `opencode/minimax-m2.5-free` aparece en `opencode models opencode` y fue usado por `cultura-lead` y los subagentes.

Uso recomendado:

```bash
opencode run --agent cultura-lead "Describe la tarea"
```

Los subagentes no se lanzan directamente con `opencode run --agent cultura-testing`; deben invocarse desde `cultura-lead` mediante menciones como `@cultura-testing`. La documentacion operativa completa esta en `.opencode/README.md`.

Para ejecutar revisiones en paralelo se incluye el script:

```bash
npm run agents:parallel -- "Describe la tarea"
```

El script lanza varios procesos `opencode run --agent cultura-lead` a la vez, cada uno delegado a un unico subagente. Por defecto usa `cultura-data`, `cultura-testing`, `cultura-review` y `cultura-security` en modo solo lectura, y guarda resultados en `.opencode/runs/<timestamp>/`. Para escritura paralela existe `--write`, pero solo debe usarse con ownership disjunto por archivos o modulos.

La coordinacion entre agentes usa `.opencode/AGENT_STATE.md` como pizarra compartida. Cada agente la lee al arrancar y puede publicar senales como `schema_changed`, `api_changed`, `ui_changed`, `needs_review`, `verified` o `bloqueo`. Esto permite que, por ejemplo, `cultura-frontend` reaccione a un cambio publicado por `cultura-data` sin esperar a una nueva instruccion del lead. El archivo es solo coordinacion operativa: la fuente de verdad siguen siendo `AGENTS.md`, el codigo y las pruebas.

### No implementado (fuera del alcance del MVP)

- Paginación o virtualización de listas
- Exportación de datos (CSV, PDF)
- Notificaciones por email (cobros próximos, vencimientos)
- Adjuntos en proyectos
- Gastos recurrentes
- Modo oscuro
- Modo offline

---

## Checklist pre-deploy en Vercel

### 1. Supabase (hacer antes de deploy)

- [ ] Ejecutar el SQL de creación de tablas (`profiles`, `projects`, `events`, `incomes`, `expenses`)
- [ ] Ejecutar políticas RLS en las 5 tablas
- [ ] Ejecutar el trigger `on_auth_user_created` para crear perfiles automáticamente
- [ ] Verificar que el trigger funciona registrando un usuario de prueba
- [ ] Probar CRUD de proyecto, evento, ingreso y gasto con ese usuario

El SQL completo está en `AGENTS.md` → sección "SQL de inicialización de Supabase".

### 2. Variables de entorno en Vercel

Añadir en el panel de Vercel → Settings → Environment Variables:

```
VITE_SUPABASE_URL=<tu_url>
VITE_SUPABASE_ANON_KEY=<tu_anon_key>
```

### 3. Build y deploy

- [ ] `npm run build` sin errores en local
- [ ] Conectar repo de GitHub a Vercel
- [ ] Verificar que Vercel detecta Vite como framework
- [ ] Primer deploy y smoke test del flujo de registro → login → crear proyecto

---

## Decisiones de arquitectura relevantes

**Sin gestor de estado global**: Los datos se gestionan con hooks locales por vista. Funciona bien para este caso de uso (datos por usuario, sin compartir estado entre rutas). Si la app crece con vistas muy relacionadas, considerar React Context o Zustand.

**`user_id` duplicado en `incomes` y `expenses`**: Además de `project_id`, estas tablas guardan `user_id` para poder aplicar RLS directamente sin hacer joins. Esto es intencional.

**No acceder a localStorage manualmente**: Supabase JS gestiona la persistencia de sesión del cliente. No almacenar datos sensibles propios en el navegador.

**Fechas**: almacenamiento en ISO 8601 (`YYYY-MM-DD`) en Supabase, presentación en `DD/MM/YYYY` via `formatDate()` de `lib/formatters.js`. No mezclar formatos.

---

## Puntos a vigilar si se escala

- `ProjectDetail.jsx` (452 líneas) tiene tres formularios inline que podrían extraerse a componentes separados si la vista sigue creciendo.
- No hay confirmación de borrado para ingresos y gastos (sí para proyectos). Considerar añadirlo.
- Sin capa de caché: cada cambio de vista hace una petición a Supabase. Aceptable para MVP.
