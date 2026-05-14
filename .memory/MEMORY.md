# Memory — CulturaApp

Mapa estructurado ampliado: [core.md](core.md)

## Proyecto

- [Routing/deploy](projects/routing-deploy.md) — Vercel necesita fallback SPA para recargas de rutas protegidas; producción verificada en `culturapp-rho.vercel.app`
- [Estado general](projects/culturaapp-status.md) — Estado MVP, `/work`, brechas pendientes y prioridades móvil

## Referencias

- [Supabase MCP operativo](reference_supabase_mcp.md) — reglas para operar BD con Supabase MCP cuando la sesion lo exponga, y fallback SQL Editor

## Comportamiento obligatorio

- [Leer y actualizar memoria con criterio](feedback_memory_always.md) — Leer MEMORY.md al inicio, cargar solo memoria relevante y guardar solo aprendizaje durable
- [Workflows de agentes y OpenCode](topics/agent-workflows.md) — Reglas duraderas de orquestación, verificación y cierre; no es run log ni histórico cargable por defecto

## Infraestructura y CI

- [Branch protection y CI](feedback_branch_protection.md) — Branch protection activo en main; job `app` requerido; agentes no pueden mergear con CI rojo

## Feedback y preferencias

- [Product Brain repo-native](feedback_product_brain.md) — docs/project/ con sync manual a Obsidian iCloud, scripts pb:init/status/pull/push, prefijo CACH, Thin PB rules
- [Mobile modal/detail handling](lessons_mobile_modals.md) — Scroll lock con counter, touch-action CSS, viewport dinámico (dvh), bottom bar + quick modals, listas minimalistas
