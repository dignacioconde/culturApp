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
