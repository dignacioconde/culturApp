# CulturaApp Status Memory

## 2026-05-03 - MVP App Shape Is Implemented Locally

- Context: The initial app and subsequent commits built the React/Vite/Supabase MVP with auth, protected routes, dashboard, calendars, projects, events, incomes, expenses, settings, shared UI components, formatters, hooks, and Spanish UI.
- Durable memory: current code is beyond scaffold: it has CRUD for projects/events/incomes/expenses, two calendars, dashboard KPIs, profile settings, toast notifications, custom selectors/date controls, Supabase hooks, and verified Vercel production deployment.
- Source: commits `476870c`, `71ff8fa`, `48f8b89`, `9f6e1c`, `fc99c25`; `AGENTS.md`; `TECHDOC.md`; `README.md`.

## 2026-05-03 - Documentation Sources Were Reviewed Against Commits

- Context: During memory curation, tracked Markdown docs and commits through `37ff950` were reviewed. Small stale counts were found and corrected: README omitted `memory-protocol`, TECHDOC counted 6 skills instead of 7, and OpenCode docs said seven subagents where nine exist.
- Durable memory: after `37ff950`, the accurate counts are 7 portable skills and 9 OpenCode subagents plus `cultura-lead`.
- Source: `git log --stat --reverse`, `README.md`, `TECHDOC.md`, `.opencode/README.md`, `find .agents/skills`, `find .claude/skills`.

## 2026-05-03 - Remaining Product/Release Gaps

- Context: Project docs previously marked Vercel deploy and mobile week UX as not fully done.
- Durable memory: Vercel production deploy has since been verified; see [routing-deploy.md](routing-deploy.md). Mobile week UX issue `#3` is closed and the current horizontal scroll is accepted for now; if the topic is reprioritized, open a new issue with a concrete mobile UX decision and screenshot criteria.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`.

## 2026-05-03 - Work Grouping First Iteration

- Context: GitHub issue `#9` implemented the proposal from `#8` for grouping projects and events.
- Durable memory: the app now has `/work` as an incremental unified "Trabajos" entry point for projects and events. Existing routes `/projects`, `/events`, `/calendar/events`, and `/calendar/projects` remain valid. `EventDetail` makes the associated project more prominent.
- Source: commit `8b2d1a4` plus follow-up fix for `/work` links.
