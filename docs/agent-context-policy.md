# Agent Context Loading Policy

This file is the canonical policy for how CulturaApp agents load context.
If another document conflicts with this policy about context loading, this policy wins for that topic.

This policy does not redefine Product Brain. Product Brain remains the canonical source for product, planning, issues, releases, and decisions. This file only regulates how agents decide what to read.

## Base Rule

> Read indexes first. Load detail only when task-relevant. Never load history by default. Prefer targeted sections/files over full-folder or full-file reads.

## Context Types

- Core: stable facts and critical rules that affect most tasks.
- Current state: what is active now, current focus, open risks, and active tasks.
- Decisions: accepted, proposed, obsolete, or replaced ADRs and durable choices.
- Reusable knowledge: patterns, gotchas, integrations, and recurring lessons.
- Tasks and issues: the concrete work item, acceptance criteria, scope, and verification.
- History and archive: closed issues, old plans, old prompts, logs, obsolete decisions, and long reference material.

## Canonical Sources

- Product Brain: `docs/project/` for product, planning, issues, releases, and decisions.
- Context loading: this file.
- Agent entry contract: `AGENTS.md`.
- Project memory: `.memory/`, versioned in git.

Runtime, private, or session memory must live outside `.memory/` or be ignored by git.

## Role Policy

### Planner

Read:
- This policy.
- `.memory/MEMORY.md`.
- `docs/project/DIGEST.md` or the current-state index.
- The active task or issue, if one exists.

Do not load by default:
- Full roadmap.
- Full backlog.
- Old releases.
- Closed issues.
- All knowledge notes.

### Implementer

Read:
- The active task or issue.
- The minimum role block or role prompt.
- Selective memory for the affected area.
- Directly related source files.

Do not load by default:
- Full roadmap.
- Full Product Brain.
- History.
- Closed issues.
- Unrelated docs.

### Reviewer

Read:
- The original task.
- The diff or changed files.
- Acceptance criteria.
- Critical technical rules for the touched area.
- Relevant memory for the touched area.

Do not load by default:
- All project memory.
- Old plans.
- Unrelated product notes.
- Full historical context.

### Docs/Memory Agent

Read:
- `.memory/MEMORY.md`.
- The relevant memory file or docs index.
- The canonical source before writing.
- The destination file before editing it.

Avoid:
- Duplicating existing knowledge.
- Turning closed issues into permanent memory unless they leave reusable learning.
- Storing operational history, logs, branch state, or commit lists as mandatory memory.

## Writing Rule

> Compact, clear and actionable. Never cryptic.

Mandatory context should use short bullets, stable labels, and references to detailed docs. Do not compress so much that the agent must guess.

Bad:

```md
RLS ok. Do not touch.
```

Good:

```md
Data security:
- RLS required on user-owned tables.
- Client never uses service role.
- Details: see Product Brain decisions.
```

## Size Budgets

These are maintenance targets, not hard build limits:

- `AGENTS.md`: 800-1,200 words.
- `CLAUDE.md`: 100-250 words.
- Agent role prompts: 300-700 words.
- Memory index files: 100-400 words.
- Detailed docs: no fixed limit, but never loaded by default.

## Token Metrics

Use `npm run context:metrics` before broad prompt, agent, memory, or workflow changes. It reports approximate prompt tokens using `chars / 4`; this is a cheap proxy, not provider billing.

Targets:

- Entry bundle (`AGENTS.md` + this policy + `.memory/MEMORY.md`): <= 5,000 estimated prompt tokens.
- Largest role prompt: <= 1,400 estimated prompt tokens.
- Largest portable skill: <= 2,400 estimated prompt tokens.

OpenCode runners write `promptMetrics` and prompt-only `costEstimate` to `.opencode/runs/*/metadata.json`. Treat those metrics as operational telemetry: keep them out of `.memory/`, use them to split oversized tasks, reduce agent count, narrow ownership, prefer `pb:orient`, or enable concise output when it is safe.

## Anti-Waste Rules

- Read indexes before detail.
- Prefer one relevant section over one full file.
- Prefer one relevant file over one full folder.
- Do not load archive, logs, closed issues, or old prompts by default.
- Do not repeat stable project context inside every issue.
- Do not duplicate global rules across multiple agent prompts.
- If extra context affects a decision, mention which file or section was used.
