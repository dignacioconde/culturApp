# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

CACH-0106 — Montar la orquestación multi-modelo (cerebros Claude/Codex, obreros baratos vía `cheap-worker`).

## Hecho

- Fase 0: Codex reinstalado (0.166.0, login ChatGPT OK); worktree y rama `chore/cach-0106-multi-model-orchestration`; issue `CACH-0106`.
- Fase 1: `AGENTS.md` (sección handoff/orquestación), `CLAUDE.md` con `@AGENTS.md`, este fichero, `docs/decisions.md`, `docs/tasks/`, `docs/orchestration.md`, `.env.example`.

## Pendiente (siguiente paso concreto)

- Fase 2: `.mcp.json` con `codex` vía wrapper `tools/codex-bridge/` (no existe `codex mcp-server` en 0.166.0) y timeouts en `.claude/settings.json`.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-004).

## Ficheros tocados

- `AGENTS.md`, `CLAUDE.md`, `docs/handoff.md`, `docs/decisions.md`, `docs/orchestration.md`, `docs/tasks/*`, `.env.example`, `docs/project/issues/CACH-0106.md`.

## Riesgos / dudas

- CLI nativo de Claude Code sin instalar (instalación bloqueada por permisos); el usuario debe ejecutar `curl -fsSL https://claude.ai/install.sh | bash`.
- Ollama: demonio parado; arrancar `ollama serve` para el fallback local.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
