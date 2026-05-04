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
| `.agents/skills/` | — | Fuente real de skills portables para Codex |
| `.agents/templates/portable-skill/` | — | Plantilla base para nuevas skills `SKILL.md` |
| `.claude/skills/` | — | Symlinks para que Claude Code descubra las mismas skills |
| `docs/agent-skills-strategy.md` | — | Estrategia, gobernanza, fuentes revisadas y uso de skills |

### Core de la aplicación

| Archivo | Líneas | Función |
|---------|--------|---------|
| `src/main.jsx` | 10 | Entry point React con StrictMode |
| `src/App.jsx` | 47 | Router + guardas PrivateRoute/PublicRoute |
| `src/index.css` | 142 | Estilos globales + overrides React Big Calendar |
| `src/supabaseClient.js` | 6 | Singleton de Supabase |

### Componentes UI (`src/components/ui/`)

| Componente | Líneas | Variantes/Notas |
|-----------|--------|-----------------|
| `Button.jsx` | 27 | Variantes: primary, secondary, danger, ghost / Tamaños: sm, md, lg |
| `Input.jsx` | 476 | Input, Select custom, DateInput, DateTimeInput, Textarea — con label y estado de error |
| `Card.jsx` | 10 | Wrapper básico con borde y sombra |
| `Badge.jsx` | 17 | Badge genérico + StatusBadge para estados de proyecto |
| `Modal.jsx` | 50 | Cierre con Escape y click fuera, contenido scrollable |
| `Toast.jsx` | 49 | Hook `useToast` + ToastContainer, auto-dismiss a 3.5s |

### Layout (`src/components/layout/`)

| Componente | Líneas | Función |
|-----------|--------|---------|
| `Sidebar.jsx` | 47 | Navegación principal con NavLink activo |
| `TopBar.jsx` | 27 | Título de página + email usuario + botón salir |
| `PageWrapper.jsx` | 18 | Composición Sidebar + TopBar + área de contenido |

### Hooks (`src/hooks/`)

| Hook | Líneas | Responsabilidad |
|------|--------|-----------------|
| `useAuth.js` | 40 | Sesión, signIn, signUp, signOut, listener onAuthStateChange |
| `useProjects.js` | 57 | CRUD proyectos + refetch callback |
| `useEvents.js` | 63 | CRUD eventos, filtro opcional por projectId + refetch |
| `useIncomes.js` | 66 | CRUD ingresos, filtros por projectId, eventId y eventIds |
| `useExpenses.js` | 66 | CRUD gastos, filtros por projectId, eventId y eventIds |
| `useProfile.js` | 44 | Perfil profesional: lectura y actualización de `profiles` |

Todos los hooks exponen `loading`, `error`, métodos CRUD y `refetch`. Los datos se devuelven con nombres específicos: `projects`, `events`, `incomes` o `expenses`.

### Páginas (`src/pages/`)

| Página | Líneas | Estado |
|--------|--------|--------|
| `Auth/Login.jsx` | 81 | Completo |
| `Auth/Register.jsx` | 109 | Completo |
| `Dashboard/Dashboard.jsx` | 383 | Completo |
| `Dashboard/KpiCard.jsx` | 42 | Completo |
| `Calendar/CalendarView.jsx` | 156 | Completo |
| `Calendar/CalendarEvents.jsx` | 241 | Completo |
| `Calendar/CalendarProjects.jsx` | 216 | Completo |
| `Events/EventList.jsx` | 246 | Completo |
| `Events/EventDetail.jsx` | 497 | Completo |
| `Events/EventForm.jsx` | 176 | Completo |
| `Projects/ProjectList.jsx` | 204 | Completo |
| `Projects/ProjectDetail.jsx` | 457 | Completo |
| `Projects/ProjectForm.jsx` | 159 | Completo |
| `Settings/Settings.jsx` | 108 | Completo |

### Utilidades (`src/lib/`)

| Archivo | Función |
|---------|---------|
| `constants.js` | PROJECT_STATUSES, EVENT_STATUSES, PROJECT_CATEGORIES, EVENT_CATEGORIES, EXPENSE_CATEGORIES, STATUS_COLORS, DEFAULT_PROJECT_COLORS |
| `formatters.js` | `formatCurrency` (EUR, es-ES), `formatCurrencyPerHour`, `formatHours`, `formatDate`, `formatDateRange`, `formatDatetime`, `toDatetimeLocal` |

---

## Estadísticas del código

