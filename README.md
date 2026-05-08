# Cachés

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
- quiero ver todos mis eventos y proyectos en calendarios navegables para tener una visión global de mi agenda.
- quiero hacer clic en un evento o proyecto del calendario y ver su información básica sin salir de la vista, para consultar rápidamente sin perder el contexto.
- quiero poder crear un evento o proyecto nuevo seleccionando un hueco o rango directamente desde la vista de calendario.

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
- quiero ver mi cobro bruto por hora antes de IRPF para entender cuánto estoy cobrando realmente por las horas de eventos ya cobrados.
- quiero ver qué proyectos tengo activos ahora mismo sin tener que ir a la lista completa.

### Perfil y configuración

**Como trabajador cultural independiente,**
- quiero guardar mi nombre, profesión y retención de IRPF habitual para que se rellene automáticamente al crear nuevos ingresos.
- quiero poder cerrar sesión desde cualquier pantalla.

---

## Estado UX actual

- La app usa selectores propios grandes para categorías, estados, proyectos, fechas y horas. Esto evita los menús nativos pequeños del navegador en móvil.
- Los eventos usan horario en formato 24h. La creación de eventos toma `08:00` como hora inicial habitual y la hora de fin parte de la hora de inicio cuando no hay otra selección.
- El calendario de eventos limita la vista semana/día a horario útil desde las 08:00.
- La vista semana móvil de `/calendar/events` quedó aceptada con scroll horizontal tras la issue `#3`; si se prioriza una mejora más ambiciosa, abrir nueva issue con patrón UX y captura móvil.

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

En el **editor SQL** de Supabase ejecuta el esquema actual. Si vienes de una versión anterior, borra antes las tablas existentes como indica `AGENTS.md`.

```sql
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  profession text,
  tax_rate numeric default 15,
  onboarding_completed boolean not null default false,
  onboarding_completed_at timestamptz,
  usage_consent boolean not null default false,
  usage_consent_at timestamptz,
  usage_consent_version text,
  beta_invite_id uuid,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

create table beta_invites (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text,
  max_redemptions integer not null default 1 check (max_redemptions > 0),
  redeemed_count integer not null default 0 check (redeemed_count >= 0),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint beta_invites_redeemed_count_lte_max check (redeemed_count <= max_redemptions),
  constraint beta_invites_code_hash_sha256 check (code_hash ~ '^[0-9a-f]{64}$')
);

create table beta_invite_redemptions (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.beta_invites(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id)
);

alter table profiles
  add constraint profiles_beta_invite_id_fkey
  foreign key (beta_invite_id) references public.beta_invites(id) on delete set null;

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

### 3. Activar RLS y crear políticas

```sql
alter table profiles enable row level security;
alter table beta_invites enable row level security;
alter table beta_invite_redemptions enable row level security;
alter table projects enable row level security;
alter table events enable row level security;
alter table incomes enable row level security;
alter table expenses enable row level security;

create policy "profiles: usuario propio" on profiles
  for all using (auth.uid() = id);

-- beta_invites y beta_invite_redemptions no tienen políticas SELECT/INSERT/UPDATE
-- para anon/authenticated. Se gestionan desde SQL interno y el trigger de registro.

create policy "projects: usuario propio" on projects
  for all using (auth.uid() = user_id);

create policy "events: usuario propio" on events
  for all using (auth.uid() = user_id);

create policy "incomes: usuario propio" on incomes
  for all using (auth.uid() = user_id);

create policy "expenses: usuario propio" on expenses
  for all using (auth.uid() = user_id);
```

### 4. Trigger para crear el perfil al registrarse

```sql
create or replace function set_beta_invites_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger beta_invites_set_updated_at
  before update on public.beta_invites
  for each row execute function set_beta_invites_updated_at();

create or replace function prevent_beta_invite_profile_changes()
returns trigger as $$
begin
  if old.beta_invite_id is distinct from new.beta_invite_id then
    raise exception 'beta_invite_id_is_immutable';
  end if;

  if auth.uid() is not null and old.role is distinct from new.role then
    raise exception 'profile_role_is_immutable';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger profiles_prevent_beta_invite_changes
  before update on public.profiles
  for each row execute function prevent_beta_invite_profile_changes();

