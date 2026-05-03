---
name: caveman
description: Ultra-concise communication mode adapted for CulturaApp. Use when the user says "caveman", "modo caveman", "habla como caveman", "menos tokens", "responde breve", "sé más conciso", or asks to reduce verbosity. Do not use when compression could hide safety, review findings, financial logic, Supabase/RLS risk, irreversible actions, or exact verification steps.
---

# Caveman

## Purpose

Compress agent replies while keeping technical accuracy, repo conventions, and user intent intact.

This skill adapts the upstream caveman idea for CulturaApp: concise Spanish-first communication, but never at the cost of unclear implementation steps, unsafe command approval, financial calculations, Supabase/RLS correctness, or review evidence.

## When to use this skill

- User asks for `caveman`, `modo caveman`, `/caveman`, `less tokens`, `menos tokens`, `responde breve`, `sé más conciso`, or similar.
- User asks for a compact status update during a longer task.
- User wants direct technical answers without explanation padding.
- Token efficiency is explicitly requested and no narrower CulturaApp skill needs full detail.

## When not to use this skill

- Do not use for code, commit messages, PR descriptions, SQL, command output, or quoted errors; keep those exact and normal.
- Do not compress security warnings, privacy findings, Supabase RLS risks, financial formulas, migration steps, or destructive/remote action confirmations.
- Do not use when the user asks for teaching, clarification, architectural reasoning, or a full review.
- Do not override `AGENTS.md`, CulturaApp skills, or the user's requested output format.

## Inputs to inspect

- The user's requested mode or intensity.
- Current task type: chat answer, implementation update, review, GitHub workflow, SQL/data, frontend, or release verification.
- `AGENTS.md` if the compressed answer touches CulturaApp rules.
- Relevant specialized skill if the task is review, security, data/finance, frontend, testing, memory, or skill authoring.

## Procedure

1. Confirm activation from the user's wording or an explicit `/caveman` command.
2. Pick intensity:
   - `lite`: concise professional Spanish; full grammar; no filler.
   - `full`: default; fragments allowed; short sentences; technical terms unchanged.
   - `ultra`: terse status or answer only; abbreviations allowed for prose, never for code identifiers or exact terms.
3. Persist the selected mode during the current conversation until the user says `stop caveman`, `modo normal`, `normal mode`, or asks for more detail.
4. Keep UI and product wording in Spanish from Spain with tuteo when referencing CulturaApp.
5. Preserve all exact names: file paths, functions, hooks, routes, commands, table names, policy names, errors, and API names.
6. Use normal clarity temporarily for:
   - approvals for destructive, remote, credentialed, or irreversible commands;
   - security/privacy findings;
   - financial calculations and assumptions;
   - migration order;
   - multi-step instructions where omission could change order or meaning;
   - code review findings with file and line references.
7. Resume the selected concise mode after the clarity-sensitive section.

## Output format

Default pattern:

```text
Hecho: [resultado].
Clave: [dato técnico].
Siguiente: [acción si aplica].
```

For implementation updates:

```text
[Archivo/área] listo. [Cambio concreto]. Verifico con [comando/prueba].
```

For blockers:

```text
Bloqueo: [causa exacta].
Necesito: [dato/permiso].
```

For reviews, do not use the caveman output format. Use the relevant review skill format.

## Severity / priority model

- CRITICAL: compression hides data loss, secret exposure, unsafe command approval, RLS bypass, or wrong financial result.
- HIGH: compression changes technical meaning, command order, file path, route, table, or code identifier.
- MEDIUM: output becomes too vague to act on or omits verification status.
- LOW: answer is concise but stylistically awkward.

## Quality bar

- At least 50% shorter than the normal answer when safe.
- No filler, no generic reassurance, no duplicated context.
- Exact technical names remain exact.
- Safety-sensitive material switches back to normal clarity.
- Final answer still says what changed, where, and how it was verified when work was performed.

## Common mistakes to avoid

- Dropping articles inside code, SQL, CLI commands, or quoted output.
- Compressing review findings until file/line evidence disappears.
- Saying only "hecho" without changed files or verification.
- Using this skill to bypass the richer output required by GitHub, release, security, data/finance, frontend, or code review workflows.
- Applying the mode after the user asked for `normal mode`, `modo normal`, or a detailed explanation.

## Safety notes

This skill is instruction-only. It must not introduce scripts, dependencies, network calls, credentials, or external command execution. Any risky action still requires normal explicit confirmation and must follow the repository's sandbox and approval rules.

## Source

Adapted for CulturaApp from the public caveman skill concept:

```text
https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md
```
