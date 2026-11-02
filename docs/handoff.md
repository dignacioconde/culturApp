# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

CACH-0106 — Montar la orquestación multi-modelo (cerebros Claude/Codex, obreros baratos vía `cheap-worker`).

## Hecho

- Fases 1–3 en `main` (PR #117): capa de contexto, MCP `codex`, MCP `cheap-worker` con registro de consumo.
- Fase 5 (misma rama): `scripts/profiles.sh` + `pnpm profiles` (perfiles con `CLAUDE_CONFIG_DIR`/`CODEX_HOME`). Verificado con carpetas temporales: el perfil nuevo no hereda conectores de claude.ai ni login de Codex; `default` mantiene la config normal.
- Fase 4 (rama `chore/cach-0106-orchestration-commands`): comandos `/task-plan`, `/delegate`, `/task-review`, `/handoff` y subagente `task-splitter`; la skill `cultura-agent-orchestration` apunta a ellos. Verificado con el CLI `claude`: `/delegate` sin argumentos responde con el uso y `task-splitter` aparece como subagente.

## Pendiente (siguiente paso concreto)

- Fase 6: demo `examples/demo/` (plan → delegate → review → handoff), `tools/README.md`, cierre de memoria e issue CACH-0106; una sola PR para fases 4–6.
- Usuario: borrar la rama remota `chore/cach-0106-multi-model-orchestration` (ya mergeada); aprobar los MCP `codex` y `cheap-worker` al abrir `claude`.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-006).
- `.env` y `logs/` viven en el checkout principal (`/Users/diconde/Documents/GitHub/culturApp`) y los comparten todos los worktrees.
- Cadena de fallback: gratuitos OpenCode → DeepSeek directo → Ollama → OpenRouter (OpenRouter con ~2 céntimos de margen; recargar solo si hace falta).
- Dependencias MCP (`@modelcontextprotocol/sdk`, `zod`) como devDependencies del raíz: un solo `pnpm install`; la app no las importa.

## Ficheros tocados

- Fase 1: `AGENTS.md`, `CLAUDE.md`, `docs/handoff.md`, `docs/decisions.md`, `docs/orchestration.md`, `docs/tasks/*`, `.env.example`, `docs/project/issues/CACH-0106.md`.
- Fase 5: `scripts/profiles.sh`, `package.json`, `docs/orchestration.md`.
- Fase 4: `.claude/commands/*.md`, `.claude/agents/task-splitter.md`, `.agents/skills/cultura-agent-orchestration/SKILL.md`, `docs/orchestration.md`.
- Fase 3: `tools/cheap-worker/**`, `config/models.yaml`, `.mcp.json`, `.claude/settings.json`, `package.json`, `.env.example`, `docs/orchestration.md`, `docs/decisions.md`.
- Fase 2: `tools/codex-bridge/{server,smoke}.mjs`, `tools/lib/run.mjs`, `.mcp.json`, `.claude/settings.json`, `package.json`, `pnpm-lock.yaml`, `docs/orchestration.md`.

## Riesgos / dudas

- CLI nativo de Claude Code sin instalar (instalación bloqueada por permisos); el usuario debe ejecutar `curl -fsSL https://claude.ai/install.sh | bash`.
- Ollama: demonio parado; arrancar `ollama serve` para el fallback local.
- Los servidores `codex` y `cheap-worker` aparecen como «Pending approval» hasta que el usuario los apruebe al abrir `claude` en el repo.
- `/task-review` integra con `cherry-pick` en la rama actual; si es `main`, debe parar y pedir rama de trabajo.
- Modelos gratuitos: límites de uso y posible uso de prompts por el proveedor; no delegar código sensible.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
