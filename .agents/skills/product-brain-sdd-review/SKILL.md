---
name: product-brain-sdd-review
description: Review Product Brain CACH issues for lightweight spec-driven readiness before implementation. Use when asked for SDD review, spec readiness, issue readiness, requirements-to-validation traceability, or avoiding Product Brain token dump. Do not use to create issues, edit docs, implement code, or replace pb:ready-check.
---

# Product Brain SDD Review

## Purpose

Review whether a Product Brain issue is executable as a lightweight spec without turning Caches into a heavy spec framework.

This skill is read-only by default. It checks semantic readiness: observable requirements, bounded scope, enough technical design for risky work, derivable tasks, validation traceability, and low risk of stale duplicated context.

## When to use this skill

- The user asks for "SDD review", "spec review", "ready review", "revisa si esta issue esta ready", or "comprueba trazabilidad requisitos-pruebas".
- A `CACH-*` issue is about to move to `issue_workflow: ready`.
- A feature, bug, or slice looks ambiguous even though `pb:ready-check` passes structurally.
- A planner draft needs a quality pass before agents implement it.
- You need to decide whether an idea should become a slice, spike, ADR, or remain deferred in the intake queue.

## When not to use this skill

- Do not use for Product Brain orientation only; use `product-brain-orient`.
- Do not use for capture or issue creation; use `product-brain-capture` or `cultura-issue-launch`.
- Do not use for code review after implementation; use `cultura-code-review`.
- Do not use for visual/frontend, data/finance, security, or release verification when a narrower review skill owns the work.
- Do not use to require heavy SDD artifacts such as `.specify/`, generated task folders, or framework-specific documents.

## Inputs to inspect

- `AGENTS.md`
- `docs/agent-context-policy.md`
- `.memory/MEMORY.md`
- `npm run pb:orient -- --json`
- The target `docs/project/issues/CACH-*.md`
- Parent initiative, release document, ADRs, or source touchpoints only when referenced by the issue or needed to judge readiness.
- `docs/project/process/definition-of-ready.md`
- `docs/project/process/definition-of-done.md`
- `docs/project/templates/ISSUE_TEMPLATE.md`
- `scripts/brain/ready-check.mjs` when checking script-backed gates.

## Procedure

1. Orient with `npm run pb:orient -- --json` unless the relevant issue context is already present.
2. Load only the target issue and directly referenced parent, release, ADRs, or source touchpoints.
3. Run or mentally apply `pb:ready-check` rules: ready workflow, non-initiative work level, objective, scope, checklist criteria, validation, components, and valid parent.
4. Judge requirements:
   - Criteria describe observable behavior or user-visible/system-visible outcomes.
   - Criteria avoid placeholders, generic "works correctly" wording, and implementation-only chores without value.
   - For `feature` and `bug`, prefer scenario language such as `Cuando... entonces...` or `WHEN... THEN...` when it clarifies behavior, but do not require it mechanically.
5. Judge design sufficiency:
   - `size: xs` can stay lightweight.
   - `size: m`, `area: data|security|infra`, components `finance|supabase|auth-onboarding`, or multi-component work should include a short `Plan tecnico` or equivalent notes.
   - The plan should name contracts, hooks, migrations, APIs, UX states, or affected modules when relevant, without freezing unnecessary implementation details.
6. Judge task derivability:
   - An implementer can identify the first files/modules to inspect.
   - Dependencies, blockers, and out-of-scope items are explicit enough to avoid scope creep.
   - Initiatives are not treated as executable; recommend a slice when needed.
7. Judge validation and traceability:
   - Each important criterion has a plausible automated, browser, manual, SQL/RLS, or review check.
   - Validation is specific to the domain, not only generic `lint/build`.
   - Close evidence should be possible without rewriting the spec after the fact.
8. Judge drift and token discipline:
   - The issue references ADRs, memory, source touchpoints, or process docs instead of copying long global rules.
   - The issue is small enough for one focused implementation pass.
   - No stale historical context is required to understand the executable work.
9. Return a readiness verdict with the smallest changes that would make the issue executable.

## Output format

```markdown
Verdict: Ready | Ready with risks | Not ready

Gaps:
- Requisitos: ...
- Diseno tecnico: ...
- Tareas derivables: ...
- Validacion/trazabilidad: ...
- Drift/token dump: ...

Cambios minimos sugeridos:
- ...

Checks PB:
- `npm run pb:ready-check -- CACH-XXXX`: run/skip + motivo
- `npm run pb:guard`: run/skip + motivo

Decision:
- Implementable now / create slice / create spike / create ADR / defer in intake queue

Contexto leido:
Product Brain leido:
Product Brain actualizado:
Validacion PB:
Feedback/Memory:
```

Use `No gaps relevantes` for categories that are clean.

## Severity / priority model

- CRITICAL: issue would cause unsafe data access, auth/RLS/privacy risk, production mutation, or destructive action without explicit confirmation.
- HIGH: not executable, missing clear user/system outcome, missing required technical plan, or validation cannot prove acceptance criteria.
- MEDIUM: implementable but ambiguous, too broad, weak traceability, or likely to drift from canonical docs.
- LOW: wording, naming, examples, or minor checklist clarity.

## Quality bar

- The review is short, specific, and actionable.
- The verdict can be used by `cultura-planner`, `cultura-docs`, `cultura-review`, or `cultura-testing` without another interpretation pass.
- The suggested changes are smaller than writing a full new spec.
- The review protects Thin Product Brain: no framework migration, no duplicated global rules, no historical context dump.

## Common mistakes to avoid

- Turning every issue into a long PRD.
- Requiring `WHEN/THEN` when plain criteria are already observable and testable.
- Adding a `risk` frontmatter field; use existing `size`, `area`, `components`, ADRs, and validation notes.
- Duplicating `product-brain-orient`, `cultura-issue-launch`, `cultura-docs`, or code review responsibilities.
- Treating `pb:ready-check` as semantic proof; it is a structural gate.
- Rewriting the issue or changing workflow state during a read-only review.

## Safety notes

Do not inspect secrets, `.env.local` values, service role keys, private customer data, or remote production systems. Do not mutate Product Brain, GitHub, Supabase, Vercel, branches, commits, or files unless the user explicitly asks for an implementation task outside this review.

## Product Brain v2 Contract

When this workflow touches Product Brain, use flat v2 frontmatter: `schema_version: 2`, `kind`, `lifecycle`, and domain fields such as `issue_workflow`, `work_type`, `work_level`, `size`, `components`, `parent`, `release`, and `theme`. Do not create new `type/status` top-level Product Brain documents.

Prefer `npm run pb:orient -- --json` before reading Product Brain detail. Read only the related issue, parent, release, ADR or source-touchpoint. Generated files such as `DIGEST.md` and generated indexes are regenerated by scripts, not edited manually.

Close every Product Brain-aware response with: `Contexto leido`, `Product Brain leido`, `Product Brain actualizado`, `Validacion PB`, and `Feedback/Memory`.