create or replace function current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

create or replace function handle_new_user()
returns trigger as $$
declare
  invite_code text;
  invite_hash text;
  claimed_invite_id uuid;
begin
  invite_code := nullif(lower(trim(new.raw_user_meta_data->>'beta_invite_code')), '');

  if invite_code is null then
    raise exception 'beta_invite_code_required'
      using hint = 'Incluye un codigo de invitacion beta valido para crear la cuenta.';
  end if;

  invite_hash := encode(digest(invite_code, 'sha256'), 'hex');

  update public.beta_invites
  set redeemed_count = redeemed_count + 1
  where code_hash = invite_hash
    and revoked_at is null
    and (expires_at is null or expires_at > now())
    and redeemed_count < max_redemptions
  returning id into claimed_invite_id;

  if claimed_invite_id is null then
    raise exception 'beta_invite_code_invalid_or_redeemed'
      using hint = 'El codigo de invitacion beta no existe, ha caducado o ya se ha consumido.';
  end if;

  insert into public.beta_invite_redemptions (invite_id, user_id)
  values (claimed_invite_id, new.id);

  insert into public.profiles (id, full_name, profession, beta_invite_id)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'profession',
    claimed_invite_id
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public, auth, extensions;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

### 4.1. Crear códigos beta manualmente

Guarda solo el hash SHA-256 normalizado del código (`lower(trim(codigo))`). Ejecuta este SQL desde el editor SQL de Supabase con un código nuevo y largo:

```sql
insert into public.beta_invites (code_hash, label, max_redemptions, expires_at)
values (
  encode(extensions.digest(lower(trim('CACHES-BETA-2026-EJEMPLO')), 'sha256'), 'hex'),
  'Beta 8 - ejemplo manual',
  1,
  now() + interval '30 days'
);
```

Para códigos multiuso, sube `max_redemptions`. Para revocar uno:

```sql
update public.beta_invites
set revoked_at = now()
where code_hash = encode(extensions.digest(lower(trim('CACHES-BETA-2026-EJEMPLO')), 'sha256'), 'hex');
```

### 4.2. Primer administrador beta

El panel interno de invitaciones usa `profiles.role = 'admin'`. El primer admin se asigna manualmente desde el editor SQL de Supabase, después de que exista su perfil:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DEL_USUARIO_ADMIN';
```

Desde la app, las invitaciones se gestionan en `/admin/invitaciones`. El cliente nunca usa service role ni lee directamente `beta_invites`: crea, lista y revoca mediante RPCs con comprobación de admin. El código plano solo se muestra una vez al crearlo; después queda guardado solo el hash SHA-256 normalizado.

### 4.3. Operaciones directas de base de datos

Para agentes y mantenimiento, la vía preferida es Supabase MCP acotado al proyecto. Las operaciones manuales de BD que antes se hacían en SQL Editor pueden ejecutarse desde agente cuando el MCP expone las herramientas necesarias (`execute_sql`, `apply_migration`, logs, tablas), manteniendo la misma regla de seguridad: enseñar el SQL/migración exacta y esperar confirmación explícita antes de mutar producción. Si el MCP no está disponible, usar SQL Editor como fallback manual. Las reglas completas viven en `docs/project/process/supabase-db-access.md`: no guardar secretos, aplicar cambios como migraciones versionadas y ejecutar `notify pgrst, 'reload schema';` tras cambiar RPCs.

### 4.4. Emails transaccionales

Cachés usa Brevo para emails transaccionales en dos caminos separados:

- Invitaciones beta propias de la app: Supabase Edge Function `send-beta-invite` + Brevo Transactional API.
- Confirmaciones de alta de Supabase Auth: configuración manual de Custom SMTP en Supabase Dashboard usando Brevo SMTP.

Secrets requeridos para la Edge Function. Mientras el dominio/remitente definitivo no exista y no esté confirmado en Brevo, usar el remitente temporal personal ya validado fuera del repo:

```bash
supabase secrets set EMAIL_PROVIDER=brevo
supabase secrets set BREVO_API_KEY=...
supabase secrets set APP_URL=https://culturapp-rho.vercel.app
supabase secrets set EMAIL_FROM_ADDRESS=<EMAIL_CONFIRMADO_EN_BREVO>
supabase secrets set EMAIL_FROM_NAME="Cachés"
supabase secrets set EMAIL_REPLY_TO=<EMAIL_REAL_DE_RESPUESTA>

