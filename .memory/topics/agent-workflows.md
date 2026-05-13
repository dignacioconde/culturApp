# Agent Workflows

Purpose:
- Durable workflow memory for agent orchestration, planning, verification and parallel execution.
- Not a run log.
- Not a history of every agent execution.

Load policy:
- Load only for agent workflow, planning, orchestration, prompt design, release workflow or memory-maintenance tasks.
- Do not load for normal app implementation unless the task touches agents, workflows, PR/release process or memory rules.
- Historical notes below are traceability, not current instructions.

Canonical references:
- Context loading policy: `docs/agent-context-policy.md`.
- Agent entry contract: `AGENTS.md`.
- OpenCode workflow details: `.opencode/README.md`.
- Product Brain workflow: `docs/project/process/WORKFLOW.md`.

## Durable Rules

Context loading:
- Read indexes first; load detail only when task-relevant.
- Use `AGENTS.md` as short entry contract.
- Use `docs/agent-context-policy.md` as canonical context-loading policy.
- Keep prompts compact; link to policy instead of duplicating it.
- Do not turn reference paths into mandatory read lists.
- Product Brain is canonical for product, planning, issues, releases and decisions, but full Product Brain is not loaded by default.
- Use `npm run context:metrics` and runner `promptMetrics` as the cheap cost proxy for agent/context changes; split tasks or reduce agents when prompt estimates grow.

Agent execution:
- When the user asks to run OpenCode agents, launch the repository workflow directly.
- When the user asks for Codex agents, use native Codex subagents when available; OpenCode profiles may be used as role context, but they are not permission enforcement.
- In Codex-native challenge or review, load only the relevant `.opencode/agents/<role>.md` profile, keep agents read-only, avoid `.opencode/AGENT_STATE.md`, and do not run `npm run agents:*` unless OpenCode is explicitly requested.
- `npm run agents:plan` is draft/read-only by default. Use `npm run agents:plan:execute` only when the user explicitly wants a mutating planning flow.
- OpenCode runners must not pass `--dangerously-skip-permissions` by default. Dangerous permission bypass is explicit opt-in and is prohibited for read-only agents.
- `agents:run` and `agents:parallel` require `--write` plus concrete `--ownership` before workers can edit files; review, security and UX agents stay read-only.
- Do only the minimum manual prep needed to form a safe command, scope and ownership.
- Do not use subagents for trivial changes.
- Model routing pilot: keep GPT-5.5 as lead/orchestrator/verifier for ambiguous, sensitive, multi-area, data/RLS, finance, security, release and final review work. Use GPT-5.3-Codex-Spark only as a fast worker for small, local, low-risk tasks with explicit ownership and objective verification; escalate to GPT-5.5 after failed verification, sensitive scope, more than 1 retry or overly broad diffs.
- Parallel agents need isolated write ownership or explicit coordination through `.opencode/AGENT_STATE.md`.
- For parallel release slices, freeze Product Brain issue IDs, titles, ownership and out-of-scope rules before launching code workers. If a docs worker runs concurrently, the lead must reconcile Product Brain against the accepted plan and the actual implementation before marking issues done; docs workers must not invent adjacent scope.
- `.opencode/AGENT_STATE.md` is a live scratchboard; keep active signals and events empty after completed tasks.
- Permanent history lives in GitHub issues, PRs and commits, not in `.opencode/AGENT_STATE.md` or `.memory/`.

Planning and implementation:
- New product work should be traceable to Product Brain issue/release context when applicable.
- Product Brain v2 is Product Brain-first and repo-native: orient with `npm run pb:orient -- --json`, then read only the related issue, parent, release or source-touchpoint. Agents must not recreate v1 `type/status` issue frontmatter.
- Product Brain-aware agents close with `Contexto leído`, `Product Brain leído`, `Product Brain actualizado`, `Validación PB` and `Feedback/Memory`.
- Use `pb:ready-check CACH-XXXX` before treating a slice/task as ready, and `pb:close-check CACH-XXXX` before closing current work.
- Work that belongs to an active release branches from the release branch; small fixes may branch from `main` when outside release scope.
- Active release does not mean every new task belongs to it: if the task is outside release scope, postpone it, use the lightweight `main` -> PR flow, or add it explicitly to the release document first.
- For active beta releases, agents create task branches locally from the active `release/<version>` branch, prefer `feat/` for new feature branches (`feature/` is legacy), do not push task branches by default, review diff/log against the release, and integrate completed work into the release via squash after local verification.
- `npm run ship -- --execute --issue CACH-XXXX` must block `work_type: feature` issues with `release: null`; use `--allow-no-release` only for a deliberate lightweight exception and explain it in the issue/PR.
- Release closure standard: consolidate implementation, Product Brain updates, generated indexes/digest, memory notes and validation status into the cleanest possible final history. Prefer a single clear release commit or squash-style merge result over scattered fixups; leave `main`/release branches clean, no uncommitted generated artifacts, no stray pushed task branches, and no unexplained git traces.
- Commit format for CACH work: `<type>(CACH-XXXX): summary`.
- Do not add `Co-Authored-By` or AI co-author lines to commits.

