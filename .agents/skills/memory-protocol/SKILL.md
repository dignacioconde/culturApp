---
name: memory-protocol
description: Curate, recall, migrate, or forget durable project context in Markdown under .memory/. Use for explicit memory operations and durable task learnings; do not use for secrets, session notes, canonical product docs, issues, logs, or generated telemetry.
---

# Memory Protocol

## Purpose

Maintain small, auditable and git-versioned project memory. `.memory/` stores only durable context; private, runtime and session memory stays outside it or ignored by git.

## When to use this skill

- The user asks to remember, recall, inspect, curate, migrate or forget project memory.
- A completed task produced a reusable preference, decision or gotcha.
- `.memory/` needs structural or privacy cleanup.

## When not to use this skill

- Never store secrets, credentials, private customer data or `.env.local` values.
- Do not save temporary task state, conversations, logs, branches, commits or benchmark output.
- Do not duplicate rules better expressed in `AGENTS.md`, code, tests, Product Brain or canonical docs.
- Use `memory-orient` for a read-only task briefing and `compact-memory` for broad consolidation.

## Inputs to inspect

- `.memory/MEMORY.md`.
- The destination selected by the index or `pnpm memory:route`.
- The canonical source for any fact being saved.
- `docs/agent-memory.md` when changing the protocol itself.

## Procedure

1. Read the index first. For recall, run `pnpm memory:route -- "<task>" --json` and open only its destinations.
2. Before writing, classify the item: preference in `me.md`, reusable pattern in `topics/`, app-area lesson in `projects/`, or canonical documentation outside memory.
3. Store one durable fact, decision, preference or gotcha per bullet or dated section. Remove redundant context and narrative.
4. For volatile facts use exactly: `- **namespace.key:** value. _(fuente: path-or-URL; verificado: YYYY-MM-DD[; revisar: YYYY-MM-DD])_`.
5. When a volatile fact changes, replace the existing keyed line. Do not keep the old value in `.memory/`; git preserves history.
6. Update `.memory/MEMORY.md` only when adding, removing or rerouting an active file. Never add a second routing table.
7. For compatibility-only paths, use the standard `memory_status: compatibility_stub · load_policy: do_not_load_by_default` notice and point to the current source.
8. When forgetting, remove the fact and clean its route or pointer. Do not delete broad files unless explicitly requested.
9. Run `pnpm memory:check` and, after routing changes, `pnpm memory:benchmark -- --strict`.

## Output format

For reads, report files used, relevant facts and gaps. For writes, report files changed, the durable facts added or replaced, and confirm that no secrets or sensitive data were stored. For deletion, report what was removed and which pointers remain.

## Priority model

- CRITICAL: secret, credential, regulated data or hidden profiling.
- HIGH: memory conflicts with current instructions, code, tests or canonical sources.
- MEDIUM: duplicated, stale, unrouted or overly narrative memory.
- LOW: naming, formatting, link or wording issue.

## Quality bar

- Plain Markdown, human-readable and reviewable in git.
- One routing source and no generated memory artifacts.
- Atomic facts with provenance only where volatility warrants it.
- No external database, embedding index, hidden cache or service.
- Current user instructions and canonical sources always win.

## Common mistakes to avoid

- Treating memory as an append-only log.
- Loading every memory file before deciding what matters.
- Adding metadata to stable rules that do not need it.
- Retaining replaced facts, stale counts or operational snapshots.
- Copying third-party skill text or scripts into the repository.

## Safety notes

Ask before persisting sensitive, personal, ambiguous or surprising information. This protocol must not mutate remote systems. Attribute external inspiration in documentation and do not copy third-party material verbatim.

## Product Brain v2 Contract

When Product Brain is relevant, orient with `pnpm pb:orient -- --json` and use flat v2 frontmatter. Memory must not replace issues, releases, decisions or generated Product Brain indexes.
