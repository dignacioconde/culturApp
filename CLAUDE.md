# CLAUDE.md — Cachés

Archivo de contexto para Claude Code.

**OBLIGATORIO al inicio de cada conversación:**
1. Leer `.memory/MEMORY.md` y los archivos enlazados que sean relevantes.
2. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

**Fuente de verdad del proyecto:** `AGENTS.md` — contiene arquitectura, stack, modelo de datos, convenciones, flujo de agentes y estado del proyecto. Léelo completo antes de tocar cualquier archivo.

**Sistema de memoria:** `.memory/` — directorio en la raíz del repo (versionado en git). Preferencias, decisiones y contexto acumulado que persiste entre conversaciones y sesiones de agentes. `cultura-docs` es el único agente con permiso de escritura; Claude Code puede leer y escribir directamente.

**Antes de abrir PR sin agentes:** hacer el checkpoint de memoria definido en `AGENTS.md`: revisar issue, diff y commits contra base; actualizar `.memory/` si hay preferencias, decisiones duraderas, gotchas o reglas nuevas; o declarar `Memoria: no aplica`. No crear la PR hasta que la memoria este commiteada/pusheada o marcada como no aplicable, e incluirlo en la descripcion de la PR.

**Flujo obligatorio para implementacion:** Ante cualquier tarea de implementacion (nueva funcionalidad, fix, mejora), usar siempre el flujo: (1) crear o localizar una issue en GitHub, (2) partir de `main` actualizado y crear una rama de trabajo para esa issue, (3) ejecutar `npm run agents:plan -- "prompt"` para que el planner genere la issue estructurada si falta y lance agentes, (4) ejecutar los agentes, (5) abrir PR a `main`, (6) mergear la PR cuando las verificaciones pasen y no haya bloqueo, (7) verificar produccion, y (8) borrar la rama de trabajo una vez mergeada correctamente contra `main`. NO usar `agents:run` directamente sin pasar por el planner cuando no hay issue. La excepcion es solo cuando el usuario lo diga explicitamente o cuando la tarea sea pura pregunta/revision sin implementacion. Si el planner falla por bloqueo tecnico, declarar el bloqueo y usar fallback explicito (issue estructurada + agentes) sin derivada a implementacion manual silenciosa. Ver `.memory/feedback_opencode_agents.md` para la preferencia durable.
