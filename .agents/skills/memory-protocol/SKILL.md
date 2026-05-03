---
name: memory-protocol
description: Use when the user asks agents to remember, recall, inspect, curate, migrate, or forget durable project context in Markdown under .memory/. Do not use for secrets, credentials, temporary task notes, or facts better kept in AGENTS.md, docs, code comments, issues, or tests.
---

# Memory Protocol

## Purpose

Maintain a small, auditable file-based memory for CulturaApp agents. The protocol stores durable context in plain Markdown under `.memory/`, with short summaries in `core.md`, user preferences in `me.md`, and detailed entries in `topics/` or `projects/`.

The goal is practical continuity across Codex, Claude Code, OpenCode, and other agents without databases, embeddings, semantic search, hidden state, or external services.

## When to use this skill

- Use when the user says "recuerda", "guarda en memoria", "apunta", "forget", "olvida", "recall", "busca en memoria", "actualiza la memoria", or "memory".
- Use when starting a task that may depend on durable project decisions, user preferences, previous tradeoffs, or known gotchas.
- Use when a completed task produces reusable context that would help future agents avoid rediscovery.
- Use when reviewing or cleaning `.memory/**`.

## When not to use this skill

- Do not use for secrets, tokens, Supabase keys, passwords, private customer data, or `.env.local` values.
- Do not use for short-lived task state that belongs in the current conversation, a TODO, an issue, or a PR comment.
- Do not use to replace `AGENTS.md`, `CLAUDE.md`, tests, migrations, source docs, or architecture decisions that should be canonical elsewhere.
- Do not use for hidden profiling, sensitive personal data, or anything the user has not reasonably agreed to persist.

## Inputs to inspect

- `.memory/core.md`
- `.memory/me.md`
- `.memory/topics/README.md`
- `.memory/projects/README.md`
- Relevant `.memory/topics/*.md` or `.memory/projects/*.md`
- `AGENTS.md` and `docs/agent-memory.md` when changing the protocol itself
- Current task context, diff, issue, PR, or user instruction that triggered memory work

## Procedure

1. Read `.memory/core.md` and `.memory/me.md` before using memory for a task. If either file is missing, report it and offer to recreate the baseline from `docs/agent-memory.md`.
2. Follow links or bullets in `core.md` to the smallest relevant topic or project file. Use deterministic lookup with file names and `rg`; do not invent semantic search.
3. Treat `core.md` as a map, not a dumping ground. Keep it concise: summaries, pointers, and the few details that should be visible at a glance.
4. Store detailed memories as dated `##` entries in topic or project files. One entry should capture one durable fact, decision, preference, caveat, or resolved gotcha.
5. Before writing, classify the memory:
   - User preference or durable personal working style: `.memory/me.md`
   - Cross-project concept or recurring pattern: `.memory/topics/<topic>.md`
   - CulturaApp-specific project decision or incident: `.memory/projects/<project-or-area>.md`
   - Broad project rule or source of truth: update the canonical doc instead of memory.
6. Ask before persisting sensitive, personal, ambiguous, or potentially embarrassing information. When the user explicitly says to remember or save a fact, that is enough confirmation for ordinary non-sensitive context.
7. When adding or updating a detailed memory, update `.memory/core.md` only if the new information changes the map, adds a new file, or alters a high-signal summary.
8. When forgetting, remove or edit the relevant entry and clean stale pointers in `core.md`. Do not delete broad files unless the user explicitly asks.
9. If the host supports background agents and the user has explicitly authorized delegation, memory curation may be delegated. Otherwise do it directly and keep the main task moving.
10. Validate Markdown readability, relative links, and privacy before finishing.

## Output format

For memory reads:

- Memory used: files inspected and the few facts that influenced the task.
- Gaps: missing, stale, or conflicting memory.

For memory writes:

- Memory updated: files changed.
- Added/changed: one-line summary of each durable fact.
- Safety check: confirm no secrets or sensitive data were stored.

For forget requests:

- Memory removed: files and entries affected.
- Remaining pointers: any related context intentionally kept.

## Priority model

- CRITICAL: secret, credential, private key, token, regulated personal data, or instruction to hide memory from the user.
- HIGH: stale memory contradicts `AGENTS.md`, source code, schema, tests, or current user instruction.
- MEDIUM: memory is useful but too vague, duplicated, uncategorized, or missing a pointer from `core.md`.
- LOW: naming, formatting, broken relative links, or wording polish.

## Quality bar

- Plain Markdown only.
- Human-readable, human-editable, and reviewable in git.
- Every detailed memory has a topic or project home.
- `core.md` stays short enough to scan quickly.
- No external service, database, embedding index, hidden cache, or generated binary artifact is required.
- Memory never outranks current user instructions, `AGENTS.md`, source code, database migrations, or tests.

## Common mistakes to avoid

- Treating `.memory/core.md` as an append-only log.
- Saving secrets, `.env.local` contents, or private user data.
- Persisting guesses as facts.
- Writing vague entries like "fixed calendar bug" without date, area, and durable lesson.
- Creating many overlapping topic files with near-identical scope.
- Copying third-party skill text or install scripts into this repo.
- Making the protocol Claude-only; this skill must remain portable.

## Safety notes

This protocol is local-first and file-based. It must not call external services, create embeddings, install packages, or mutate remote systems. Deleting memory, rewriting large sections, or persisting sensitive personal information requires explicit user confirmation. Attribute external inspiration in documentation and do not copy third-party content verbatim.
