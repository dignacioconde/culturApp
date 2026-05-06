# Agent Workflow Memory

## 2026-05-03 - OpenCode Agents Are The Preferred Execution Path When Requested

- Context: Commits `71ff8fa`, `5ce937f`, `1033955`, `62b247e` and `c67348e` added and refined the `.opencode/` workflow, `npm run agents:run`, `npm run agents:parallel`, task template, shared state board, and issue-resolution process.
- Durable memory: when the user asks to run OpenCode agents, launch the repository workflow directly instead of doing broad manual investigation first; do only the minimum needed to form a safe command, scope, and ownership.
- Source: `AGENTS.md`, `.opencode/README.md`, `.opencode/AGENT_TASK_TEMPLATE.md`, `.opencode/AGENT_STATE.md`, git log through `37ff950`.

## 2026-05-03 - Issue Resolution Requires Push And Comment Before Closure

- Context: The issue workflow was documented and then tightened so new problems flow through GitHub issue, agents, fix, verification, commit, push, issue comment, then closure.
- Durable memory: do not close a tracked issue just because the local fix exists; the commit must be pushed and the issue must receive a summary with commit and verification before closure.
- Source: commits `62b247e` and `c67348e`; `AGENTS.md`; `.opencode/README.md`.

## 2026-05-03 - GitHub Is The Operational History

- Context: The user clarified that memory was not being updated after issue work and asked whether agents can use PRs and commits for context.
- Durable memory: use `.memory/` for durable preferences, product decisions, recurring gotchas, and workflow lessons; use GitHub issues, PRs, and commits for detailed task history and implementation context instead of mirroring every change into memory.
- Source: user clarification on 2026-05-03.

## 2026-05-03 - Visual Bugs Need Reproduction Details

- Context: Calendar responsive work showed that lint/build were insufficient for `react-big-calendar` layout regressions.
- Durable memory: prompts for visual/responsive agents must include route, viewport or condition, symptom/capture, and a visual acceptance criterion; for calendars, require evidence that toolbar, header, and month rows are visible.
- Source: commit `2efe2b6`; `AGENTS.md`; `.opencode/README.md`; `TECHDOC.md`.

## 2026-05-03 - Memory Gate Before Pull Requests

- Context: The user asked that memory be filled before PR creation, for OpenCode agents and also for Codex or Claude Code when they work without agents.
- Durable memory: no PR should be opened until the worker has reviewed issue/context, branch diff, and commits against base, then either updated `.memory/` with durable preferences, product decisions, recurring gotchas, or workflow rules, or explicitly declared `Memoria: no aplica`. The PR body must include the memory status. OpenCode should route durable memory writes through `cultura-docs`; Codex and Claude Code may update `.memory/` directly when not using agents.
- Source: user instruction on 2026-05-03; issue `#13`; `AGENTS.md`; `.github/pull_request_template.md`; `.opencode/README.md`.

## 2026-05-04 - Issues Stay Linked To Resolving Work

- Context: Issue close handling around PR `#19` showed that implemented issues can be commented and pushed while still needing a durable PR/issue link.
- Durable memory: closing an issue is a state transition, not the historical link. Every resolved issue must stay permanently linked to the PR or commit that resolved it. If there is an open PR, keep the issue open and include `Closes #N`, `Fixes #N`, or equivalent in the PR body so GitHub closes it on merge and preserves the relationship. If there is no PR, close only after a pushed commit plus a comment containing summary, commit or branch, verification, and memory/docs status.
- Source: user clarification on 2026-05-04; issue `#21`; PR `#19`; `AGENTS.md`; `.opencode/README.md`; `.github/pull_request_template.md`.

## 2026-05-04 - Implementation Ends At Main Merge And Production Verification

