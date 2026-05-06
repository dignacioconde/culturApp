# CLAUDE.md — Cachés

Adapter corto para Claude Code.

**OBLIGATORIO al inicio de cada conversación:**
1. Leer `docs/agent-context-policy.md`.
2. Leer `.memory/MEMORY.md` y solo los archivos enlazados que sean relevantes.
3. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

**Fuentes canonicas:** Product Brain (`docs/project/`) es la fuente de producto, planificacion, issues, releases y decisiones. `docs/agent-context-policy.md` es la fuente canonica de carga de contexto. `AGENTS.md` es el contrato de entrada para agentes.

**Sistema de memoria:** `.memory/` — memoria versionada del proyecto. Guarda preferencias, decisiones duraderas y gotchas reutilizables; no guarda historico operativo largo, logs ni memoria privada/runtime.

**Antes de abrir PR sin agentes:** hacer el checkpoint de memoria definido en `AGENTS.md`: revisar issue, diff y commits contra base; actualizar `.memory/` si hay preferencias, decisiones duraderas, gotchas o reglas nuevas; o declarar `Memoria: no aplica`. No crear la PR hasta que la memoria este commiteada/pusheada o marcada como no aplicable, e incluirlo en la descripcion de la PR.

**Carga de contexto para implementacion:** leer indices primero y cargar detalle solo si aplica. Para tareas pequenas, leer `AGENTS.md`, `.memory/MEMORY.md`, `docs/project/START_HERE.md` y la issue `CACH-*` relacionada si existe. Leer `CURRENT_RELEASE`, `CURRENT_PLAN` y `BACKLOG` solo si la tarea pertenece a una release activa, afecta planificacion o cambia alcance de producto.