supabase functions deploy send-beta-invite
```

`BREVO_API_KEY` debe ser una API key v3 de Brevo para la API HTTP, normalmente con formato `xkeysib-...`. No sirve la SMTP key: esa solo se usa en la configuración SMTP de Supabase Auth.

Configuración manual en Supabase Dashboard:

1. Activar `Authentication > Providers > Email > Confirm email`.
2. Configurar `Authentication > SMTP settings`:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: SMTP login de Brevo
   - Password: SMTP key / master password de Brevo
   - Sender email: `<EMAIL_CONFIRMADO_EN_BREVO>`
   - Sender name: `Cachés`
3. Revisar `Authentication > URL Configuration`:
   - Site URL: `https://culturapp-rho.vercel.app`
   - Redirect URLs: `https://culturapp-rho.vercel.app/**` y localhost si se prueba en local.
4. Personalizar la plantilla `Confirm signup` con copy de Cachés en español.

Gotcha operativo: si el `Sender email` de Supabase Auth no coincide con un email real y confirmado/validado en Brevo, Supabase puede registrar la solicitud de confirmación pero el usuario no recibirá el email. Durante la activación inicial se usó temporalmente un email personal validado como remitente para desbloquear pruebas; no cambiarlo al remitente definitivo de Cachés hasta que exista como email/alias real y Brevo marque ese dominio/remitente como validado.

Antes de invitar usuarios reales, verifica el dominio/remitente en Brevo y configura SPF, DKIM y DMARC. No añadas claves Brevo como variables `VITE_*`: solo pertenecen a Supabase Edge Functions o al panel de Supabase Auth.

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

## Skills portables para agentes

El repositorio incluye skills portables basadas en carpetas `SKILL.md` para reutilizar workflows entre Codex y Claude Code sin duplicar instrucciones.

- Fuente real para Codex: `.agents/skills/<skill-name>/SKILL.md`
- Exposición para Claude Code: `.claude/skills/<skill-name>` como symlink a `.agents/skills/<skill-name>`
- Plantilla para nuevas skills: `.agents/templates/portable-skill/SKILL.md`
- Estrategia y mantenimiento: `docs/agent-skills-strategy.md`

Skills disponibles:

| Skill | Uso |
|-------|-----|
| `portable-skill-authoring` | Crear, revisar o mantener skills portables. |
| `cultura-frontend-review` | Revisar UI, formularios, calendarios, responsive, accesibilidad y performance frontend. |
| `cultura-data-finance-review` | Revisar Supabase, hooks, RLS, modelo evento/proyecto y cálculos financieros. |
| `cultura-security-privacy-review` | Revisar auth, RLS, secretos, privacidad, dependencias y seguridad de skills/agentes. |
| `cultura-testing-release-check` | Preparar lint/build, smoke tests, matrices de regresión y readiness de Vercel. |
| `cultura-code-review` | Revisar diffs de forma transversal: bugs, arquitectura, seguridad, performance y tests. |
| `memory-protocol` | Mantener memoria local en Markdown bajo `.memory/` para contexto durable de agentes. |

Las skills son instruction-only por defecto. No incluyen scripts externos, dependencias nuevas ni comandos destructivos.

---

## Deploy en Vercel

Producción verificada: https://culturapp-rho.vercel.app

El proyecto está importado en Vercel y despliega automáticamente desde GitHub en cada push a `main`. Las variables necesarias son `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
