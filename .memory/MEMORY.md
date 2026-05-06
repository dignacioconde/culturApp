# Memory — CulturaApp

Mapa estructurado ampliado: [core.md](core.md)

## Proyecto

- [Routing/deploy](projects/routing-deploy.md) — Vercel necesita fallback SPA para recargas de rutas protegidas; producción verificada en `culturapp-rho.vercel.app`
- [Estado general](projects/culturaapp-status.md) — Estado MVP, `/work`, brechas pendientes y prioridades móvil

## Referencias

- [Supabase MCP configurado](reference_supabase_mcp.md) — MCP server activo para operar la BD de Supabase directamente desde Claude Code

## Comportamiento obligatorio

- [Leer y actualizar memoria siempre](feedback_memory_always.md) — Leer MEMORY.md al inicio y guardar proactivamente sin que el usuario lo pida
- [Workflows de agentes y OpenCode](topics/agent-workflows.md) — Checkout de memoria pre-PR, supervisión de agentes, commits CACH, Product Brain como fuente de verdad

## Infraestructura y CI

- [Branch protection y CI](feedback_branch_protection.md) — Branch protection activo en main; job `app` requerido; agentes no pueden mergear con CI rojo

## Feedback y preferencias

- [Product Brain repo-native](feedback_product_brain.md) — docs/project/ con sync manual a Obsidian iCloud, scripts pb:init/status/pull/push, prefijo CACH, Thin PB rules
- [Mobile modal/detail handling](lessons_mobile_modals.md) — Scroll lock con counter, touch-action CSS, viewport dinámico (dvh), bottom bar + quick modals, listas minimalistas
