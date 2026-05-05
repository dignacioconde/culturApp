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

## 2026-05-05 - Work Navigation Must Own Project/Event Details

- Context: User feedback showed the previous `/work` iteration was not usable enough: after opening a project from "Trabajos", the detail pushed the user into `/projects` and forced browser-back navigation to return to the projects tab.
- Durable memory: `/work` should be treated as the primary "Trabajos" workflow, not a cosmetic shortcut to separate `/projects` and `/events` sections. Project and event detail pages must breadcrumb and return to `/work?view=projects` or `/work?view=events` when reached from this flow; tabs in `Trabajos` should be URL-addressable so navigation is recoverable on mobile and desktop.
- Durable memory: for details reached from `Trabajos`, avoid large full-width CTAs and repeated empty-state buttons. Primary actions should be compact, aligned with the section header, and visually secondary to the work content unless they are the main task. Hide default `Confirmado` badges when they add noise rather than information.
- Durable memory: future UI fixes should verify the whole navigation loop, not only the screen where the bug is reported: list/tab -> detail -> related detail -> return path.
- Source: CACH-B0001 feedback, PR `#75`, merge commit `9715736`.

## 2026-05-05 - Mobile Dashboard Prioritizes Operational Awareness

The mobile dashboard should answer day-to-day questions first: What do I have today or next? Which pending payments need attention? Which active projects are moving now? Financial KPIs remain useful but should be secondary and compact on mobile, not dominating the first screen.

## 2026-05-05 - Event Detail Must Prioritize Fast Editing Over Visual Weight

- Context: User feedback on event editing reported that the detail screen felt too crowded and made simple edits harder than they should be, especially on mobile.
- Durable memory: `EventDetail` should present event identity, related project, and edit/delete actions in a compact header instead of using a large highlighted project block. Financial summary should open with only the most decision-useful figures (`Cobrado`, `Pendiente`, `Beneficio neto`) and keep secondary metrics behind a lighter "Ver detalle financiero" reveal.
- Durable memory: income and expense sections should expose count and total in the section header and keep mobile rows tap-friendly and compact so editing individual items feels direct.
- Durable memory: on mobile, `EventDetail` should prefer inline quick-add flows for incomes and expenses over modal-first creation. Quick income entry should allow concept + amount + paid toggle in one small form, and mobile income rows should expose a readable paid/pending toggle instead of icon-only status.
- Source: direct user feedback during local UI simplification on `src/pages/Events/EventDetail.jsx`.
