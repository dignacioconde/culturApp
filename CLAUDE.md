# CLAUDE.md — Cachés

Archivo de contexto para Claude Code.

**OBLIGATORIO al inicio de cada conversación:**
1. Leer `.memory/MEMORY.md` y los archivos enlazados que sean relevantes.
2. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

**Fuente de verdad del proyecto:** `AGENTS.md` — contiene arquitectura, stack, modelo de datos, convenciones, flujo de agentes y estado del proyecto. Léelo completo antes de tocar cualquier archivo.

**Sistema de memoria:** `.memory/` — directorio en la raíz del repo (versionado en git). Preferencias, decisiones y contexto acumulado que persiste entre conversaciones y sesiones de agentes. `cultura-docs` es el único agente con permiso de escritura; Claude Code puede leer y escribir directamente.

**Antes de abrir PR sin agentes:** hacer el checkpoint de memoria definido en `AGENTS.md`: revisar issue, diff y commits contra base; actualizar `.memory/` si hay preferencias, decisiones duraderas, gotchas o reglas nuevas; o declarar `Memoria: no aplica`. No crear la PR hasta que la memoria este commiteada/pusheada o marcada como no aplicable, e incluirlo en la descripcion de la PR.

**Flujo obligatorio para implementacion:** Product Brain es la fuente principal de verdad. Antes de implementar, leer `docs/project/START_HERE.md`, `docs/project/releases/CURRENT_RELEASE.md`, `docs/project/plans/CURRENT_PLAN.md`, `docs/project/backlog/BACKLOG.md` y la issue Markdown `CACH-*` relacionada. Si falta issue, crear/proponer issue Markdown antes de implementar. Si falta release activa para una feature grande, parar y proponer crear/activar release. Si la tarea pertenece a una release, la rama de trabajo sale de la rama de release activa y vuelve a ella; `main` queda estable hasta el cierre de release. Ver `docs/project/process/DEVELOPMENT_WORKFLOW.md` y `docs/project/process/AGENT_WORKFLOW.md`.