| Métrica | Valor |
|---------|-------|
| Líneas totales de código fuente | ~4.420 |
| Componentes React | 24 |
| Hooks personalizados | 6 |
| Vistas/Páginas | 12 |
| Tablas en base de datos | 5 |
| Rutas definidas | 12 |
| Skills portables | 7 |

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
- Calendario de eventos con horario útil desde las 08:00, formato 24h y semana/día con scroll horizontal en móvil
- Calendario de proyectos con rangos de fecha, navegación controlada y creación desde selección de días
- Selectores propios grandes para estados, categorías, proyectos, fechas y horas; no quedan `<select>` nativos en páginas
- Date picker y datetime picker custom que mantienen valores compatibles con Supabase (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`)
- Mejoras UX móvil en modales, CTAs de estados vacíos, breadcrumbs, tablas con overflow horizontal y KPIs del dashboard
- Panel lateral en calendarios con resumen rápido
- Lista y detalle de eventos con ingresos/gastos propios
- Detalle de proyecto con resumen financiero (bruto, retenciones, gastos, neto)
- ProjectDetail agrega ingresos/gastos del proyecto y de sus eventos en KPIs
- ProjectDetail mantiene tablas editables solo para ingresos/gastos directos del proyecto
- Búsqueda y filtros en listas de proyectos y eventos
- Gestión de perfil (nombre, profesión, tipo IRPF por defecto)
- Sistema de notificaciones toast (éxito/error)
- RLS habilitado en todas las tablas
- Skills portables para Codex y Claude Code en `.agents/skills` con symlinks desde `.claude/skills`
- Agentes OpenCode especializados en `.opencode/agents` para frontend, datos, testing, review, release y documentacion

### Skills portables Codex/Claude

La carpeta `.agents/skills/` contiene la fuente única de workflows portables basados en `SKILL.md`. Claude Code descubre las mismas skills mediante symlinks en `.claude/skills/`, evitando duplicar instrucciones entre herramientas.

| Skill | Objetivo |
|-------|----------|
| `portable-skill-authoring` | Crear, revisar y mantener skills portables sin convertir contexto global en skills. |
| `cultura-frontend-review` | Revisar o implementar cambios de frontend con foco en UI, formularios, calendarios, responsive y accesibilidad. |
| `cultura-data-finance-review` | Revisar hooks, Supabase, RLS, relaciones evento/proyecto e impacto financiero. |
| `cultura-security-privacy-review` | Revisar auth, RLS, secretos, privacidad, dependencias y seguridad de instrucciones de agentes. |
| `cultura-testing-release-check` | Definir y ejecutar checks de lint/build, smoke tests, regresión y predeploy. |
| `cultura-code-review` | Hacer code review transversal de diffs o PRs con severidades y hallazgos accionables. |
| `memory-protocol` | Mantener memoria local auditable en Markdown bajo `.memory/`. |

Reglas de mantenimiento:

- La fuente real vive siempre en `.agents/skills/<skill-name>/SKILL.md`.
- `.claude/skills/<skill-name>` debe ser un symlink relativo a `../../.agents/skills/<skill-name>`.
- Nuevas skills deben partir de `.agents/templates/portable-skill/SKILL.md`.
- No mover a skills reglas globales que pertenezcan a `AGENTS.md`, `CLAUDE.md`, `README.md` o `TECHDOC.md`.
- Preferir skills instruction-only salvo que un script aporte seguridad o reproducibilidad clara.
- Validar cada skill con `quick_validate.py` cuando `PyYAML` esté disponible.

Validación realizada:

- `quick_validate.py` pasa para las 7 skills.
- `quick_validate.py` pasa para la plantilla.
- `git diff --check` pasa.
- No se añadieron dependencias ni scripts externos.

### Agentes OpenCode

La carpeta `.opencode/` contiene el agente principal `cultura-lead` y nueve subagentes especializados:

| Agente | Modo | Estado |
|--------|------|--------|
| `cultura-lead` | primary | Verificado |
| `cultura-frontend` | subagent | Verificado via `cultura-lead` |
| `cultura-data` | subagent | Verificado via `cultura-lead` |
| `cultura-testing` | subagent | Verificado via `cultura-lead` |
| `cultura-review` | subagent | Verificado via `cultura-lead` |
| `cultura-release` | subagent | Verificado via `cultura-lead` |
| `cultura-docs` | subagent | Verificado via `cultura-lead` |
| `cultura-ux-desktop` | subagent | Verificado via `cultura-lead` |
| `cultura-ux-mobile` | subagent | Verificado via `cultura-lead` |

Verificacion inicial realizada el 29/04/2026 y set completo con agentes UX verificado el 02/05/2026 con OpenCode `1.14.29`. El modelo `opencode/minimax-m2.5-free` aparece en `opencode models opencode` y fue usado por `cultura-lead` y los subagentes.

Uso recomendado:

```bash
npm run agents:run -- "Describe la tarea"
```

Este comando usa `cultura-lead` como dispatcher minimo y envuelve la peticion en una directriz estandar con objetivo, autonomia, alcance, ownership, verificacion y salida esperada. La plantilla esta en `.opencode/AGENT_TASK_TEMPLATE.md`.

Uso directo para depuracion:

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

### Leccion tecnica: bugs visuales en calendarios

Los bugs visuales y responsive deben entregarse a agentes con reproduccion concreta, no solo como "revisa responsividad". El prompt debe incluir ruta, viewport/condicion, captura si existe, sintoma visual y criterio de aceptacion.

Caso registrado: en `/calendar/events`, con ventana compacta, `react-big-calendar` podia mostrar toolbar y cabecera de dias pero no las filas del mes. La causa no era solo una clase `min-h-*` demasiado grande: el calendario tenia `style={{ height: '100%' }}` dentro de padres con altura no suficientemente calculable (`min-height`, `flex-1`, `min-h-0`, `overflow-hidden`). En esa combinacion, la libreria puede calcular espacio para toolbar/cabecera y colapsar la rejilla.

Criterio de aceptacion para calendarios: verificar visualmente que se ven toolbar, cabecera y semanas/filas del mes en viewport compacto y desktop. Lint/build no validan este caso.

### Leccion UX: selectores nativos y móvil

Los controles nativos (`<select>`, `input type="date"`, `input type="datetime-local"`) pueden verse demasiado pequeños o poco controlables en móvil, especialmente dentro de modales. En CulturaApp se sustituyeron por wrappers compartidos en `src/components/ui/Input.jsx`:

- `Select`: listbox propio con filas grandes, check de selección y scroll automático al valor seleccionado.
- `Input type="date"`: calendario propio, muestra `DD/MM/YYYY` y emite `YYYY-MM-DD`.
- `Input type="datetime-local"`: compone fecha + hora, emite `YYYY-MM-DDTHH:mm`, usa `08:00` como hora inicial por defecto para eventos y preselecciona la hora seleccionada al abrir.

Regla operativa: no introducir selectores nativos directamente en páginas o modales. Si se necesita otro tipo de selector, extender `Input.jsx` o crear un componente UI compartido.

### Pendiente UX: semana móvil

La vista semana de `/calendar/events` sigue abierta como mejora en GitHub issue `#3`. El scroll horizontal actual evita que la cuadrícula se aplaste, pero no se considera solución UX definitiva. Alternativas a evaluar: agenda móvil, vista de 3 días, carrusel por días, semana con día seleccionado o fallback móvil a `Día`/`Agenda`.

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

> ⚠️ **El proyecto ya está desplegado en Vercel.** Este checklist sirve de referencia para futuros despliegues o migraciones.

### 1. Supabase (hacer antes de deploy)

- [x] Ejecutar el SQL de creación de tablas (`profiles`, `projects`, `events`, `incomes`, `expenses`)
- [x] Ejecutar políticas RLS en las 5 tablas
- [x] Ejecutar el trigger `on_auth_user_created` para crear perfiles automáticamente
- [x] Verificar que el trigger funciona registrando un usuario de prueba
- [x] Probar CRUD de proyecto, evento, ingreso y gasto con ese usuario

El SQL completo está en `AGENTS.md` → sección "SQL de inicialización de Supabase".

### 2. Variables de entorno en Vercel

Añadir en el panel de Vercel → Settings → Environment Variables:

```
VITE_SUPABASE_URL=<tu_url>
VITE_SUPABASE_ANON_KEY=<tu_anon_key>
```

### 3. Build y deploy

- [x] `npm run build` sin errores en local
- [x] Conectar repo de GitHub a Vercel
- [x] Verificar que Vercel detecta Vite como framework
- [x] Primer deploy y smoke test del flujo de registro → login → crear proyecto

---

## Notas del deploy

- **URL de producción**: https://culturapp-rho.vercel.app
- **Variables configuradas en Vercel**: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- **Build automático**: GitHub Actions conectado a Vercel (deploy en cada push a main)

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
