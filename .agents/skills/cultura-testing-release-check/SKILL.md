---
name: cultura-testing-release-check
description: Build a testing strategy or release-readiness check for CulturaApp. Use for lint/build verification, smoke tests, regression matrices, pre-deploy Vercel checks, post-deploy smoke tests, responsive calendar verification, and production readiness. Do not use for implementing feature code unless the task is specifically about test or release workflow.
---

# Cultura Testing Release Check

## Purpose

Close changes with practical verification: lint/build, targeted smoke tests, high-risk data cases, responsive calendar checks, and deploy readiness without touching remote services unexpectedly.

## When to use this skill

- The task asks for tests, QA, regression review, release checklist, deploy readiness, Vercel readiness, smoke testing, or "is this ready".
- A change affects routes, forms, calendars, hooks, financial calculations, auth, Supabase, or agent/skill instructions.
- The user wants a test matrix for a feature or bug fix.

## When not to use this skill

- The task is a pure design discussion, source-only review, or data-model implementation without verification request.
- The user asks for a security-specific audit; use `cultura-security-privacy-review`.
- The user asks to deploy to production immediately; use this skill for checks, then require explicit confirmation for remote actions.

## Inputs to inspect

- `package.json` scripts.
- `AGENTS.md` Definition of Done and open issues.
- Changed files from `git diff --stat` and `git diff`.
- Relevant pages, hooks, and components.
- `README.md`/`TECHDOC.md` deploy notes if release is in scope.
- Existing `.opencode/runs/**` only if the user asks to compare prior agent results.

## Procedure

1. Identify what changed and map it to risk areas: UI, data, auth, financial logic, calendar, docs, skills, or deploy.
2. Run or request `npm run lint` and `npm run build` when code changed.
3. For form changes, verify create/edit/delete paths, validation, loading/error states, and reset behavior.
4. For data changes, verify event without project, project without events, project with mixed direct and event-linked incomes/expenses, pending income, paid income, and profile-missing 409 behavior if relevant.
5. For financial changes, verify gross expected, gross paid, retentions, expenses, net profit, billable hours, and gross hourly rate.
6. For calendar or responsive changes, verify `/calendar/events` and `/calendar/projects` at 320, 375, 640, 768, 1024, and 1280 px when browser tooling is available; confirm toolbar, headers, rows/cells, and events are visible.
7. For release readiness, check `.gitignore`, environment variable documentation, Vercel framework assumptions, build output, and smoke paths.
8. For post-deploy smoke plans, cover register, login, create project, create event, add income, add expense, review dashboard, and sign out.
9. Separate checks actually run from checks recommended but not run.

## Output format

Return:

- Scope verified.
- Commands run and outcome.
- Manual/browser checks run or proposed.
- Regression matrix with pass/fail/not-run.
- Release blockers.
- Residual risks.

## Severity / priority model

- CRITICAL: build broken, app cannot start, auth unavailable, primary CRUD broken, or deploy would expose secrets/data.
- HIGH: lint failure in changed code, financial regression, calendar invisible, RLS/auth behavior unverified after data change, or blocking responsive issue.
- MEDIUM: missing smoke coverage for changed workflow, partial browser verification, weak edge-case coverage.
- LOW: extra tests, documentation polish, non-blocking QA notes.

## Quality bar

- Verification matches the actual change.
- Code changes end with lint/build when feasible.
- Manual test matrices are short and executable.
- Calendar work includes visual criteria, not just class inspection.
- Release checks never mutate production without explicit confirmation.

## Common mistakes to avoid

- Saying "tested" when only lint/build ran for a visual bug.
- Ignoring `/calendar/events` mobile week limitations.
- Treating no automated tests as no testing strategy.
- Mixing checks run with checks still recommended.
- Running deploy or remote migration as part of readiness without confirmation.

## Safety notes

Do not deploy, push, run production migrations, rotate secrets, or call remote admin APIs without explicit user confirmation. Do not install dependencies just to run optional tests. Do not read or print `.env.local`; only check that required variable names are documented.
