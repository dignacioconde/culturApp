---
name: Leer y actualizar memoria con criterio
description: Al inicio de cada conversación leer MEMORY.md, cargar solo memoria relevante y guardar solo aprendizaje durable
type: feedback
---
**Regla obligatoria en cada conversación:**

1. **Al empezar**: leer `.memory/MEMORY.md` como índice y cargar solo los archivos de memoria relevantes para la tarea.
2. **Durante**: detectar preferencias, decisiones, gotchas o contexto reusable, pero no escribir memoria por cada detalle operativo.
3. **Al cerrar**: guardar solo aprendizaje durable, o declarar `Memoria: no aplica` si no hay nada que persista.

**Why:** El usuario tuvo que pedir explícitamente que se usara la memoria y que se consolidara este comportamiento. No debe tener que recordármelo.

**How to apply:** seguir `docs/agent-context-policy.md` y `memory-orient`: índice primero, detalle bajo demanda, nada de logs, ramas, commits, secretos ni estado efímero. En OpenCode, los agentes no-docs detectan aprendizaje y activan `@cultura-docs`; en trabajo local single-agent, el agente principal puede actualizar `.memory/` siguiendo `memory-protocol`.

**Checkpoint antes de commit/cierre:** Antes de hacer commit, push, cerrar una issue o dar por terminada una sesión con cambios relevantes, revisar explícitamente si la sesión produjo preferencias, decisiones, contexto de producto o aprendizajes duraderos y actualizar `.memory/` antes del commit final. El usuario detectó que al final de las sesiones no se estaba actualizando la memoria con todo lo aprendido.
