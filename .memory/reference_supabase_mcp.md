---
name: Supabase MCP operativo
description: Referencia operativa para Supabase MCP y fallback SQL Editor
type: reference
---
El flujo canónico para operar Supabase desde agentes vive en `docs/project/process/supabase-db-access.md`.

- URL remota canónica: `https://mcp.supabase.com/mcp`
- Proyecto: CulturaApp en Supabase, siempre acotado por `project_ref`.
- Auth: PAT configurado fuera del repo y fuera de prompts.

Cuando está disponible en una sesión, Supabase MCP permite diagnóstico de BD, consulta de tablas, logs, migraciones y operaciones directas. Si una sesión no expone ese MCP, usar SQL Editor como fallback manual.

Reglas duraderas:
- Usar Supabase MCP como vía preferente para diagnóstico y operaciones remotas de BD cuando esté disponible.
- Las operaciones manuales de BD que antes hacía el usuario en SQL Editor pueden hacerlas los agentes con MCP cuando exponga `execute_sql`/`apply_migration`/logs, manteniendo confirmación humana explícita para cualquier mutación de producción.
- Acotar siempre al proyecto CulturaApp y usar modo lectura para diagnóstico.
- No guardar ni pegar tokens, connection strings, service role keys o passwords en repo, memoria, issues, prompts o PRs.
- Para mutaciones en producción, enseñar el SQL/migración exacta y esperar confirmación explícita.
- Si el MCP no está disponible en la sesión, usar SQL Editor como fallback manual.
- Los subagentes Codex heredan solo las herramientas de la sesión Codex; si Codex no tiene Supabase MCP, sus subagentes tampoco lo tienen.
- Documento operativo canónico: `docs/project/process/supabase-db-access.md`.

## 2026-05-12 - Drift remoto en features con migraciones

Contexto: el formulario de feedback falló en producción porque `public.feedback` existía en migraciones locales, pero no en Supabase remoto. PostgREST devolvía `404` para `POST /rest/v1/feedback`.

Durable memory:
- Si una feature depende de una tabla/policy/RPC nueva, verificar remoto antes de marcar producción como OK: `to_regclass('public.<tabla>')`, `pg_policies` cuando aplique y smoke real o transaccional con `rollback`.
- Si una release deja la migración remota pendiente, la feature puede estar code-complete, pero no released funcionalmente.
- Si un hotfix remoto incluye SQL no reflejado en migraciones locales, versionar el delta o confirmar que ya queda cubierto por una migración existente.
- Si se aplica una migración versionada a mano por SQL Editor, confirmar el schema con SQL read-only, refrescar PostgREST con `notify pgrst, 'reload schema';` y ejecutar `npx supabase migration repair <version> --status applied --linked` antes de cerrar la tarea.
