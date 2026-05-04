---
name: AGENT_STATE.md — agentes no deben resetear el archivo
description: Los agentes tienden a sobrescribir AGENT_STATE.md borrando secciones enteras; revisar siempre tras un run de agentes
type: feedback
---

Los agentes (especialmente cultura-lead al cerrar una issue) sobrescriben `.opencode/AGENT_STATE.md` y borran secciones enteras: la sección `## Estado por agente` con los 9 bloques de agentes y entradas antiguas de `## Señales activas`.

**Why:** El agente reescribe el archivo desde cero en lugar de añadir solo su bloque/señal, perdiendo el historial operativo.

**How to apply:** Después de cualquier run de agentes que toque AGENT_STATE.md, verificar con `git diff HEAD~1 .opencode/AGENT_STATE.md` que no se hayan borrado secciones. Si se borraron, restaurar desde `git show HEAD~1:.opencode/AGENT_STATE.md`.
