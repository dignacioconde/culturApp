# CLAUDE.md — CulturaApp

Archivo de contexto para Claude Code. Léelo completo antes de tocar cualquier archivo.

---

## Qué es este proyecto

**CulturaApp** es una herramienta web para trabajadores del sector cultural (músicos, actores, diseñadores, fotógrafos, gestores culturales, etc.) que trabajan de forma independiente con múltiples proyectos simultáneos.

El problema que resuelve: los trabajadores culturales freelance no tienen visibilidad clara de su calendario de proyectos, sus ingresos esperados, ni los costes asociados a cada trabajo. Gestionan todo con Excel o en papel, sin ninguna capa de inteligencia.

La herramienta les permite:
- Visualizar todos sus eventos en un calendario (con fecha y hora exactas)
- Agrupar eventos en proyectos para tener visión global
- Conocer sus posibilidades económicas (ingresos previstos, reales)
- Controlar los costes de cada evento o proyecto
- Tener un resumen financiero de su actividad independiente

---

## Stack técnico

| Capa | Tecnología | Versión | Por qué |
|------|-----------|---------|---------|
| Frontend framework | React | 19 | Ecosistema maduro |
| Build tool | Vite | 6 | Rápido, sin configuración compleja |
| Estilos | Tailwind CSS | v4 | Prototipar rápido, utility-first |
| Iconos | Lucide React | latest | Limpio, consistente, 1500+ iconos |
| Calendario | React Big Calendar | latest | Vista mes/semana/día, drag & drop |
| Fechas | Day.js | latest | Ligero, API limpia |
| Routing | React Router | v7 | Navegación entre vistas |
| Backend & Auth | Supabase | latest | PostgreSQL + Auth + API REST sin servidor propio |
| Deploy | Vercel | — | Deploy automático desde GitHub |

---

## Modelo conceptual

Hay dos niveles de entidades:

- **Proyecto**: contenedor/agrupador. Tiene fecha de inicio y fin (rango). Un proyecto puede tener cero o muchos eventos. Los proyectos aparecen en el **calendario de proyectos**.
- **Evento**: ocurrencia concreta con fecha y hora exactas (un bolo, una clase, una sesión). Puede pertenecer a un proyecto o existir de forma independiente. Los eventos aparecen en el **calendario de eventos** (este es el que se comparte hacia afuera).
- **Ingresos y gastos**: se registran a nivel de **evento** O a nivel de **proyecto** (para costes generales no atribuibles a un evento concreto). Ambos se suman en el dashboard.

---

## Estructura de carpetas

```
culturaapp/
├── CLAUDE.md
├── README.md
├── index.html
├── vite.config.js
├── .env.local                 ← NO subir a git (VITE_SUPABASE_*)
├── src/
│   ├── main.jsx
│   ├── App.jsx                ← Router principal + rutas protegidas
│   ├── supabaseClient.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx     ← Variantes: primary, secondary, danger, ghost
│   │   │   ├── Input.jsx      ← Input, Select, Textarea
│   │   │   ├── Badge.jsx      ← Badge, StatusBadge
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx      ← Cierre con Escape y click fuera
│   │   │   └── Toast.jsx      ← useToast hook + ToastContainer
│   │   └── layout/
│   │       ├── Sidebar.jsx    ← Navegación principal con NavLink activo
│   │       ├── TopBar.jsx     ← Título + email + botón salir
│   │       └── PageWrapper.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx  ← KPIs + cobros pendientes + proyectos activos
│   │   │   └── KpiCard.jsx
│   │   ├── Calendar/
│   │   │   ├── CalendarEvents.jsx   ← Calendario de eventos (con hora). Compartible.
│   │   │   └── CalendarProjects.jsx ← Calendario de proyectos (por rango de fechas)
│   │   ├── Events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventDetail.jsx ← Detalle + ingresos y gastos del evento
│   │   │   └── EventForm.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectDetail.jsx ← Detalle + eventos asociados + ingresos/gastos de proyecto
│   │   │   └── ProjectForm.jsx
│   │   └── Settings/
│   │       └── Settings.jsx
│   ├── hooks/
│   │   ├── useAuth.js         ← Sesión + signIn + signUp + signOut
│   │   ├── useProjects.js     ← CRUD proyectos
│   │   ├── useEvents.js       ← CRUD eventos (filtra por projectId opcional)
│   │   ├── useIncomes.js      ← CRUD ingresos ({ projectId } o { eventId })
│   │   └── useExpenses.js     ← CRUD gastos ({ projectId } o { eventId })
│   └── lib/
│       ├── formatters.js      ← formatCurrency, formatDate, formatDatetime, toDatetimeLocal
│       └── constants.js       ← PROJECT_STATUSES, EVENT_STATUSES, EXPENSE_CATEGORIES, STATUS_COLORS…
└── public/
```

