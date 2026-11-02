---
description: Actualiza docs/handoff.md con el estado actual para que otro agente (Claude, Codex u otra sesión) continúe
argument-hint: [nota opcional]
---

Nota del usuario (opcional): $ARGUMENTS

1. Lee `docs/handoff.md` y respeta sus apartados fijos. Reescribe en lugar de acumular: el histórico vive en git.
2. Reúne el estado real, sin inventar:
   - `git status --short --branch` y `git log --oneline -5`;
   - tareas de `docs/tasks/` con `status` distinto de `done`;
   - ramas `worker/*` y worktrees en `.worktrees/` pendientes de revisión;
   - si existe `logs/worker.jsonl`, un resumen breve de `usage_report` (MCP `cheap-worker`, `days: 7`).
3. Actualiza:
   - **Objetivo actual**;
   - **Hecho**: solo lo de esta sesión que siga siendo relevante;
   - **Pendiente**: con el siguiente paso concreto primero;
   - **Decisiones tomadas**: enlaza a `docs/decisions.md` (añade ADR allí si hubo decisión de tooling nueva);
   - **Ficheros tocados**, **Riesgos / dudas**;
   - **Último agente y modelo que trabajó**: tu agente y modelo exactos, con la fecha.
4. Si surgió algo durable (preferencia, gotcha, regla), aplica el learning loop de `AGENTS.md`: actualiza `.memory/` o declara `Memoria: no aplica`.
5. Muestra el diff de `docs/handoff.md`. No hagas commit salvo que el usuario lo pida.
