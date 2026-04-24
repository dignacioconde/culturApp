# CulturaApp

Herramienta de gestión económica y de proyectos para trabajadores del sector cultural independiente: músicos, fotógrafos, actores, diseñadores, gestores culturales y cualquier persona que trabaje por cuenta propia con múltiples proyectos simultáneos.

---

## Historias de usuario

### Gestión de proyectos

**Como trabajador cultural independiente,**
- quiero crear un proyecto con nombre, cliente, categoría y fechas para tener registrado cada trabajo que acepto.
- quiero ver todos mis proyectos en una lista con filtros por estado y categoría, para localizar rápidamente lo que busco.
- quiero cambiar el estado de un proyecto (borrador → confirmado → en curso → completado) para saber en qué punto está cada trabajo.
- quiero asignar un color a cada proyecto para diferenciarlo visualmente en el calendario.
- quiero editar o eliminar un proyecto cuando cambian las condiciones o se cancela.

### Calendario

**Como trabajador cultural independiente,**
- quiero ver todos mis proyectos en un calendario mensual para tener una visión global de mi agenda.
- quiero hacer clic en un proyecto del calendario y ver su información básica sin salir de la vista, para consultar rápidamente sin perder el contexto.
- quiero poder crear un proyecto nuevo directamente desde la vista de calendario.

### Ingresos

**Como trabajador cultural independiente,**
- quiero añadir ingresos a cada proyecto con concepto, importe y fecha prevista de cobro, para saber cuánto voy a cobrar y cuándo.
- quiero indicar la retención de IRPF de cada ingreso para calcular automáticamente el neto real que recibiré.
- quiero marcar un ingreso como cobrado cuando llega el dinero, para distinguir lo previsto de lo real.
- quiero ver en el dashboard los cobros pendientes de los próximos 30 días, para anticiparme a mi flujo de caja.

### Gastos

**Como trabajador cultural independiente,**
- quiero registrar los gastos de cada proyecto (transporte, material, colaboradores, espacio...) para conocer el coste real de cada trabajo.
- quiero indicar si un gasto es fiscalmente deducible, para tener la información lista para la declaración.
- quiero ver el total de gastos por proyecto para calcular si el trabajo me resulta rentable.

### Dashboard financiero

**Como trabajador cultural independiente,**
- quiero ver un resumen de mis ingresos previstos y cobrados de este mes para saber cómo va el mes.
- quiero ver mis gastos del mes y el beneficio neto estimado (cobrado menos gastos) para tener una foto rápida de mi situación económica.
- quiero ver qué proyectos tengo activos ahora mismo sin tener que ir a la lista completa.

### Perfil y configuración

**Como trabajador cultural independiente,**
- quiero guardar mi nombre, profesión y retención de IRPF habitual para que se rellene automáticamente al crear nuevos ingresos.
- quiero poder cerrar sesión desde cualquier pantalla.

---

## Requisitos previos

- Node.js 18 o superior
- Cuenta en [Supabase](https://supabase.com) (gratuita)

---

## Instalación

```bash
git clone https://github.com/tu-usuario/culturapp.git
cd culturapp
npm install
```

---

## Configuración de Supabase

### 1. Crear el proyecto en Supabase

Ve a [supabase.com](https://supabase.com), crea un nuevo proyecto y anota la **URL** y la **anon key** (Settings → API).

### 2. Crear las tablas

En el **editor SQL** de Supabase ejecuta:

```sql
-- Perfiles (extiende auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  profession text,
  tax_rate numeric default 15,
  created_at timestamptz default now()
);

-- Proyectos
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
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

-- Ingresos
create table incomes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  concept text not null,
  amount numeric not null,
  tax_rate numeric default 15,
  expected_date date,
  paid_date date,
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- Gastos
create table expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  concept text not null,
  amount numeric not null,
  category text default 'otros',
  expense_date date,
  is_deductible boolean default true,
  created_at timestamptz default now()
);
```

### 3. Activar RLS y crear políticas

```sql
alter table profiles enable row level security;
alter table projects enable row level security;
alter table incomes enable row level security;
alter table expenses enable row level security;

create policy "profiles: usuario propio" on profiles
  for all using (auth.uid() = id);

create policy "projects: usuario propio" on projects
  for all using (auth.uid() = user_id);

create policy "incomes: usuario propio" on incomes
  for all using (auth.uid() = user_id);

create policy "expenses: usuario propio" on expenses
  for all using (auth.uid() = user_id);
```

### 4. Trigger para crear el perfil al registrarse

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, profession)
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

### 5. Variables de entorno

Crea `.env.local` en la raíz del proyecto (no lo subas a git):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## Arrancar en local

```bash
npm run dev
# → http://localhost:5173
```

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Linting con ESLint |

---

## Deploy en Vercel

1. Sube el repositorio a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en las variables de entorno del proyecto
4. Vercel desplegará automáticamente en cada push a `main`