- Context: The visible rename to `Cachés` was implemented in PR `#19`, but the user still saw `CulturApp` because the branch only produced Vercel preview deployments while production continued serving `main`.
- Durable memory: for implementation tasks, create a task branch from up-to-date `main`, open a PR targeting `main`, merge it when checks pass and there is no blocker, then verify the production alias if the user expects the change in the live app. A Vercel preview deployment is useful for review but does not satisfy "fixed in the application" or "deployed to production".
- Source: user correction on 2026-05-04; PR `#19`; production alias `https://culturapp-rho.vercel.app`; `AGENTS.md`; `.opencode/README.md`.

## 2026-05-04 - Branch Cleanup After Merge

- Context: The user asked to add branch cleanup to the standard flow after a PR is merged correctly into `main`; issue `#24` corrected the initial automation from issue `#22`.
- Durable memory: After merging a PR to `main`, the remote branch should be deleted automatically by `.github/workflows/delete-branch.yml` when it belongs to the same repository. The local branch must be deleted only after switching to up-to-date `main`; do not use scripts that try to delete the currently checked-out branch.
- Source: user instruction on 2026-05-04; issues `#22` and `#24`; PR `#23`; `.github/workflows/delete-branch.yml`; `AGENTS.md`; `.opencode/README.md`.

## 2026-05-05 - verification-agent Creado Para Verificacion Post-Implementacion

- Context: El lead (`cultura-lead`) dedicaba tiempo a verificar despliegues y estados finales en lugar de delegarlo. Se auditaron los agentes existentes y se confirmo que el sistema OpenCode funciona correctamente con 11 agentes reales.
- Durable memory: existe `verification-agent` en `.opencode/agents/verification-agent.md` (mode: primary). Se llama con `npm run agents:verify -- "contexto"` o como `@verification-agent` desde una sesion interactiva. Solo se debe usar cuando se toca codigo de producto, UI, build/config/deploy o se prepara una PR mediana/grande. Produce un bloque estandar con status `Ready / Ready with warnings / Blocked`. No es obligatorio para cambios triviales, copy o documentacion menor.
- Source: prompt de auditoria 2026-05-05; `AGENTS.md`; `.opencode/README.md`; `.opencode/agents/verification-agent.md`.

## 2026-05-06 - Agentes OpenCode Sin Timeout: Causa De Ejecuciones De 2-3 Horas

- Context: Las últimas ejecuciones de `npm run agents:run` duraban 2-3 horas sin dar feedback. Diagnóstico: ningún script tenía timeout; el modelo `minimax-m2.5-free` (tier gratuito) tiene rate limits y colas variables; cada agente leía AGENTS.md completo (810 líneas, ~4.500 tokens), multiplicado por 4-9 agentes en paralelo.
- Durable memory: `run-agent.mjs` tiene ahora timeout de 45 min (`AGENT_TIMEOUT_MS`, configurable via env). `run-parallel-agents.mjs` tiene 30 min por agente. Al expirar: mata el proceso, guarda output parcial, reporta TIMEOUT. Si una ejecución tarda más de ese umbral, el script lo corta en lugar de correr indefinidamente.
- Source: análisis 2026-05-06; `.opencode/scripts/run-agent.mjs`; `.opencode/scripts/run-parallel-agents.mjs`.

## 2026-05-06 - current.json Para Ver Estado De Agente Desde Claude Code

- Context: Los checkpoints de agente iban solo al terminal del OS (no al chat de Claude Code). No había forma de saber el estado sin salir de la sesión.
- Durable memory: `run-agent.mjs` escribe y actualiza `.opencode/runs/current.json` durante cada ejecución. Campos: `startedAt`, `agent`, `title`, `elapsedMin`, `lastCheckpoint`, `lastLines` (últimas 10 líneas), `status` (`running`/`done`/`error`/`timeout`). Para ver el estado desde Claude Code: leer ese archivo con Read. Al terminar, `status` cambia a `done` o `error`.
- Source: análisis 2026-05-06; `.opencode/scripts/run-agent.mjs`.

## 2026-05-06 - AGENTS.md Digests Por Agente Para Reducir Contexto

