# AGENTS.md — Cachés

Archivo de contexto para Codex. Léelo completo antes de tocar cualquier archivo.

**OBLIGATORIO al inicio de cada conversación (Claude Code)**: leer `.memory/MEMORY.md` y los archivos de memoria enlazados que sean relevantes. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

---

## Sistema de memoria

El proyecto tiene un sistema de memoria persistente en `.memory/` (directorio en la raíz del repo, no versionado). Es la fuente de preferencias, decisiones y contexto acumulado del usuario que debe sobrevivir entre conversaciones y sesiones de agentes.

**Al inicio de cada tarea**: leer `MEMORY.md` para conocer preferencias activas y contexto del proyecto antes de tomar decisiones.

**Durante la tarea**: si se descubre algo nuevo sobre preferencias del usuario, decisiones no obvias o contexto del proyecto, delegarlo a `@cultura-docs` para que lo persista.

**Gate obligatorio antes de abrir PR**: ningun agente, Codex o Claude Code debe abrir una PR sin hacer un checkpoint de memoria. Revisar issue relacionada, diff y commits de la rama contra la base; guardar en `.memory/` solo preferencias, decisiones duraderas, gotchas recurrentes o reglas de trabajo. Si no hay nada durable que guardar, declararlo explicitamente como `Memoria: no aplica`. Si se actualiza `.memory/`, esos cambios deben quedar commiteados y pusheados antes de crear la PR. Incluir siempre en la descripcion de la PR una seccion `Memoria` con `actualizada` o `no aplica`.

**Tipos de memoria**:
- `feedback`: correcciones o validaciones de decisiones ("no hagas X", "sí, exactamente así")
- `project`: decisiones de producto, bugs conocidos, iniciativas activas con fecha
- `reference`: recursos externos (issues GitHub, dashboards, servicios)
- `user`: rol, conocimiento y objetivos del usuario

**Quién escribe**: `cultura-docs` es el responsable de escribir y actualizar los archivos de memoria. El lead lo activa cuando detecta algo que merece persistirse.

**No guardar en memoria**: convenciones de código, rutas de archivos, historial git o estado efímero de la tarea actual. Eso vive en `AGENTS.md`, el código y `AGENT_STATE.md`.

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
| Frontend framework | React | 19.2.5 | Ecosistema maduro |
| Build tool | Vite | 8.0.10 | Rápido, sin configuración compleja |
| Estilos | Tailwind CSS | v4 | Prototipar rápido, utility-first |
| Iconos | Lucide React | 1.9.0 | Limpio, consistente, 1500+ iconos |
| Calendario | React Big Calendar | 1.19.4 | Vista mes/semana/día, drag & drop |
| Fechas | Day.js | 1.11.20 | Ligero, API limpia |
| Routing | React Router DOM | 7.14.2 | Navegación entre vistas |
| Backend & Auth | Supabase JS | 2.104.1 | PostgreSQL + Auth + API REST sin servidor propio |
| Deploy | Vercel | — | Deploy automático desde GitHub |

---

## Preferencias de trabajo

