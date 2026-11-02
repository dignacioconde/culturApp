# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

CACH-0106 — Montar la orquestación multi-modelo (cerebros Claude/Codex, obreros baratos vía `cheap-worker`).

## Hecho

- Fase 0: Codex reinstalado (0.166.0, login ChatGPT OK); worktree y rama `chore/cach-0106-multi-model-orchestration`; issue `CACH-0106`.
- Fase 1: `AGENTS.md` (sección handoff/orquestación), `CLAUDE.md` con `@AGENTS.md`, este fichero, `docs/decisions.md`, `docs/tasks/`, `docs/orchestration.md`, `.env.example`.
- Fase 3: MCP `cheap-worker` (`tools/cheap-worker/{server,worker}.mjs`, `config/models.yaml`): worktree por tarea, verificación, reintentos, fallback, escaneo de secretos y registro de consumo (`logs/worker.jsonl` vía `opencode session export`). Verificado con `pnpm smoke:worker -- --live`: `deepseek-free` (0 USD) y `deepseek` (0,0017 USD) pasan, con commit en rama worker y limpieza.
- Fase 2: MCP `codex` (`tools/codex-bridge/server.mjs`, herramientas `codex_ask` y `codex_review`), helper compartido `tools/lib/run.mjs` (spawn sin shell, timeout que mata el grupo de procesos), `.mcp.json`, `.claude/settings.json` (timeouts MCP 1 h), `pnpm smoke:codex`. Verificado: smoke offline y `--live` OK; `claude mcp get codex` lo detecta.

## Pendiente (siguiente paso concreto)

- Fase 4: comandos `.claude/commands/` (`/task-plan`, `/delegate`, `/task-review`, `/handoff`) y subagente `task-splitter`.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-006).
- `.env` y `logs/` viven en el checkout principal (`/Users/diconde/Documents/GitHub/culturApp`) y los comparten todos los worktrees.
- Cadena de fallback: gratuitos OpenCode → DeepSeek directo → Ollama → OpenRouter (OpenRouter con ~2 céntimos de margen; recargar solo si hace falta).
- Dependencias MCP (`@modelcontextprotocol/sdk`, `zod`) como devDependencies del raíz: un solo `pnpm install`; la app no las importa.

## Ficheros tocados

- Fase 1: `AGENTS.md`, `CLAUDE.md`, `docs/handoff.md`, `docs/decisions.md`, `docs/orchestration.md`, `docs/tasks/*`, `.env.example`, `docs/project/issues/CACH-0106.md`.
- Fase 3: `tools/cheap-worker/**`, `config/models.yaml`, `.mcp.json`, `.claude/settings.json`, `package.json`, `.env.example`, `docs/orchestration.md`, `docs/decisions.md`.
- Fase 2: `tools/codex-bridge/{server,smoke}.mjs`, `tools/lib/run.mjs`, `.mcp.json`, `.claude/settings.json`, `package.json`, `pnpm-lock.yaml`, `docs/orchestration.md`.

## Riesgos / dudas

- CLI nativo de Claude Code sin instalar (instalación bloqueada por permisos); el usuario debe ejecutar `curl -fsSL https://claude.ai/install.sh | bash`.
- Ollama: demonio parado; arrancar `ollama serve` para el fallback local.
- Los servidores `codex` y `cheap-worker` aparecen como «Pending approval» hasta que el usuario los apruebe al abrir `claude` en el repo.
- Modelos gratuitos: límites de uso y posible uso de prompts por el proveedor; no delegar código sensible.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
