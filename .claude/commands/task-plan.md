---
description: Divide un objetivo en tareas delegables docs/tasks/T-xxx (subagente task-splitter + revisión opcional de Codex)
argument-hint: <objetivo> [--codex]
---

Objetivo: $ARGUMENTS

1. Si el objetivo menciona una issue `CACH-*`, lee `docs/project/issues/<id>.md`. No cargues más Product Brain.
2. Lanza el subagente `task-splitter` con el objetivo, la issue (si hay) y cualquier restricción que el usuario haya dado. Pídele que escriba las tareas en `docs/tasks/`.
3. Revisa tú las tareas generadas:
   - formato de `docs/tasks/_TEMPLATE.md`;
   - un único comando bash en `## Verificación`;
   - nada de auth, RLS, migraciones, secretos ni finanzas marcado como delegable.
   Corrige lo que falle.
4. Si `$ARGUMENTS` incluye `--codex`, o alguna tarea toca datos o lógica compartida, pide segunda opinión con la herramienta MCP `codex_ask`:
   > «Revisa el plan de `docs/tasks/T-xxx*.md` a `T-yyy*.md` para el objetivo: <objetivo>. Señala tareas no atómicas, dependencias ocultas, criterios no verificables y riesgos de RLS/finanzas. Lista priorizada; no reescribas el plan.»
   Aplica solo los puntos que compartas y explica los que descartes.
5. Responde con la tabla de tareas (id, título, modelo, verificación, dependencias) y el siguiente paso sugerido: `/delegate T-xxx`.

No implementes las tareas ni delegues todavía.
