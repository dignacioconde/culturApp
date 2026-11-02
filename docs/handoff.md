# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

CACH-0106 — Orquestación multi-modelo. Las 6 fases están implementadas; falta mergear la PR de las fases 4–6 (rama `chore/cach-0106-orchestration-commands`).

## Hecho

- Fases 1–3 en `main` (PR #117): capa de contexto, MCP `codex`, MCP `cheap-worker` con registro de consumo.
- Fase 4: comandos `/task-plan`, `/delegate`, `/task-review`, `/handoff`, subagente `task-splitter` y diagrama `docs/orchestration-architecture.html`.
- Fase 5: `scripts/profiles.sh` (`pnpm profiles`), opcional.
- Fase 6: demo real en `examples/demo/` (T-001 y T-002 delegadas a `deepseek-free`, revisadas con Codex e integradas; 0 USD), guía `tools/README.md`, issue CACH-0106 en `done`.
- Arreglos surgidos de la demo: `changed_files` de `cheap-worker` y `git worktree remove --force` en `/task-review`.

## Pendiente (siguiente paso concreto)

- Mergear la PR de las fases 4–6 tras el OK del usuario y CI verde; después borrar la rama y el worktree `culturApp-orchestra`.
- Usuario: borrar la rama remota `chore/cach-0106-multi-model-orchestration` (ya mergeada) y aprobar los MCP `codex` y `cheap-worker` al abrir `claude`.
- Primer uso real: `/task-plan` sobre una tarea pequeña de la app (tests o boilerplate) y revisar `usage_report` tras unas semanas.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-006).
- `.env` y `logs/` viven en el checkout principal (`/Users/diconde/Documents/GitHub/culturApp`) y los comparten todos los worktrees.
- Cadena de fallback: gratuitos OpenCode → DeepSeek directo → Ollama → OpenRouter (OpenRouter con ~2 céntimos de margen; recargar solo si hace falta).
- Perfiles (`pnpm profiles`) se mantienen como opcionales: el usuario tiene una sola cuenta de Claude y una de ChatGPT.
- Dependencias MCP (`@modelcontextprotocol/sdk`, `zod`, `yaml`) como devDependencies del raíz: un solo `pnpm install`; la app no las importa.

## Ficheros tocados

- Fase 6: `examples/demo/**`, `docs/tasks/T-001-*.md`, `docs/tasks/T-002-*.md`, `tools/README.md`, `tools/cheap-worker/worker.mjs`, `.claude/commands/task-review.md`, `package.json`, `AGENTS.md`, `docs/project/issues/CACH-0106.md`.
- Fases 4–5: `.claude/commands/*.md`, `.claude/agents/task-splitter.md`, `.agents/skills/cultura-agent-orchestration/SKILL.md`, `scripts/profiles.sh`, `docs/orchestration.md`, `docs/orchestration-architecture.html`.
- Fases 1–3: ver PR #117.

## Riesgos / dudas

- Los MCP `codex` y `cheap-worker` aparecen como «Pending approval» hasta aprobarlos al abrir `claude` en el repo (y otra vez por cada perfil).
- Modelos gratuitos: límites de uso y posible uso de prompts por el proveedor; no delegar código sensible.
- `/task-review` integra con `cherry-pick` en la rama actual; si es `main`, debe parar.
- `/handoff` reescribe este fichero: revisar su diff antes de commitear (en la demo quitó un riesgo vigente).
- La config local de git del repo tiene `user.name = Codex`: los commits hechos desde aquí salen con esa autoría. Es preexistente; cambiarla es decisión del usuario.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