- Ahorrar palabras y tokens: responder de forma concisa salvo que el usuario pida detalle.
- Para Codex, este archivo (`AGENTS.md`) es la fuente principal de contexto.
- `CLAUDE.md` se mantiene como espejo para Claude Code; si diverge, priorizar `AGENTS.md`.
- Las skills portables viven en `.agents/skills/<skill-name>/SKILL.md`. Claude Code las descubre mediante symlinks en `.claude/skills/<skill-name>`. La estrategia y plantilla estan en `docs/agent-skills-strategy.md` y `.agents/templates/portable-skill/SKILL.md`.
- Cuando el usuario pida ejecutar agentes/OpenCode, no hacer una investigacion manual previa por defecto. Lanzar los agentes con el flujo estipulado y dejar que ellos lean contexto, diagnostiquen y propongan/ejecuten segun la tarea. Solo hacer trabajo previo minimo si es necesario para construir el comando, definir ownership seguro o resolver un bloqueo real.
- **Product Brain es la fuente principal de verdad**: backlog, issues internas, releases, planes, decisiones y workflow viven en `docs/project/`. GitHub Issues son soporte tecnico cuando haga falta PR/CI/milestone, no el backlog canonico.
- **Flujo obligatorio para implementacion**: Ante cualquier tarea de implementacion, Codex y Claude Code deben leer `docs/project/START_HERE.md`, `docs/project/releases/CURRENT_RELEASE.md`, `docs/project/plans/CURRENT_PLAN.md`, `docs/project/backlog/BACKLOG.md` y la issue Markdown `CACH-*` relacionada. Si falta issue, crear/proponer issue Markdown antes de implementar. Si falta release activa para una feature grande, parar y proponer crear/activar release. La rama de trabajo debe salir de la rama de release activa si la tarea pertenece a una release. Ver `docs/project/process/DEVELOPMENT_WORKFLOW.md` y `docs/project/process/AGENT_WORKFLOW.md`.

---

## Flujo de trabajo con agentes OpenCode

Este proyecto debe evolucionar mediante agentes OpenCode cuando el usuario lo pida. Tratar a los agentes como un equipo de desarrollo con tareas cerradas, ownership claro y verificacion obligatoria.

### Principios

- `AGENTS.md` es el contrato principal: cada agente debe leerlo completo antes de tocar archivos.
- Dar a los agentes objetivos concretos, no misiones amplias tipo "mejora toda la app".
- Separar investigacion, implementacion y revision cuando la tarea tenga riesgo o varias areas afectadas.
- No hacer investigacion manual previa por defecto: lanzar agentes y dejar que diagnostiquen, salvo que haga falta definir ownership, preparar el comando o resolver un bloqueo.
- Trabajar siempre con rama trazable a Product Brain. Si hay release activa, la rama de tarea sale de la rama de release, no directamente de `main`. La release branch se integra a `main` cuando este validada.
- Un preview de Vercel no cuenta como despliegue de produccion. Si el usuario espera ver el cambio en la app publicada, la tarea no esta terminada hasta que la PR se mergee a `main`, el alias de produccion quede verificado y la rama de trabajo quede borrada.

### Metodo ante problemas descubiertos

Cuando se descubra un problema nuevo que requiera seguimiento, usar este flujo por defecto:

1. Abrir o localizar una issue Markdown `CACH-*` en `docs/project/issues/` con contexto, alcance y criterios de aceptacion.
2. Asignarla a la release activa o declarar explicitamente que va fuera de release.
3. Asegurar la rama de release activa y crear una rama de tarea desde ella. Si ya existe una rama valida, reutilizarla; si hay cambios sin commitear, parar y declararlo.
4. Ejecutar agentes OpenCode con esa issue como contexto, ownership claro y verificacion obligatoria.
5. Implementar/ajustar el fix y ejecutar `npm run lint` y `npm run build` si toca codigo de app.
6. Ejecutar `npm run pb:check` si toca `docs/project/`.
7. Actualizar issue Markdown, release, backlog y plan actual con resultado, commits, rama y validacion.
8. Hacer checkpoint de memoria pre-PR: issue, diff y commits contra base. Activar `@cultura-docs` si hay que persistir memoria; si no, documentar `Memoria: no aplica`.
9. Crear commit(s) con formato `<type>(CACH-XXXX): summary`, incluyendo `.memory/` si se actualizo.
10. Hacer push de la rama.
11. Abrir PR hacia la rama de release si es feature/fix de release; abrir PR hacia `main` solo para hotfix directo o cierre de release.
12. Mergear la rama de tarea a la release branch cuando las verificaciones pasen.
13. Cerrar la issue Markdown como `Ready for Release`; marcar `Released` solo cuando la release se mergee a `main`.
14. Mergear la release a `main` cuando la release este validada. Tras el merge, verificar produccion si aplica y limpiar ramas.
15. Incluir en el cierre: resumen, commit(s), PR o rama, verificacion ejecutada, estado de memoria/docs, estado de produccion y estado de limpieza de rama.

