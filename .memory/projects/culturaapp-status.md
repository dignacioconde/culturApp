# CulturaApp Status Memory

## 2026-05-03 - MVP App Shape Is Implemented Locally

- Context: The initial app and subsequent commits built the React/Vite/Supabase MVP with auth, protected routes, dashboard, calendars, projects, events, incomes, expenses, settings, shared UI components, formatters, hooks, and Spanish UI.
- Durable memory: current code is beyond scaffold: it has CRUD for projects/events/incomes/expenses, two calendars, dashboard KPIs, profile settings, toast notifications, custom selectors/date controls, and Supabase hooks. Deploy to Vercel remains pending.
- Source: commits `476870c`, `71ff8fa`, `48f8b89`, `9f6e1c`, `fc99c25`; `AGENTS.md`; `TECHDOC.md`; `README.md`.

## 2026-05-03 - Documentation Sources Were Reviewed Against Commits

- Context: During memory curation, tracked Markdown docs and commits through `37ff950` were reviewed. Small stale counts were found and corrected: README omitted `memory-protocol`, TECHDOC counted 6 skills instead of 7, and OpenCode docs said seven subagents where nine exist.
- Durable memory: after `37ff950`, the accurate counts are 7 portable skills and 9 OpenCode subagents plus `cultura-lead`.
- Source: `git log --stat --reverse`, `README.md`, `TECHDOC.md`, `.opencode/README.md`, `find .agents/skills`, `find .claude/skills`.

## 2026-05-03 - Remaining Product/Release Gaps

- Context: Project docs consistently mark Vercel deploy and mobile week UX as not fully done.
- Durable memory: do not describe the project as deployed; Vercel remains pending. Do not mark mobile week view for `/calendar/events` as solved; issue `#3` remains open conceptually and the current horizontal scroll is only an acceptable patch.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`.
