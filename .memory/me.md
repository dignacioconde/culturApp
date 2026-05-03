# User Memory

Durable collaboration preferences and user-provided context for CulturaApp agents.

## Working Preferences

- The UI should stay in Spanish from Spain and use informal "tu" wording.
- Responses should be concise unless more detail is requested.
- When the user asks to run OpenCode agents, use the repository agent workflow instead of doing broad manual investigation first.
- Before committing, pushing, closing an issue, or wrapping a meaningful session, explicitly check whether new durable preferences, product decisions, or workflow lessons should be saved in `.memory/`.
- Before opening a PR, whether working through OpenCode agents or directly as Codex/Claude Code, complete the memory checkpoint: update `.memory/` with durable context or explicitly state `Memoria: no aplica`.
- Do not duplicate every issue, PR, or commit in `.memory/`; use GitHub issues, PRs, and commits as the operational history when reconstructing task context. Save only durable preferences, product decisions, recurring gotchas, or workflow lessons.

## Privacy Boundary

- Do not store secrets, credentials, `.env.local` values, private customer data, or sensitive personal information here.
- Ask before saving personal details that were not explicitly requested as memory.
