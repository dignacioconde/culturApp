---
id: PB-PROCESS-SUPABASE-DB-ACCESS
type: process
status: Active
created: 2026-05-07
updated: 2026-05-07
aliases:
  - Supabase DB Access
  - Acceso Supabase MCP
tags:
  - product-brain
  - process
  - supabase
  - security
---

# Acceso directo seguro a Supabase

Este documento define como agentes y humanos operan la base de datos de Cachés sin exponer secretos ni saltarse el flujo versionado de migraciones.

## Vía recomendada

Usar Supabase MCP como vía principal para diagnóstico y operaciones de BD:

- URL remota: `https://mcp.supabase.com/mcp`
- Alcance: siempre acotado al `project_ref` del proyecto CulturaApp.
- Diagnóstico: usar modo lectura cuando sea posible (`read_only=true`).
- Features habituales: `database,docs`.
- No guardar Personal Access Tokens, connection strings, service role keys ni passwords en el repo, memoria, issues, prompts o PRs.

Cuando el MCP esté disponible con herramientas de SQL/logs/migraciones, las operaciones de BD que antes requerían SQL Editor manual pueden ejecutarse desde el agente. La regla no cambia: diagnóstico en lectura directa, y cualquier mutación de producción solo tras enseñar el SQL o migración exacta y recibir confirmación humana explícita.

Si el MCP no está disponible en una sesión, usar el SQL Editor de Supabase como fallback manual. No pedir ni pegar credenciales en el chat.

## Diagnóstico read-only

Usar MCP read-only o SQL Editor para consultas de inspección:

```sql
select extname, extnamespace::regnamespace
from pg_extension
where extname = 'pgcrypto';

select proname, oidvectortypes(proargtypes) as args, proargnames
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('handle_new_user', 'list_beta_invites', 'create_beta_invite', 'revoke_beta_invite');
```

Para simular una sesión autenticada en SQL Editor:

```sql
begin;

select set_config('request.jwt.claim.sub', '<USER_UUID>', true);
select auth.uid();
select public.current_user_is_admin();

rollback;
```

## Migraciones y hotfixes

- Todo cambio de schema, trigger, policy o RPC debe vivir primero en `supabase/migrations/`.
- Antes de aplicar en producción, el agente debe mostrar el SQL exacto y esperar confirmación explícita.
- Aplicar con MCP `apply_migration` cuando esté disponible; si no, pegar la migración completa en SQL Editor.
- Después de cambiar RPCs, ejecutar:

```sql
notify pgrst, 'reload schema';
```

- Verificar con SQL read-only y después con la app.

## Reglas de seguridad

- No usar service role en frontend ni en prompts de agentes.
- No imprimir secretos ni valores de `.env.local`.
- No crear policies amplias para resolver errores de admin: preferir RPCs `security definer` con comprobación explícita.
- No ejecutar operaciones destructivas, producción o Supabase remoto sin confirmación humana clara.

## Fallback de emergencia

Si MCP no está disponible y SQL Editor falla:

1. Capturar el error exacto de Supabase sin incluir secretos.
2. Revisar `pg_proc`, `pg_extension`, grants y `notify pgrst`.
3. Crear una migración hotfix versionada.
4. Aplicar manualmente por SQL Editor y confirmar con una consulta read-only.
