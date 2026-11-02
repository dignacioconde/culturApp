# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

CACH-0106 — Montar la orquestación multi-modelo (cerebros Claude/Codex, obreros baratos vía `cheap-worker`).

## Hecho

- Fase 0: Codex reinstalado (0.166.0, login ChatGPT OK); worktree y rama `chore/cach-0106-multi-model-orchestration`; issue `CACH-0106`.
- Fase 1: `AGENTS.md` (sección handoff/orquestación), `CLAUDE.md` con `@AGENTS.md`, este fichero, `docs/decisions.md`, `docs/tasks/`, `docs/orchestration.md`, `.env.example`.
- Fase 2: MCP `codex` (`tools/codex-bridge/server.mjs`, herramientas `codex_ask` y `codex_review`), helper compartido `tools/lib/run.mjs` (spawn sin shell, timeout que mata el grupo de procesos), `.mcp.json`, `.claude/settings.json` (timeouts MCP 1 h), `pnpm smoke:codex`. Verificado: smoke offline y `--live` OK; `claude mcp get codex` lo detecta.

## Pendiente (siguiente paso concreto)

- Fase 3: `tools/cheap-worker/` (`list_models`, `delegate_task`, `usage_report`) reutilizando `tools/lib/run.mjs`, `config/models.yaml`, registro en `.mcp.json` y `enabledMcpjsonServers`.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-005).
- Dependencias MCP (`@modelcontextprotocol/sdk`, `zod`) como devDependencies del raíz: un solo `pnpm install`; la app no las importa.

## Ficheros tocados

- Fase 1: `AGENTS.md`, `CLAUDE.md`, `docs/handoff.md`, `docs/decisions.md`, `docs/orchestration.md`, `docs/tasks/*`, `.env.example`, `docs/project/issues/CACH-0106.md`.
- Fase 2: `tools/codex-bridge/{server,smoke}.mjs`, `tools/lib/run.mjs`, `.mcp.json`, `.claude/settings.json`, `package.json`, `pnpm-lock.yaml`, `docs/orchestration.md`.

## Riesgos / dudas

- CLI nativo de Claude Code sin instalar (instalación bloqueada por permisos); el usuario debe ejecutar `curl -fsSL https://claude.ai/install.sh | bash`.
- Ollama: demonio parado; arrancar `ollama serve` para el fallback local.
- El servidor `codex` aparece como «Pending approval» hasta que el usuario lo apruebe al abrir `claude` en el repo.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