---

## Routing

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/login` | `Auth/Login` | Solo sin sesión |
| `/register` | `Auth/Register` | Solo sin sesión |
| `/dashboard` | `Dashboard/Dashboard` | Requiere auth |
| `/calendar/events` | `Calendar/CalendarEvents` | Requiere auth |
| `/calendar/projects` | `Calendar/CalendarProjects` | Requiere auth |
| `/events` | `Events/EventList` | Requiere auth |
| `/events/:id` | `Events/EventDetail` | Requiere auth |
| `/projects` | `Projects/ProjectList` | Requiere auth |
| `/projects/:id` | `Projects/ProjectDetail` | Requiere auth |
| `/settings` | `Settings/Settings` | Requiere auth |
| `*` | Redirect → `/dashboard` | — |

`PrivateRoute` y `PublicRoute` viven en `App.jsx`.

---

## Modelo de datos (Supabase / PostgreSQL)

### Tabla: `profiles`

Extiende `auth.users`. Se crea automáticamente al registrarse via trigger.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | FK auth.users |
| full_name | text | |
| profession | text | Ej: "Músico", "Actor" |
| tax_rate | numeric | % IRPF habitual, default 15 |
| created_at | timestamptz | |

### Tabla: `projects`

Agrupador/contenedor. Aparece en el calendario de proyectos.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | |
| name | text NOT NULL | |
| client | text | |
| category | text | concierto, exposición, taller, diseño, fotografía, otros |
| status | text | draft, confirmed, in_progress, completed, cancelled |
| start_date | date NOT NULL | |
| end_date | date | |
| color | text | Hex, ej: #4f98a3 |
| notes | text | |
| created_at | timestamptz | |

### Tabla: `events`

Ocurrencia concreta con fecha y hora. Aparece en el calendario de eventos.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | RLS |
| project_id | uuid FK projects (nullable) | Puede existir sin proyecto. ON DELETE SET NULL |
| name | text NOT NULL | |
| client | text | |
| category | text | Mismas categorías que projects |
| status | text | Independiente del proyecto |
| start_datetime | timestamptz NOT NULL | Fecha + hora |
| end_datetime | timestamptz | |
| color | text | Hex |
| notes | text | |
| created_at | timestamptz | |

### Tabla: `incomes`

Ingreso vinculado a un **evento** O a un **proyecto** (uno de los dos obligatorio).

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | RLS |
| project_id | uuid FK projects (nullable) | Ingreso directo de proyecto |
| event_id | uuid FK events (nullable) | Ingreso de evento |
| concept | text NOT NULL | |
| amount | numeric NOT NULL | Bruto en € |
| tax_rate | numeric | % IRPF, default 15 |
| expected_date | date | Fecha prevista de cobro |
| paid_date | date | Fecha real (null si pendiente) |
| is_paid | boolean | Default false |
| created_at | timestamptz | |

Constraint: `check (project_id is not null or event_id is not null)`

### Tabla: `expenses`

Gasto vinculado a un **evento** O a un **proyecto** (uno de los dos obligatorio).

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | RLS |
| project_id | uuid FK projects (nullable) | Gasto directo de proyecto |
| event_id | uuid FK events (nullable) | Gasto de evento |
| concept | text NOT NULL | |
| amount | numeric NOT NULL | En € |
| category | text | transporte, material, colaborador, espacio, software, otros |
| expense_date | date | |
| is_deductible | boolean | Default true |
| created_at | timestamptz | |

Constraint: `check (project_id is not null or event_id is not null)`

---

## SQL de inicialización de Supabase

**Antes de ejecutar, borrar tablas existentes:**

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
drop table if exists expenses;
drop table if exists incomes;
drop table if exists events;
drop table if exists projects;
drop table if exists profiles;
```

### Tablas

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  profession text,
  tax_rate numeric default 15,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  client text,
  category text default 'otros',
  status text default 'draft',
  start_date date not null,
  end_date date,
  color text default '#4f98a3',
  notes text,
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  client text,
  category text default 'otros',
  status text default 'draft',
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  color text default '#4f98a3',
  notes text,
  created_at timestamptz default now()
);

