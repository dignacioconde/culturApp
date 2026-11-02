@AGENTS.md

# CLAUDE.md — Cachés (específico de Claude Code)

**OBLIGATORIO al inicio de cada conversación:**
1. Leer `docs/agent-context-policy.md` y `docs/handoff.md`.
2. Leer `.memory/MEMORY.md` y solo los archivos enlazados que sean relevantes.
3. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

**Antes de abrir PR sin agentes:** checkpoint de memoria de `AGENTS.md`; no crear la PR hasta que la memoria esté commiteada o marcada `Memoria: no aplica`.

**Orquestación (solo Claude Code):**
- Comandos: `/task-plan`, `/delegate`, `/task-review`, `/handoff` (`.claude/commands/`). `/plan` y `/review` son nativos, por eso el prefijo.
- Subagente `task-splitter` para trocear objetivos en `docs/tasks/`.
- MCP de proyecto (`.mcp.json`): `codex` (segunda opinión, solo lectura) y `cheap-worker` (delegación a modelos baratos).
- Nunca reutilizar credenciales de suscripción fuera de `claude`/`codex`.
