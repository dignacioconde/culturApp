---
name: product-brain-capture
description: Triggered when the user asks to capture ideas, decisions, or context into the Product Brain (docs/project/). Use instead of creating GitHub Issues unless implementation is requested.
---

# Product Brain Capture

## Purpose

Provide Codex/Claude with a finite workflow to capture thoughts into the Product Brain (docs/project/) without creating GitHub Issues. A skill of workflow, not a parallel brain.

## When to use this skill

- Use when the user says "mete esto en el brain", "captura esto", "inbox:", o cualquier variante que indique capturar una idea
- Use para capturar ideas, observaciones, contexto, decisiones o anything que no sea código/implementación
- Do NOT use for purely technical notes better stored in code comments or AGENTS.md

## When not to use this skill

- Do not use when user explicitly asks for GitHub Issue ("abre issue en GitHub", "quiero un issue")
- Do not use when the output is code or a PR — that's an implementation task
- Do not use for secrets, credentials, or sensitive client data

## Inputs to inspect

- Read `docs/project/START_HERE.md` (do not modify — it's reference)
- Run `npm run pb:status` to see current state

## Procedure

**Principio**: TODO entra por el **inbox** primero. Luego en curaduría se mueve a issue, ZK, ADR, contexto, etc.

1. **Read the reference**: `cat docs/project/START_HERE.md` — understand the structure and prefix convention (CACH-*)
2. **Check current state**: Run `npm run pb:status` — detect any drift or conflicts before capturing
3. **If drift/conflict detected**: Stop. Report the conflict and ask user how to resolve instead of overwriting
4. **Capture**: Run `npm run pb:capture -- "PB inbox: CONTENIDO"` — siempre con prefijo `PB inbox:`
   - `PB inbox: Idea rápida sin procesar` → crea inbox item
   - Todas las capturas van aquí, sin importar el tipo
5. **Optional push**: If the user wants it visible in Obsidian iCloud, run `npm run pb:push`
6. **Report outcome**: What was captured, which file, and the result of pb:push if executed

## Flujo completo de Product Brain

```
INBOX (captura rápida)
  ↓
CURADURÍA (revisar, deduplicar, refinar)
  ↓
ISSUE (CACH-*) → implementar con agentes
KNOWLEDGE (ZK) → investigación/referencia
DECISIONS (ADR) → decisiones importantes
CONTEXT → contexto estable del producto
```

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

- **Capturar directamente a ZK/Issue/ADR**: TODO entra por inbox primero — la curaduría lo mueve después
- Skipping pb:status — causes duplicate or conflicting captures
- Using GitHub Issues for product thoughts (that's the anti-pattern)
- Capturing implementation tasks — they go through the normal flow with agents
- Using .memory/ for backlog — memory is for durable context, not backlog
- Duplicados en Product Brain — revisar que no exista la idea antes de capturar

## Safety notes

- Do NOT capture secrets, credentials, API keys, or tokens
- Do NOT capture sensitive client data without explicit confirmation
- Do NOT use .memory/ for backlog storage — that's not its purpose
- pb:push syncs to Obsidian iCloud — do not push sensitive content