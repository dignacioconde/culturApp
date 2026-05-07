---
name: Supabase MCP configurado
description: El MCP server de Supabase está activo en Claude Code para hacer operaciones de BD directamente
type: reference
---
El MCP server oficial de Supabase está configurado en `~/.claude/settings.json` bajo la clave `mcpServers.supabase`.

- **URL**: `https://mcp.supabase.com`
- **Auth**: Personal Access Token en header `Authorization: Bearer`
- **Proyecto**: CulturaApp en Supabase (dignacioconde@gmail.com)

Permite ejecutar SQL, consultar tablas, gestionar migraciones y operar sobre la base de datos directamente desde la conversación sin herramientas externas.

Reglas duraderas:
- Usar Supabase MCP como vía preferente para diagnóstico y operaciones remotas de BD cuando esté disponible.
- Acotar siempre al proyecto CulturaApp y usar modo lectura para diagnóstico.
- No guardar ni pegar tokens, connection strings, service role keys o passwords en repo, memoria, issues, prompts o PRs.
- Para mutaciones en producción, enseñar el SQL/migración exacta y esperar confirmación explícita.
- Si el MCP no está disponible en la sesión, usar SQL Editor como fallback manual.
- Documento operativo canónico: `docs/project/process/supabase-db-access.md`.
