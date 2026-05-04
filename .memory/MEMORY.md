# Memory — CulturaApp

Mapa estructurado ampliado: [core.md](core.md)

## Proyecto

- [Memoria centralizada en .memory/](project_memory_centralization.md) — Memoria movida de ruta Claude a .memory/ en el repo (2026-05-03)
- [Routing/deploy](projects/routing-deploy.md) — Vercel necesita fallback SPA para recargas de rutas protegidas; producción verificada en `culturapp-rho.vercel.app`
- [Estado general](projects/culturaapp-status.md) — Estado implementado del MVP, `/work` y brechas pendientes

## Referencias

- [Supabase MCP configurado](reference_supabase_mcp.md) — MCP server activo para operar la BD de Supabase directamente desde Claude Code

## Comportamiento obligatorio

- [Leer y actualizar memoria siempre](feedback_memory_always.md) — Leer MEMORY.md al inicio y guardar proactivamente sin que el usuario lo pida
- [Checkpoint de memoria pre-PR](topics/agent-workflows.md) — Antes de abrir PR, actualizar `.memory/` o declarar `Memoria: no aplica`

## Feedback y preferencias

- [Sin co-authoring de IA en commits](feedback_no_coauthoring.md) — No añadir Co-Authored-By de IA en commits git
- [Flujo obligatorio de issues y planner](feedback_opencode_agents.md) — Usar issue + rama desde main + agents:plan + PR a main + merge + verificación de producción
