---
name: cultura-data-finance-review
description: Review or implement CulturaApp data, Supabase, hooks, RLS, and financial calculation changes. Use for projects/events/incomes/expenses, user_id handling, projectId/eventId/eventIds filters, dashboard KPIs, hourly rate, SQL migrations, trigger handle_new_user, or Supabase 409/profile issues. Do not use for purely visual changes except to check data contract impact.
---

# Cultura Data Finance Review

## Purpose

Protect CulturaApp's data model and financial meaning: projects group work, events are concrete dated occurrences, incomes/expenses can attach to either level, and user data stays isolated by RLS.

## When to use this skill

- The task touches `src/hooks/**`, Supabase SQL, `src/supabaseClient.js`, dashboard calculations, project/event detail financial summaries, or data filters.
- A change modifies `profiles`, `projects`, `events`, `incomes`, `expenses`, `user_id`, `project_id`, `event_id`, or `eventIds`.
- The user reports Supabase errors, profile creation failures, 409s, missing rows, wrong totals, or incorrect project/event aggregation.

## When not to use this skill

- The task is only about visual layout, copy, icons, accessibility, or responsive behavior.
- The request is a general security review with no data-model changes; use `cultura-security-privacy-review`.
- The user asks for deploy-only checks.

## Inputs to inspect

- `AGENTS.md` model, SQL schema, hook signatures, and formatter rules.
- `src/hooks/useProjects.js`, `useEvents.js`, `useIncomes.js`, `useExpenses.js`, `useProfile.js`, `useAuth.js`.
- `src/pages/Dashboard/Dashboard.jsx`, `src/pages/Projects/ProjectDetail.jsx`, `src/pages/Events/EventDetail.jsx`.
- `src/lib/formatters.js` and `src/lib/constants.js`.
- Any SQL snippets in `README.md`, `TECHDOC.md`, or proposed migrations.

## Procedure

1. Restate which entity level is affected: project, event, income, expense, profile, or aggregate view.
2. Verify RLS assumptions: every user-owned table has `user_id`, profiles use `id`, and policies match `auth.uid()`.
3. Check that components consume hooks and do not bypass the data layer.
4. Verify inserts include `user_id: userId` where required.
5. Confirm `events.project_id` stays nullable and project deletion does not delete independent event history unexpectedly.
6. For incomes and expenses, preserve the constraint that at least one of `project_id` or `event_id` is present.
7. For `useIncomes` and `useExpenses`, preserve the three modes: all user rows, event-only, project-only, and project plus event IDs through OR filtering.
8. For project detail, keep editable tables limited to direct project incomes/expenses while KPIs aggregate project plus child events.
9. For dashboard and hourly rate, include direct project incomes/expenses in overall totals, but compute gross hourly rate only from paid event incomes and event durations.
10. Check date types: `date` fields use date formatters and `timestamptz` fields use datetime formatters.
11. If SQL changes are needed, provide migration SQL, rollback notes, RLS implications, and manual Supabase steps. Do not execute remote migrations without explicit confirmation.
12. Run `npm run lint` and `npm run build` after code changes when feasible.

## Output format

Return:

- Data contract changed or confirmed.
- Affected files and tables.
- Financial formula impact.
- RLS/user isolation impact.
- Migration or rollback notes if any.
- Verification commands and results.
- Follow-up UI/testing/security checks needed.

## Severity / priority model

- CRITICAL: possible cross-user data exposure, missing RLS, service-role leakage, destructive migration, or financial data loss.
- HIGH: wrong `user_id`, broken hook contract, incorrect project/event aggregation, wrong hourly rate numerator/denominator, or profile trigger regression.
- MEDIUM: inconsistent date type handling, stale loading/error state, weak validation, duplicated calculation likely to drift.
- LOW: naming, ordering, non-blocking refactor, documentation polish.

## Quality bar

- Data ownership is explicit and covered by RLS.
- Hooks expose stable `loading`, `error`, data, CRUD methods, and `refetch`.
- Financial calculations match `AGENTS.md`.
- Project/event/income/expense relationships remain understandable from both UI and code.
- SQL notes are reversible or explain why they are not.

## Common mistakes to avoid

- Mixing direct project rows into editable event tables.
- Including direct project income in gross hourly rate.
- Depending on joins for RLS in `incomes` or `expenses`.
- Forgetting `public.profiles` in `handle_new_user`.
- Sorting `eventIds` in place instead of serializing a copied array.
- Treating a profile 409 as a frontend-only bug.

## Safety notes

Do not run Supabase SQL remotely without explicit user confirmation. Do not read or print `.env.local`. Never recommend disabling RLS as a fix. Never introduce service role keys into frontend code or repo files.
