---
name: memory-orient
description: Fast task-scoped memory briefing for CulturaApp. Routes through .memory/MEMORY.md and loads only relevant durable memory. Use at the start of implementation or planning; do not use to write, compact, or replace Product Brain context.
---

# Memory Orient

## Purpose

Return a compact briefing from the smallest relevant subset of `.memory/`. The routing index is the only area-to-file map; this skill must not duplicate it.

## When to use this skill

- At the start of implementation or planning when durable project memory may affect the task.
- For requests such as "orienta memoria", "qué dice la memoria sobre X" or "qué restricciones hay para X".
- Alongside `product-brain-orient` when both durable lessons and current product context matter.

## When not to use this skill

- Do not write or curate memory; use `memory-protocol` or `compact-memory`.
- Do not use it as Product Brain, source-code or issue retrieval.
- Do not load all memory files to improve confidence.

## Inputs to inspect

- The current task description.
- `.memory/MEMORY.md` as the routing source.
- Only the files returned by `pnpm memory:route -- "<task>" --json`.

## Procedure

1. Read `.memory/MEMORY.md`.
2. Run `pnpm memory:route -- "<task>" --json` with a short task description.
3. Read only `selectedFiles`; never substitute a folder-wide read.
4. Extract constraints, gotchas and preferences that directly affect the task.
5. Report matched signals, files read, estimated tokens and any gap or stale fact.
6. If the command is unavailable, follow the index table manually and use its fallback row when no signal matches.

## Output format

```md
## Memory briefing: <area>

Files read: <paths> · Estimated tokens: <number>
Matched signals: <signals or fallback>

Constraints:
- <only relevant facts>

Gotchas: <facts or none>
Preferences: <facts or none>
Gaps: <facts or none>
```

Keep the briefing under 20 lines.

## Quality bar

- The index and selected files fit within the router budget.
- Every reported fact exists in the files read.
- Generic tasks use only the fallback; multi-area tasks use at most three detail files.
- Current instructions and canonical sources outrank memory.

## Common mistakes to avoid

- Recreating a routing table in this skill.
- Reading `core.md`, `me.md` or every detail file by default.
- Treating compatibility stubs, history or session state as current memory.
- Hiding a routing gap instead of reporting it.

## Safety notes

This skill is read-only. It must not access secrets, private runtime memory, external services or remote systems.

## Product Brain v2 Contract

When Product Brain is relevant, use `pnpm pb:orient -- --json` and read only the related issue, parent, release or source-touchpoint. Do not load Product Brain broadly or recreate legacy v1 fields.