- Context: Cada agente leía los 810 líneas completos de AGENTS.md aunque solo necesitaba un 20-30% del contenido. Con 4 agentes en paralelo = ~18.000 tokens redundantes en la misma lectura.
- Durable memory: al final de `AGENTS.md` existe la sección `## Contexto mínimo por agente` con bloques de 15-20 líneas para cada subagente (`cultura-frontend`, `cultura-data`, `cultura-testing`, `cultura-review`, `cultura-security`, `cultura-release`, `cultura-docs`). Los agentes deben apuntar a su bloque específico en lugar de leer el archivo completo.
- Source: análisis 2026-05-06; `AGENTS.md` (sección al final).

## 2026-05-06 - Routing De Memoria Formal En Subagentes

- Context: Los subagentes (`cultura-frontend`, `cultura-data`, etc.) cargaban memoria por inercia, no por protocolo explícito. Solo `cultura-planner` tenía instrucción formal de cargar memoria selectiva por dominio.
- Durable memory: `cultura-frontend.md`, `cultura-data.md`, `cultura-release.md` y `cultura-docs.md` tienen ahora sección `## Memoria selectiva` con tabla explícita: si la tarea toca X, cargar `.memory/Y`. Este protocolo es ahora formal, no heurístico.
- Source: análisis 2026-05-06; `.opencode/agents/cultura-frontend.md`, `cultura-data.md`, `cultura-release.md`, `cultura-docs.md`.

## Commit Conventions

- Do not add `Co-Authored-By: Claude` or any AI co-authoring lines to git commit messages.
- **Why:** User explicitly rejected it during a commit.
- **How to apply:** Whenever creating a commit in this project, omit any AI co-authoring.

## AGENT_STATE.md Maintenance

- The `## Senales activas` and `## Eventos` sections must be **left empty** after each completed task.
- Permanent history lives in git and GitHub (commits, PRs, issues), not in this file.
- This file is an operational scratchboard only.
- **Do NOT delete:** the `## Estado por agente` section with the 9 agent blocks (must always remain).
- **Why:** Before this rule, agents were preserving transient data across runs, polluting the state board.
- **How to apply:** After each task, verify these sections are empty with `git diff .opencode/AGENT_STATE.md`.

## OpenCode Agent Supervision

When `npm run agents:run` executes, OpenCode may run in background and write output to a JSONL transcript instead of stdout. This can make the agent appear blocked even when it's actively working.

**Rules:**
- Before launching a second agent, verify no active one exists.
- Before killing a process, identify which one is making progress.
- Review the OpenCode transcript/log before assuming failure.
- Avoid duplicate agents for the same task.
- If no visible feedback: check the log instead of relaunching.

**Why:** A duplicate agent led to killing the one making progress while keeping the zombie, losing control of the flow.

**How to apply:** Before relaunching, run `ps aux | grep "agents:run\|opencode"` and review `~/.local/share/opencode/log/<timestamp>.log` to confirm real activity.

## 2026-05-05 - Product Brain Governs Implementation Workflow

- Context: The user asked to professionalize backlog, Markdown issues, releases, release branches, commits, validation and agent workflow around the repo-native Product Brain.
- Durable memory: Product Brain is now the source of truth for implementation context. Before implementing, agents should read `START_HERE`, `CURRENT_RELEASE`, `CURRENT_PLAN`, `BACKLOG` and the related `CACH-*` issue. Work that belongs to a release branches from the active release branch, not directly from `main`; commits should use `<type>(CACH-XXXX): summary`. Releases should be small versioned cuts, for example `RELEASE-0.1.0-beta.1` -> `release/0.1.0-beta.1`, so they can merge to `main` and continue with `beta.2` if needed. `0.1` is the organizational/product cycle, `0.1.0-beta.N` are mergeable cuts, and `0.1.0` closes the cycle with a consolidated changelog.
- Source: `docs/project/process/*`; `docs/project/releases/CURRENT_RELEASE.md`; `docs/project/decisions/ADR-0008-release-branching-product-brain-workflow.md`; `AGENTS.md`.
