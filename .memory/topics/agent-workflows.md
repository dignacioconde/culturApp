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

Agent execution:
- When the user asks to run OpenCode agents, launch the repository workflow directly.
- Do only the minimum manual prep needed to form a safe command, scope and ownership.
- Do not use subagents for trivial changes.
- Parallel agents need isolated write ownership or explicit coordination through `.opencode/AGENT_STATE.md`.
- `.opencode/AGENT_STATE.md` is a live scratchboard; keep active signals and events empty after completed tasks.
- Permanent history lives in GitHub issues, PRs and commits, not in `.opencode/AGENT_STATE.md` or `.memory/`.

Planning and implementation:
- New product work should be traceable to Product Brain issue/release context when applicable.
- Work that belongs to an active release branches from the release branch; small fixes may branch from `main` when outside release scope.
- Commit format for CACH work: `<type>(CACH-XXXX): summary`.
- Do not add `Co-Authored-By` or AI co-author lines to commits.

Verification and closure:
- Verification agents should verify from task, diff, acceptance criteria and relevant rules.
- Visual/responsive tasks need route, viewport/condition, symptom or capture, and visual acceptance criteria.
- For `react-big-calendar`, verify toolbar, header and month rows/cells are visible.
- Do not close a tracked issue just because a local fix exists.
- Resolved issues must stay linked to the PR or pushed commit that resolves them.
- If there is an open PR, keep the issue open and use `Closes #N`, `Fixes #N` or equivalent in the PR body.
- If there is no PR, close only after pushed commit plus comment with summary, commit/branch, verification and memory/docs status.
- If the user expects the change in the live app, preview is not enough: merge to `main`, verify production alias and clean branches.

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
