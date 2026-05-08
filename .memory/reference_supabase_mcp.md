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