create table incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  concept text not null,
  amount numeric not null,
  tax_rate numeric default 15,
  expected_date date,
  paid_date date,
  is_paid boolean default false,
  created_at timestamptz default now(),
  constraint chk_income_link check (project_id is not null or event_id is not null)
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  concept text not null,
  amount numeric not null,
  category text default 'otros',
  expense_date date,
  is_deductible boolean default true,
  created_at timestamptz default now(),
  constraint chk_expense_link check (project_id is not null or event_id is not null)
);
```

### RLS y policies

```sql
alter table profiles enable row level security;
alter table projects enable row level security;
alter table events enable row level security;
alter table incomes enable row level security;
alter table expenses enable row level security;

create policy "profiles: usuario propio" on profiles
  for all using (auth.uid() = id);

create policy "projects: usuario propio" on projects
  for all using (auth.uid() = user_id);

create policy "events: usuario propio" on events
  for all using (auth.uid() = user_id);

create policy "incomes: usuario propio" on incomes
  for all using (auth.uid() = user_id);

create policy "expenses: usuario propio" on expenses
  for all using (auth.uid() = user_id);
```

### Trigger para crear perfil al registrarse

**Importante**: usar `public.profiles` explícito — sin el schema la función falla en Supabase.

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, profession)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'profession'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

---

## Pantallas principales

### 1. `/auth` — Autenticación

- Login con email + contraseña, registro de cuenta nueva
- `supabase.auth.signInWithPassword` y `supabase.auth.signUp`
- Redirige a `/dashboard` si ya hay sesión activa

### 2. `/dashboard` — Resumen económico

KPIs del mes seleccionado (ingresos previstos, cobrados, gastos, beneficio neto).
Agrega ingresos y gastos de **ambos niveles** (evento + proyecto directo).

- Cobros pendientes próximos 30 días → enlaza a `/events/:id` o `/projects/:id` según corresponda
- Proyectos activos (status confirmed o in_progress)

### 3. `/calendar/events` — Calendario de eventos

- React Big Calendar con `start_datetime` / `end_datetime` (hora exacta)
- Es el calendario que se comparte hacia afuera
- Click en evento → panel lateral con datos del evento y enlace al detalle

### 4. `/calendar/projects` — Calendario de proyectos

- React Big Calendar con `start_date` / `end_date` (rango de días)
- Solo uso interno
- Click en proyecto → panel lateral con datos y enlace al detalle

### 5. `/events` — Gestión de eventos

- Lista de eventos con filtros (estado, categoría, proyecto)
- Tarjeta con nombre, cliente, datetime, proyecto asociado, estado
- Detalle `/events/:id`: info del evento + ingresos del evento + gastos del evento + resumen financiero
- Formulario de creación/edición: todos los campos del modelo

### 6. `/projects` — Gestión de proyectos

- Lista con filtros por estado y categoría
- Detalle `/projects/:id`:
  - Info general (editable)
  - Sección de eventos asociados (con enlace a cada uno)
  - Ingresos directos del proyecto (los no atribuibles a un evento concreto)
  - Gastos directos del proyecto
  - Resumen financiero agregado (proyecto + todos sus eventos)

### 7. `/settings` — Configuración

- Nombre, profesión, retención IRPF habitual
- Botón cerrar sesión

---

## Convenciones de código

### Componentes React

- Un componente por archivo, PascalCase
- Los componentes de UI no contienen lógica de negocio ni llamadas a Supabase

### Hooks personalizados

- Toda la lógica de datos va en `/hooks`
- Nunca llamar a Supabase directamente desde un componente
- Siempre exponer `loading`, `error`, `data`

Firma de useIncomes y useExpenses:
```js
useIncomes(userId)                                         // todos (dashboard)
useIncomes(userId, { eventId: 'xxx' })                     // ingresos de un evento
useIncomes(userId, { projectId: 'xxx' })                   // ingresos directos de un proyecto
useIncomes(userId, { projectId: 'xxx', eventIds: [...] })  // proyecto + todos sus eventos (ProjectDetail KPIs)
```

El modo `projectId + eventIds` usa un filtro OR en Supabase: `project_id = X OR event_id IN (...)`.
La clave de dependencia se serializa con `.sort().join(',')` para evitar re-renders innecesarios cuando el array de IDs no cambia.

### Llamadas a Supabase

```jsx
const { data, error } = await supabase
  .from('events')
  .insert({ ...eventData, user_id: userId })
  .select()
  .single()

