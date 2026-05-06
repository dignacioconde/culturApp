---
name: memory-orient
description: Fast task-scoped memory briefing for CulturaApp. Reads only the .memory/ files relevant to the current task and returns a compact summary of constraints, gotchas, and preferences that affect it. Use at the start of any implementation or planning task instead of loading all memory files.
---

# Memory Orient

## Purpose

Read the minimal subset of `.memory/` files relevant to a specific task and return a compact briefing. Equivalent to `brain-orient` but for accumulated project memory (preferences, gotchas, decisions) rather than the Product Brain.

The goal is to avoid loading all 17 memory files when only 2-3 are relevant, and to ensure the key constraints reach the agent quickly.

## When to use this skill

- At the start of any implementation or planning task to get the memory context scoped to that task.
- When launching `memory-orient` in parallel with `brain-orient` before a planning session.
- When an agent asks "what should I know about this area from memory?".
- Trigger phrases: "¿qué dice la memoria sobre X?", "orienta memoria", "memory-orient", "qué restricciones hay para", "resumen de memoria para".

## When not to use this skill

- Do not use to write or update memory (use `memory-protocol` for that).
- Do not use to compact or curate memory (use `compact-memory` for that).
- Do not use when you need the full project state — use `brain-orient` for Product Brain context.

## Inputs

- Task description or area keywords (from the current conversation or task prompt)
- `.memory/MEMORY.md` (index)
- `.memory/core.md` (compact map)
- Selected files from `.memory/topics/` and `.memory/projects/` based on task area

## Routing table (area → memory files)

Read the index first, then load only the files that match the task area:

| Task area | Load these files |
|-----------|-----------------|
| Formularios, selectores, date pickers | `.memory/topics/forms.md` |
| Calendario, react-big-calendar, eventos UI | `.memory/projects/calendar.md` |
| Dashboard, KPIs, cobro/hora, finanzas | `.memory/projects/dashboard-finance.md` |
| Settings, perfil de usuario, tax_rate | `.memory/projects/settings.md` |
| Routing, Vercel, SPA, deploy | `.memory/projects/routing-deploy.md` |
| Mobile UX, modales, scroll, viewport | `.memory/lessons_mobile_modals.md` |
| Agentes, OpenCode, workflow, PR, issues | `.memory/topics/agent-workflows.md` |
| Skills portables, .agents/skills | `.memory/topics/portable-skills.md` |
| Estado general del MVP, hitos, gaps | `.memory/projects/culturaapp-status.md` |
| Reglas de trabajo, autonomía, Product Brain | `.memory/feedback_product_brain.md` |
| Branch protection, CI, merge | `.memory/feedback_branch_protection.md` |

If the task spans multiple areas, load all matching files.

## Procedure

1. Read `.memory/MEMORY.md` to confirm the current index.
2. Read `.memory/core.md` to get the compact map.
3. Identify task area from the task description keywords.
4. Load only the matching files from the routing table above.
5. If the task area is unclear or generic, load `core.md` only and ask for clarification or note that full memory can be loaded with `memory-protocol`.
6. Extract only the facts, rules, and gotchas directly relevant to the task. Skip historical narrative.
7. Return the briefing.

## Output format

```
## Memory briefing: <task area>

**Files read**: <list of files loaded>

**Relevant constraints**:
- <constraint 1>
- <constraint 2>
...

**Gotchas**:
- <gotcha 1>
...

**Preferences**:
- <preference 1>
...

**Gaps**: <any missing or stale memory worth noting, or "none">
```

Keep the briefing under 20 lines. If nothing relevant is found, say so explicitly rather than padding.

## Quality bar

- Load the minimum files needed. Never load all 17 files unless explicitly asked.
- Extract facts, not file contents. Summarize durable constraints in 1-2 lines each.
- Do not invent memory. Only report what is in the files.
- Do not write or modify memory files. This skill is read-only.
