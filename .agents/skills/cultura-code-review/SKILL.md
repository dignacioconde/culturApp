---
name: cultura-code-review
description: Perform a focused CulturaApp code review of local changes, PR diffs, or proposed patches. Use when the user asks for review, architectural review, production readiness, maintainability, bug risk, performance risk, or cross-cutting quality across React, hooks, Supabase, finance, UI, and skills. Do not use as the primary implementation workflow unless the user asks to fix findings after review.
---

# Cultura Code Review

## Purpose

Review CulturaApp changes from a senior engineering stance: bugs first, then data/security risks, then maintainability, accessibility, performance, tests, and documentation drift.

## When to use this skill

- The user asks for a review, audit, production readiness check, architecture review, frontend review, performance review, or "look over this diff".
- A change crosses several domains: UI plus hooks, financial logic plus routing, skills plus docs, or release plus app code.
- The task needs a compact severity-ranked set of findings.

## When not to use this skill

- The user has asked for implementation and no review is needed yet.
- The task is narrowly about creating/updating skills; use `portable-skill-authoring`.
- The task is a pure security review; use `cultura-security-privacy-review`.
- The task is only verification/release; use `cultura-testing-release-check`.

## Inputs to inspect

- `git status --short`, `git diff --stat`, and relevant `git diff`.
- `AGENTS.md` and any affected docs.
- Changed files and their callers/importers.
- Related hooks, components, pages, formatters, constants, and SQL snippets.
- `package.json` scripts and verification output when available.

## Procedure

1. Determine the review scope from the user request and current diff.
2. Identify changed contracts: route, component props, hook shape, data model, financial formula, docs, skill discovery, or build config.
3. Read affected code and nearest consumers rather than reviewing files in isolation.
4. Check for regressions against `AGENTS.md`: Spanish UI, hooks for Supabase, formatters, event/project model, selector wrappers, RLS, and calendar constraints.
5. Check financial formulas and direct-vs-aggregate project data separation when incomes/expenses are involved.
6. Check security/privacy when user data, auth, RLS, environment variables, or skill instructions are touched.
7. Check accessibility and responsive behavior for visible UI changes.
8. Check performance only where it affects real workflows: dashboard aggregation, calendar event rendering, repeated maps/filtering, and large lists.
9. Check tests/verification match the risk of the change.
10. Report findings first. Keep summaries brief and secondary.

## Output format

Use this order:

1. Findings, ordered by severity, with file/line references when possible.
2. Open questions or assumptions.
3. Verification gaps or residual risk.
4. Brief change summary only if useful.

Each finding should include impact and a concrete remediation.

## Severity / priority model

- CRITICAL: data exposure, data loss, broken auth, broken build, app-wide crash, destructive instruction, or primary workflow unusable.
- HIGH: wrong financial result, broken CRUD, RLS/user filter regression, calendar collapse, route regression, or serious accessibility blocker.
- MEDIUM: likely edge-case bug, maintainability risk that will cause drift, missing validation, insufficient error/loading state, or inadequate verification.
- LOW: polish, naming, small duplication, docs wording, optional hardening.

## Quality bar

- Findings are grounded in code, not preference.
- Reviews avoid broad rewrites and focus on actionable fixes.
- The review distinguishes blockers from improvements.
- No issue is reported without a plausible user or maintainer impact.
- If no issues are found, say so and name remaining test gaps.

## Common mistakes to avoid

- Starting with a summary before findings.
- Reviewing only the edited file and missing affected callers.
- Treating style preference as a bug.
- Ignoring docs/skills drift when instructions changed.
- Asking for tests that the current repo cannot reasonably run without new dependencies.

## Safety notes

Do not modify files during review unless the user explicitly asks for fixes. Do not run destructive git commands. Do not inspect secret values. If review requires remote PR or CI data, use official/local tooling and avoid exposing private data in the response.