if (error) { /* mostrar mensaje */ return }
```

### Formatters — usar siempre desde `/lib/formatters.js`

```js
formatCurrency(amount)       // → "1.200,00 €"
formatDate(dateStr)          // → "15/05/2025" (para campos date de BD)
formatDatetime(isoStr)       // → "15/05/2025, 20:00" (para timestamptz)
toDatetimeLocal(isoStr)      // → "2025-05-15T20:00" (para input datetime-local)
formatDateRange(start, end)  // → "15/05 – 20/05"
```

### Nomenclatura

- Variables y funciones: `camelCase`
- Componentes y archivos: `PascalCase`
- Hooks: prefijo `use`
- Constantes globales: `UPPER_SNAKE_CASE`

---

## Variables de entorno

Crear `.env.local` en la raíz (en `.gitignore`, nunca subir):

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## Comandos útiles

```bash
npm run dev      # Arrancar en local
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting
```

---

## Estado actual del proyecto

- [x] Setup inicial con Vite + React + Tailwind v4
- [x] Autenticación básica (login/registro)
- [x] Layout principal (sidebar + topbar)
- [x] **Migración BD al nuevo esquema** ejecutada en Supabase — 5 tablas: `profiles`, `projects`, `events`, `incomes`, `expenses`
- [x] RLS activo en todas las tablas
- [x] Trigger `on_auth_user_created` con `public.profiles` explícito (crítico — sin schema falla silenciosamente)
- [x] Hook `useEvents.js` — CRUD, filtra por `projectId` opcional
- [x] `useIncomes` y `useExpenses` actualizados: `{ projectId, eventId, eventIds }` con filtro OR
- [x] Vista Dashboard — KPIs mes seleccionado, cobros pendientes 30 días, proyectos activos
- [x] Dashboard agrega ingresos/gastos de eventos Y de proyecto directo (ambos niveles)
- [x] Calendario de eventos (`/calendar/events`) — React Big Calendar con datetime exacto
- [x] Calendario de proyectos (`/calendar/projects`) — React Big Calendar con rangos de fecha
- [x] Vista Events — lista con filtros, EventDetail con ingresos/gastos propios, EventForm
- [x] Vista Projects — lista y detalle con sección de eventos asociados
- [x] ProjectDetail KPIs agregan ingresos/gastos del proyecto + todos sus eventos
- [x] ProjectDetail tablas editables muestran solo ingresos/gastos directos (sin mezclar los de eventos)
- [x] Formularios de proyectos, eventos, ingresos y gastos
- [x] Vista Settings
- [ ] Deploy en Vercel

---

## Notas importantes

- **RLS obligatorio** en todas las tablas. Policy básica: `auth.uid() = user_id`
- **Trigger**: usar siempre `public.profiles` (con schema explícito) en la función `handle_new_user` — sin el schema la inserción falla silenciosamente en Supabase
- **Doble user_id en incomes/expenses**: se guarda `user_id` directamente (además del vínculo a evento o proyecto) para aplicar RLS sin joins
- **Doble vínculo en incomes/expenses**: `project_id` o `event_id`, uno de los dos siempre presente (constraint `check`)
- **No usar localStorage**: Supabase gestiona la sesión con cookies
- **Idioma de la UI**: español (España), tuteo
- **Formato fechas en UI**: DD/MM/YYYY — usar `formatDate()` para campos `date`, `formatDatetime()` para `timestamptz`
- **Formato fechas en BD**: ISO 8601 — Supabase lo maneja automáticamente
- **Moneda**: euros (€) — usar siempre `formatCurrency()`
- **Calendario de eventos**: es el que se comparte hacia afuera. El de proyectos es solo interno.
- **Error 409 al crear proyectos/eventos**: si aparece, significa que el perfil del usuario no existe en `profiles` (el trigger falló antes del fix). Solución: ejecutar en Supabase SQL `INSERT INTO public.profiles (id) SELECT id FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);`
- **ProjectDetail — separación de datos**: `incomes` y `expenses` del hook incluyen todo (proyecto + eventos); `directIncomes`/`directExpenses` filtran solo los de `project_id = id` para las tablas editables. Los KPIs usan el total combinado.