Si el problema es visual, incluir tambien ruta, viewport, captura/sintoma y criterio visual de aceptacion.

### Roles recomendados

- **Explorer**: lee codigo, diagnostica y propone. No edita archivos.
- **Worker**: implementa una tarea concreta. Debe tener ownership explicito de archivos o modulos.
- **Reviewer**: revisa el diff desde postura de code review: bugs, regresiones, inconsistencias con `AGENTS.md` y pruebas faltantes.

### Uso de comandos

Usar el flujo estipulado:

```bash
npm run agents:plan -- "Tarea concreta vinculada a CACH-XXXX y release activa"
npm run agents:run -- "Tarea concreta vinculada a CACH-XXXX"
npm run agents:parallel -- "Explorer: ..." "Worker: ..."
```

Cuando haya agentes en paralelo, asignar ownership disjunto:

- `src/pages/Events/*`
- `src/hooks/useEvents.js`
- `src/pages/Projects/*`
- Solo revision, sin editar

### Definition of Done

Una tarea de agente se considera terminada solo cuando:

- Respeta `AGENTS.md`.
- Mantiene la UI en espanol de Espana y el tuteo.
- No rompe rutas existentes.
- No llama a Supabase directamente desde componentes; usa hooks.
- Ejecuta `npm run build` correctamente si toca codigo de app.
- Ejecuta `npm run lint` si esta disponible y aplica al cambio.
- Si toca logica financiera, explica el calculo afectado.
- Si toca datos, respeta RLS, `user_id` y el modelo evento/proyecto.
- Si va a abrir PR, completa el checkpoint de memoria pre-PR y lo refleja en la descripcion de la PR.
- Si el cambio debe verse en produccion, mergea la PR a `main` y verifica el alias de produccion; un preview no es suficiente.
- Tras un merge correcto contra `main`, elimina la rama de trabajo remota y local; borra la rama local solo despues de cambiar a `main` actualizado.
- Entrega resumen corto: archivos tocados, cambios hechos y pruebas ejecutadas.

### Checkpoint de memoria pre-PR

Aplica a **OpenCode agents**, **Codex trabajando directo** y **Claude Code trabajando directo**. No es opcional cuando el siguiente paso sea abrir una PR.

1. Leer `.memory/MEMORY.md` y los archivos relevantes enlazados.
2. Revisar la issue o contexto de la tarea, el diff actual y los commits de la rama contra la base.
3. Decidir si surgio memoria durable:
   - preferencias o correcciones del usuario;
   - decisiones de producto o arquitectura no obvias;
   - gotchas recurrentes que evitaran redescubrimiento;
   - reglas de workflow o referencias externas utiles.
4. No guardar historial operativo, rutas sueltas, listas de commits, estado temporal, secretos ni datos sensibles.
5. Si aplica, actualizar `.memory/` antes del commit final de la rama. En OpenCode, el lead debe activar `@cultura-docs`; Codex y Claude Code pueden editar `.memory/` directamente siguiendo `memory-protocol`.
6. Si no aplica, dejar constancia en el cierre y en la PR: `Memoria: no aplica`.
7. La descripcion de la PR debe incluir `Memoria: actualizada en ...` o `Memoria: no aplica`.

### Issues visuales y responsive

Cuando una tarea sea visual, responsive o dependa de un componente de terceros con layout propio (especialmente `react-big-calendar`), no basta con inspeccionar clases Tailwind o ejecutar lint/build.

El prompt para agentes debe incluir:

- Ruta exacta afectada, por ejemplo `/calendar/events`.
- Viewport o condicion de reproduccion: ancho, alto, zoom o "ventana compacta".
- Sintoma visual concreto: que se ve y que deberia verse.
- Captura si existe.
- Criterio de aceptacion visual verificable.

