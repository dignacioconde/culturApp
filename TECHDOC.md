# TECHDOC — CulturaApp

Documento técnico de referencia del estado real del proyecto. Para contexto de desarrollo con Claude Code, ver `CLAUDE.md`.

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
| Backend/Auth | Supabase | latest |
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
| `useIncomes.js` | 56 | CRUD ingresos, filtro opcional por projectId + refetch |
| `useExpenses.js` | 56 | CRUD gastos, filtro opcional por projectId + refetch |

Todos los hooks exponen: `{ data, loading, error, methods, refetch }`.

### Páginas (`src/pages/`)

| Página | Líneas | Estado |
|--------|--------|--------|
| `Auth/Login.jsx` | 75 | Completo |
| `Auth/Register.jsx` | 96 | Completo |
| `Dashboard/Dashboard.jsx` | 213 | Completo (ver gap del gráfico) |
| `Dashboard/KpiCard.jsx` | 25 | Completo |
| `Calendar/CalendarView.jsx` | 132 | Completo |
| `Projects/ProjectList.jsx` | 139 | Completo |
| `Projects/ProjectDetail.jsx` | 422 | Completo |
| `Projects/ProjectForm.jsx` | 108 | Completo |
| `Settings/Settings.jsx` | 97 | Completo |

### Utilidades (`src/lib/`)

| Archivo | Función |
|---------|---------|
| `constants.js` | PROJECT_STATUSES, PROJECT_CATEGORIES, EXPENSE_CATEGORIES, STATUS_COLORS, DEFAULT_PROJECT_COLORS |
| `formatters.js` | `formatCurrency` (EUR, es-ES), `formatDate` (DD/MM/YYYY), `formatDateRange` |

---

## Estadísticas del código

| Métrica | Valor |
|---------|-------|
| Líneas totales de código fuente | ~1.889 |
| Componentes React | 16 |
| Hooks personalizados | 4 |
| Vistas/Páginas | 7 |
| Tablas en base de datos | 4 |
| Rutas definidas | 7 |

---

## Estado de implementación

### Implementado y funcionando

- Autenticación completa (login, registro, sesión persistente)
- CRUD completo de proyectos (crear, leer, editar, eliminar)
- CRUD completo de ingresos (añadir, editar, marcar como cobrado con `paid_date`)
- CRUD completo de gastos (añadir, editar, marcar como deducible)
- Dashboard con 4 KPIs + filtro por período + criterio de agrupación
- Lista de cobros pendientes (próximos 30 días)
- Lista de proyectos activos
- Calendario mensual/semanal con colores por proyecto
- Panel lateral en calendario con resumen rápido
- Detalle de proyecto con resumen financiero (bruto, retenciones, gastos, neto)
- Búsqueda y filtros en lista de proyectos
- Gestión de perfil (nombre, profesión, tipo IRPF por defecto)
- Sistema de notificaciones toast (éxito/error)
- RLS habilitado en todas las tablas

### Gap identificado: gráfico del Dashboard

`Dashboard.jsx` **no implementa** el gráfico de barras de ingresos vs. gastos por los últimos 6 meses mencionado en CLAUDE.md. La vista muestra KPIs, lista de cobros pendientes y proyectos activos, pero no el gráfico. Si quieres añadirlo, el stack recomendado sería [Recharts](https://recharts.org/) o [Chart.js](https://www.chartjs.org/), que encajan bien con React y Tailwind.

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

- [ ] Ejecutar el SQL de creación de tablas (`profiles`, `projects`, `incomes`, `expenses`)
- [ ] Ejecutar políticas RLS en las 4 tablas
- [ ] Ejecutar el trigger `on_auth_user_created` para crear perfiles automáticamente
- [ ] Verificar que el trigger funciona registrando un usuario de prueba
- [ ] Probar CRUD de proyecto, ingreso y gasto con ese usuario

El SQL completo está en `CLAUDE.md` → sección "SQL de inicialización de Supabase".

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

**No se usa localStorage**: Supabase gestiona la sesión internamente. No almacenar datos sensibles en el navegador.

**Fechas**: almacenamiento en ISO 8601 (`YYYY-MM-DD`) en Supabase, presentación en `DD/MM/YYYY` via `formatDate()` de `lib/formatters.js`. No mezclar formatos.

---

## Puntos a vigilar si se escala

- `ProjectDetail.jsx` (422 líneas) tiene tres formularios inline que podrían extraerse a componentes separados si la vista sigue creciendo.
- No hay confirmación de borrado para ingresos y gastos (sí para proyectos). Considerar añadirlo.
- Sin capa de caché: cada cambio de vista hace una petición a Supabase. Aceptable para MVP.
