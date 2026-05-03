# Agent Memory

CulturaApp now has a portable memory protocol for agents that need durable context across sessions. It is intentionally small, local, and inspectable:

- Real skill: `.agents/skills/memory-protocol/SKILL.md`
- Claude Code exposure: `.claude/skills/memory-protocol`
- Memory files: `.memory/`
- Supporting references: `.agents/skills/memory-protocol/references/`

## Why This Exists

Agents working on CulturaApp often need to remember stable preferences, decisions, gotchas, and project-area context that are too small for `AGENTS.md` but too useful to rediscover repeatedly.

The memory protocol keeps that knowledge in Markdown so it can be reviewed in diffs, edited by humans, and removed without touching a database or external service.

## Conceptual Inspiration

This approach is conceptually inspired by `hanfang/claude-memory-skill`, an MIT-licensed project that demonstrates a simple Markdown-based memory pattern for agents. The adapted CulturaApp version uses the same broad idea of hierarchical plain-text memory, but it does not copy the upstream skill text, install scripts, commands, or Claude-specific integration.

Source: https://github.com/hanfang/claude-memory-skill

## Design Principles

- Plain Markdown is the storage layer.
- No database, embeddings, semantic search, hidden cache, or external service.
- Memory is auditable through git.
- Humans can edit or delete memory directly.
- `AGENTS.md`, source code, migrations, tests, and current user instructions remain higher authority than memory.
- The skill is portable: Codex and Claude Code read the same `.agents/skills/memory-protocol` source, with Claude exposed by symlink.

## File Layout

```text
.memory/
  core.md
  me.md
  topics/
    README.md
  projects/
    README.md
```

`core.md` is the quick map. It should stay short and point to detailed files.

`me.md` stores durable collaboration preferences explicitly relevant to the repo.

`topics/` stores reusable cross-cutting memories, such as testing, forms, Supabase RLS, or agent workflows.

`projects/` stores app-area memories, such as calendar behavior, dashboard finance calculations, events, projects, or settings.

## How Agents Should Use It

1. Read `.memory/core.md` and `.memory/me.md` when memory may affect the task.
2. Follow only relevant pointers into `topics/` or `projects/`.
3. Use `rg` and explicit file names for lookup; do not rely on semantic search.
4. Save durable entries as dated `##` blocks.
5. Update `core.md` only when the memory map changes or a summary becomes stale.
6. Report which memory files influenced the task when that context matters.

## What Belongs In Memory

- Stable user collaboration preferences.
- Decisions that explain why the app works a certain way.
- Repeated pitfalls, especially around React Big Calendar, Supabase RLS, forms, and finance calculations.
- Links to issues, commits, files, or docs that future agents should find quickly.
- Brief summaries of resolved incidents when the lesson is reusable.

## What Does Not Belong In Memory

- Secrets, tokens, keys, passwords, cookies, or `.env.local` values.
- Raw customer or production data.
- Sensitive personal information.
- Temporary scratch notes for the current task.
- Canonical rules that should live in `AGENTS.md`.
- Test expectations that should live in tests.
- Product documentation that should live in `docs/` or `README.md`.

## Curation Rules

- Keep entries neutral and factual.
- Date detailed memories.
- Prefer one useful sentence over a long narrative.
- Remove stale or misleading entries when discovered.
- Ask before saving sensitive, personal, ambiguous, or surprising information.
- Honor explicit user requests to forget local memory.

## Compatibility

The source of truth is `.agents/skills/memory-protocol`. Claude Code gets the same skill through:

```bash
.claude/skills/memory-protocol -> ../../.agents/skills/memory-protocol
```

Do not duplicate the skill into `.claude/skills`. If a future tool cannot follow symlinks, treat any copy as temporary and document the compatibility issue.