Ejemplo de prompt util:

```text
Reproduce en navegador con viewport compacto. En /calendar/events, al reducir la ventana, React Big Calendar muestra toolbar y cabecera Sun-Mon-Tue, pero no pinta las filas del mes. Inspecciona alturas computadas de .rbc-calendar, .rbc-month-view y .rbc-month-row. No basta con cambiar min-h del card; verifica con screenshot que las semanas son visibles.
```

Para calendarios, recordar: `react-big-calendar` necesita una altura real calculable en el contenedor interno. Si se usa `style={{ height: '100%' }}` dentro de padres con `min-height`, `flex-1`, `min-h-0` u `overflow-hidden`, puede renderizar toolbar/cabecera pero colapsar las filas del mes. La verificacion debe confirmar que se ven las semanas, no solo que desaparece el overflow.

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
├── AGENTS.md
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
│   │   │   ├── Input.jsx      ← Input, Select, DateInput, DateTimeInput, Textarea
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

KPIs del mes seleccionado (ingresos previstos, cobrados, gastos, cobro bruto/hora, beneficio neto).
Agrega ingresos y gastos de **ambos niveles** (evento + proyecto directo).

- Cobros pendientes próximos 30 días → enlaza a `/events/:id` o `/projects/:id` según corresponda
- Proyectos activos (status confirmed o in_progress)
- Cobro bruto/hora: ingresos **cobrados** vinculados a eventos, antes de IRPF, divididos entre las horas de esos eventos (`end_datetime - start_datetime`). Los ingresos directos de proyecto no se incluyen en esta métrica para no inflar el €/h.

### 3. `/calendar/events` — Calendario de eventos

- React Big Calendar con `start_datetime` / `end_datetime` (hora exacta)
- Es el calendario que se comparte hacia afuera
- Click en evento → panel lateral con datos del evento y enlace al detalle
- Navegación de fecha/vista controlada; visible aunque no haya eventos
- Seleccionar un hueco del calendario abre el formulario con fecha/hora precargadas
- Vista semana/día limitada a horario útil desde las 08:00 y formato 24h.
- En móvil, la vista semana usa scroll horizontal como solución aceptada por ahora. Si se reabre la mejora, crear una issue nueva con criterio UX concreto y captura móvil real.

### 4. `/calendar/projects` — Calendario de proyectos

- React Big Calendar con `start_date` / `end_date` (rango de días)
- Solo uso interno
- Click en proyecto → panel lateral con datos y enlace al detalle
- Navegación de fecha/vista controlada; visible aunque no haya proyectos
- Seleccionar días del calendario abre el formulario con rango precargado

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

### Selectores, fechas y formularios