Verification and closure:
- Verification agents should verify from task, diff, acceptance criteria and relevant rules.
- Visual/responsive tasks need route, viewport/condition, symptom or capture, and visual acceptance criteria.
- When unifying UI from an external design export, compare target CSS/components/screenshots against the app before closing; token aliases alone do not prove the visual language is unified.
- For `react-big-calendar`, verify toolbar, header and month rows/cells are visible.
- Before closing any task, pass the learning loop: identify whether the work produced durable learning, update memory/docs/process when it did, or explicitly declare `Memoria: no aplica`.
- Do not close a tracked issue just because a local fix exists.
- Resolved issues must stay linked to the PR or pushed commit that resolves them.
- If there is an open PR, keep the issue open and use `Closes #N`, `Fixes #N` or equivalent in the PR body.
- If there is no PR, close only after pushed commit plus comment with summary, commit/branch, verification and memory/docs status.
- If the user expects the change in the live app, preview is not enough: merge to `main`, verify production alias and clean branches.

Remote database operations:
- Prefer Supabase MCP for direct CulturaApp database diagnostics and operations when available; use SQL Editor as manual fallback when the current agent session lacks MCP access.
- For production mutations, agents must show the exact SQL or migration and wait for explicit human confirmation before executing.
- Do not store or paste PATs, connection strings, service role keys, passwords or `.env.local` values in repo, memory, issues, prompts or PRs.
- Canonical workflow: `docs/project/process/supabase-db-access.md`.
- Releases/features that touch `supabase/migrations/**` need an explicit remote DB state before closure: `aplicado/verificado` or `pendiente/bloquea funcionalidad`. Do not mark Supabase persistence as production-verified from mock-only smoke tests.

Memory hygiene:
- Before opening a PR, review task context, diff and commits against base.
- Update `.memory/` only for durable preferences, product decisions, recurring gotchas or workflow rules.
- If nothing durable changed, declare `Memoria: no aplica`.
- Do not store run logs, branch lists, commit histories, closed-issue summaries or temporary state in `.memory/`.
- Store reusable lessons, not execution history.

Agent supervision:
- Before launching a duplicate agent, check whether an existing process is still active.
- Before killing a process, identify whether it is making progress.
- If no visible feedback appears, inspect the OpenCode run output/log before assuming failure.
- `run-agent.mjs` and `run-parallel-agents.mjs` have timeouts; timeout output is diagnostic, not durable memory.
- `.opencode/runs/current.json` is operational state for live runs; do not treat it as project history.

## Historical Notes

- 2026-05-03: OpenCode workflow, task template, shared state and issue-resolution process were introduced and refined. Sources: `.opencode/README.md`, `.opencode/AGENT_TASK_TEMPLATE.md`, git history around commits `71ff8fa`, `5ce937f`, `1033955`, `62b247e`, `c67348e`.
- 2026-05-03: Memory should not mirror every task; GitHub issues, PRs and commits are the operational history.
- 2026-05-04: PR/issue linking, production verification and branch cleanup became part of the closure workflow. Sources: issues `#21`, `#22`, `#24`, PRs `#19`, `#23`.
- 2026-05-05: `verification-agent` was added for post-implementation verification when code, UI, build/config/deploy or PR readiness has meaningful risk.
- 2026-05-05: Product Brain workflow became the product source of truth for issues, releases, plans and decisions.
- 2026-05-06: Agent timeouts and `.opencode/runs/current.json` were added to prevent invisible long-running executions.
- 2026-05-06: Earlier notes about per-agent `AGENTS.md` digests are superseded by current policy: compact `AGENTS.md` plus `docs/agent-context-policy.md` and detail under demand.
