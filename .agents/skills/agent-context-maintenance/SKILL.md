---
name: agent-context-maintenance
description: "Maintain agent context hygiene: review context:check warnings, compact oversized prompts, reduce token waste, prevent broad context loading, and keep .memory/ durable instead of historical. Use for AGENTS.md, CLAUDE.md, .opencode/agents/*, .memory/, docs/agent-context-policy.md, context optimization, token reduction, prompt compacting, broad-loading warnings, and agent workflow memory. Do not use for app feature work unless context governance is the task."
---

# Agent Context Maintenance

## Purpose

Maintain agent context, prompt, memory, and documentation hygiene with minimal token waste.

Use this skill to review context-check warnings, compact oversized prompts, prevent broad context loading, and keep durable memory separate from historical run logs.

## When to use this skill

- `npm run context:check` reports warnings.
- Agent prompts exceed word budgets.
- `AGENTS.md` or `CLAUDE.md` grows beyond target.
- Prompts force broad context loading.
- `.memory/` contains run logs, branch lists, commits, or operational history.
- Historical docs may be leaking into active context.
- The user asks to reduce token usage or optimize agent memory.
- A new agent, prompt, workflow, or skill needs context-loading review.
- The task mentions broad-loading warnings, historical/run-log leakage, Product Brain context loading, or agent workflow memory.

## When not to use this skill

- Do not use for normal app feature work unless context governance is the task.
- Do not use for Product Brain capture; use `product-brain-capture`.
- Do not use for full `.memory/` compaction; use `compact-memory`.
- Do not use for ordinary memory reads or writes; use `memory-orient` or `memory-protocol`.
- Do not use for broad code review unless context docs, prompts, or skills are in scope.

## Inputs to inspect

Load only what the task needs:

- `docs/agent-context-policy.md` — canonical context-loading policy.
- `AGENTS.md` — short entry contract.
- `.memory/MEMORY.md` — durable memory index.
- `.opencode/README.md` — OpenCode workflow.
- `.opencode/agents/*.md` — role prompts when prompt compacting is in scope.
- `.memory/topics/agent-workflows.md` — workflow memory when memory hygiene is in scope.
- `npm run context:check` output, when available.

These are references, not a mandatory read list. Read indexes first and load detail only when task-relevant.

## Procedure

1. Confirm the task scope and excluded files.
2. Run or read `npm run context:check` output when available.
3. If the command does not exist, manually apply the same checks: size budgets, broad-loading phrases, and historical/run-log leakage.
4. Classify each finding:
   - Real regression.
   - Acceptable warning.
   - Historical/info.
   - False positive.
   - Out of scope.
5. Pick the smallest safe fix.
6. Modify only files in scope.
7. Preserve role-critical behavior and canonical references.
8. Avoid replacing one broad read list with another.
9. Run verification proportional to the files touched.
10. Report changed files, warning changes, intentionally kept warnings, verification, and next cleanup.

## Finding classification

- CRITICAL: Active instructions force broad loading of secrets, private data, full history, or unrelated folders; stop and narrow scope before editing.
- HIGH: Active prompt or doc forces broad loading, duplicates canonical policy, or mixes operational history into mandatory context.
- MEDIUM: File exceeds budget, contains broad-loading phrases in conditional/prohibitive text, or needs manual review.
- LOW: Historical/info match, quoted example, wording polish, or warning intentionally left for another commit.

Use these labels:

- Real regression: active prompt/doc now forces broad loading, exceeds budget without reason, or mixes history into active context.
- Acceptable warning: conditional/prohibitive phrase, intentional longer prompt, or temporary warning explicitly justified.
- Historical/info: match appears in a file marked `status: Historical` or `load_policy: do_not_load_by_default`.
- False positive: match is inside example text, negative instruction, or quoted historical content.
- Out of scope: valid finding that belongs to another commit.

## Common fixes

- Replace long policy copy with a link to `docs/agent-context-policy.md`.
- Replace broad read lists with "load detail only when task-relevant".
- Move durable lessons out of run-log style notes.
- Mark historical prompts as `load_policy: do_not_load_by_default`.
- Compact role prompts by removing duplicated global rules.
- Keep only role-specific rules in agent prompts.
- Convert references into on-demand pointers, not required reads.
- Leave historical artifacts unchanged if correctly marked.

## Output format

Return:

- Scope inspected.
- Classification summary.
- Changes made.
- Files modified.
- Before/after word counts, when relevant.
- Verification run.
- Warnings reduced.
- Warnings remaining and why.
- Next recommended cleanup.

## Quality bar

- Compact, clear, and actionable; never cryptic.
- Canonical policy remains `docs/agent-context-policy.md`.
- `AGENTS.md` remains the short entry contract.
- Prompts keep role-critical behavior.
- Diffs are small and reviewable.
- Historical information stays traceable but is not loaded by default.

## Common mistakes to avoid

- Cleaning all warnings in one commit.
- Rewriting unrelated prompts.
- Duplicating the full context policy inside prompts or skills.
- Turning reference paths into a new mandatory read list.
- Deleting historical content silently.
- Compressing text until agents must guess.
- Modifying Product Brain when the task only concerns context governance.

## Safety notes

- Do not touch app code unless explicitly asked.
- Do not change agent launcher logic during context cleanup.
- Do not modify Product Brain unless the task explicitly targets it.
- Do not add a second policy competing with `docs/agent-context-policy.md`.
- Do not auto-fix files as part of analysis.
- Do not store secrets, credentials, `.env.local` values, private user data, run logs, branch lists, or commit histories in `.memory/`.

## Product Brain v2 Contract

When this workflow touches Product Brain, use flat v2 frontmatter: `schema_version: 2`, `kind`, `lifecycle`, and domain fields such as `issue_workflow`, `work_type`, `work_level`, `size`, `components`, `parent`, `release`, and `theme`. Do not create new `type/status` top-level Product Brain documents.

Prefer `npm run pb:orient -- --json` before reading Product Brain detail. Read only the related issue, parent, release, ADR or source-touchpoint. Generated files such as `DIGEST.md` and generated indexes are regenerated by scripts, not edited manually.

Close every Product Brain-aware response with: `Contexto leído`, `Product Brain leído`, `Product Brain actualizado`, `Validación PB`, and `Feedback/Memory`.