- No usar `<select>` nativo en pantallas de app: el menú del navegador/SO se ve demasiado pequeño en móvil. Usar siempre `Select` de `src/components/ui/Input.jsx`.
- No usar `input type="date"` ni `input type="datetime-local"` directamente en páginas. Usar `Input type="date"` o `Input type="datetime-local"`, que renderizan selectores propios grandes y mantienen el valor compatible con BD.
- `Input type="date"` devuelve `YYYY-MM-DD` y muestra `DD/MM/YYYY`.
- `Input type="datetime-local"` compone fecha + hora y devuelve `YYYY-MM-DDTHH:mm`; el selector de hora hace scroll hasta la hora seleccionada.
- Para eventos, la hora por defecto de inicio debe ser `08:00`. La hora de fin debe usar como referencia la hora de inicio cuando el usuario no haya elegido otra.
- Mantener targets táctiles de selectores, checkboxes y swatches de color en torno a 40-44px mínimo.

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
formatCurrencyPerHour(rate)  // → "75,00 €/h"
formatHours(hours)           // → "7,5"
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
- [x] Vista Dashboard — KPIs mes seleccionado, cobro bruto/hora, cobros pendientes 30 días, proyectos activos
- [x] Dashboard agrega ingresos/gastos de eventos Y de proyecto directo (ambos niveles)
- [x] Calendario de eventos (`/calendar/events`) — React Big Calendar con datetime exacto, navegación controlada y creación desde huecos
- [x] Calendario de eventos usa 08:00 como hora inicial útil, formato 24h y selectores propios en formularios
- [x] Calendario de proyectos (`/calendar/projects`) — React Big Calendar con rangos de fecha, navegación controlada y creación desde selección de días
- [x] Vista Events — lista con filtros, EventDetail con ingresos/gastos propios, EventForm
- [x] Vista Projects — lista y detalle con sección de eventos asociados
- [x] ProjectDetail KPIs agregan ingresos/gastos del proyecto + todos sus eventos
- [x] ProjectDetail tablas editables muestran solo ingresos/gastos directos (sin mezclar los de eventos)
- [x] Formularios de proyectos, eventos, ingresos y gastos
- [x] Selectores nativos sustituidos por controles propios grandes (`Select`, fecha, fecha+hora)
- [x] Mejoras UX móvil en modales, estados vacíos, breadcrumbs, tablas con overflow y KPIs del dashboard
- [x] Vista Settings
- [x] Deploy en Vercel
- [x] Mejora UX móvil inicial de la vista semana de `/calendar/events` — issue `#3` cerrada; futuras mejoras requieren issue nueva

---

## Notas importantes

- **RLS obligatorio** en todas las tablas. Policy básica: `auth.uid() = user_id`
- **Trigger**: usar siempre `public.profiles` (con schema explícito) en la función `handle_new_user` — sin el schema la inserción falla silenciosamente en Supabase
- **Doble user_id en incomes/expenses**: se guarda `user_id` directamente (además del vínculo a evento o proyecto) para aplicar RLS sin joins
- **Doble vínculo en incomes/expenses**: `project_id` o `event_id`, uno de los dos siempre presente (constraint `check`)
- **No acceder a localStorage manualmente**: Supabase JS gestiona la persistencia de sesión del cliente.
- **Idioma de la UI**: español (España), tuteo
- **Formato fechas en UI**: DD/MM/YYYY — usar `formatDate()` para campos `date`, `formatDatetime()` para `timestamptz`
- **Formato fechas en BD**: ISO 8601 — Supabase lo maneja automáticamente
- **Moneda**: euros (€) — usar siempre `formatCurrency()`
- **Calendario de eventos**: es el que se comparte hacia afuera. El de proyectos es solo interno.
- **Vista semana móvil**: `react-big-calendar` en semana puede comprimir demasiado la información en móvil. El scroll horizontal actual es una solución aceptada por ahora; si se reabre el tema, verificar con captura en viewport móvil real y una decisión UX concreta.
- **Selectores nativos**: evitar `<select>`, `input type="date"` y `input type="datetime-local"` directos en páginas; usar los wrappers de `Input.jsx` para que los menús no salgan pequeños.
- **Horas de eventos**: la experiencia normal empieza en `08:00`; evitar defaults de madrugada salvo que el usuario seleccione explícitamente esa hora.
- **Cobro bruto/hora**: usar solo ingresos cobrados asociados a eventos (`event_id`) y horas de eventos con `end_datetime`. No mezclar ingresos directos de proyecto en el numerador de esta métrica.
- **Error 409 al crear proyectos/eventos**: si aparece, significa que el perfil del usuario no existe en `profiles` (el trigger falló antes del fix). Solución: ejecutar en Supabase SQL `INSERT INTO public.profiles (id) SELECT id FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);`
- **ProjectDetail — separación de datos**: `incomes` y `expenses` del hook incluyen todo (proyecto + eventos); `directIncomes`/`directExpenses` filtran solo los de `project_id = id` para las tablas editables. Los KPIs usan el total combinado.
