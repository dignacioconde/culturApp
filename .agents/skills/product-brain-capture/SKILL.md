---
name: product-brain-capture
description: Triggered when the user asks to capture ideas, decisions, or context into the Product Brain (docs/project/). Use instead of creating GitHub Issues unless implementation is requested.
---

# Product Brain Capture

## Purpose

Provide Codex/Claude with a finite workflow to capture thoughts into the Product Brain (docs/project/) without creating GitHub Issues. A skill of workflow, not a parallel brain.

## When to use this skill

- Use when the user says "PB inbox:", "PB idea:", "PB issue:", "PB decisión:", "PB contexto:", "mete esto en el brain", "captura esto"
- Use to classify and persist product thoughts, not implementation tasks
- Do NOT use for purely technical notes better stored in code comments or AGENTS.md

## When not to use this skill

- Do not use when user explicitly asks for GitHub Issue ("abre issue en GitHub", "quiero un issue")
- Do not use when the output is code or a PR — that's an implementation task
- Do not use for secrets, credentials, or sensitive client data

## Inputs to inspect

- Read `docs/project/START_HERE.md` (do not modify — it's reference)
- Run `npm run pb:status` to see current state

## Procedure

1. **Read the reference**: `cat docs/project/START_HERE.md` — understand the structure and prefix convention (CACH-*)
2. **Check current state**: Run `npm run pb:status` — detect any drift or conflicts before capturing
3. **If drift/conflict detected**: Stop. Report the conflict and ask user how to resolve instead of overwriting
4. **Capture**: Run `npm run pb:capture -- "CONTENT"` with the proper prefix:
   - `PB inbox: algo` → captures as inbox item
   - `PB idea: algo` → captures as idea
   - `PB issue: algo` → captures as product issue
   - `PB decisión: algo` → captures as decision
   - `PB contexto: algo` → captures as context note
5. **Optional push**: If the user wants it visible in Obsidian iCloud, run `npm run pb:push`
6. **Report outcome**: What was captured, which file, and the result of pb:push if executed

## Output format

```
Capturado: [prefix] - [content]
Archivo: docs/project/[file].md
pb:push: ejecutado / no ejecutado
```

## Severity

- LOW: Non-blocking capture workflow
- Stop on conflict: if pb:status shows drift, do not overwrite without user confirmation

## Quality bar

- Always read START_HERE.md before first capture in a session
- Run pb:status before each capture to detect conflicts
- Do not capture without the correct prefix
- Keep captures small: one thought per entry

## Common mistakes to avoid

- Skipping pb:status — causes duplicate or conflicting captures
- Using GitHub Issues for product thoughts (that's the anti-pattern)
- Capturing implementation tasks — they go through the normal flow with agents
- Using .memory/ for backlog — memory is for durable context, not backlog

## Safety notes

- Do NOT capture secrets, credentials, API keys, or tokens
- Do NOT capture sensitive client data without explicit confirmation
- Do NOT use .memory/ for backlog storage — that's not its purpose
- pb:push syncs to Obsidian iCloud — do not push sensitive content