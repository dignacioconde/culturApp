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
