# Agent Memory

Cachés keeps a small, portable memory for durable project context:

- Storage: reviewed Markdown under `.memory/`, versioned in git.
- Routing source: `.memory/MEMORY.md`.
- Read workflow: `.agents/skills/memory-orient/SKILL.md`.
- Write workflow: `.agents/skills/memory-protocol/SKILL.md`.
- Runtime, private and session memory: outside `.memory/` or ignored by git.

## Model

The index maps task signals to active files. `pnpm memory:route -- "<task>"` normalizes case and accents, combines matching areas, and returns at most three files inside a 2,000-token estimate. A task without matches receives only `core.md`.

Memory remains lower authority than current user instructions, `AGENTS.md`, code, tests, migrations and canonical documentation. Product Brain remains the source for product planning, issues, releases and decisions.

## Content contract

Store only durable preferences, decisions and recurring gotchas. Keep one reusable fact per bullet or dated section and point to the canonical source instead of copying it.

For facts likely to change, use:

```md
- **namespace.key:** value. _(fuente: path-or-URL; verificado: YYYY-MM-DD[; revisar: YYYY-MM-DD])_
```

Replace a keyed fact in place when it changes. Do not retain the previous value in memory; git already provides history.

Do not store conversations, scratch notes, task progress, telemetry, branch or commit lists, production data, personal data, credentials or secrets.

## Structure

- `core.md`: fallback rules for generic tasks.
- `me.md`: durable collaboration preferences.
- `topics/`: reusable cross-cutting knowledge.
- `projects/`: app-area knowledge.
- Compatibility paths: explicitly marked `do_not_load_by_default` and never routed.

## Commands

```bash
pnpm memory:route -- "tarea"       # selected files, signals and estimated cost
pnpm memory:route -- "tarea" --json
pnpm memory:check                  # blocking structural validation
pnpm memory:check -- --json
pnpm memory:benchmark              # advisory report
pnpm memory:benchmark -- --strict  # enforce retrieval targets locally
```

`memory:check` validates routes, links, orphans, compatibility markers and volatile keys. `memory:benchmark` measures deterministic precision, coverage, file count and estimated tokens against fixed scenarios. It writes no history or generated memory files.

## Design references

The implementation adapts ideas rather than source text:

- relevance under a token budget: https://github.com/Aider-AI/aider/blob/main/aider/website/docs/repomap.md
- conditional routing metadata: https://github.com/continuedev/continue/blob/main/docs/customize/deep-dives/rules.mdx
- atomic memory observations: https://github.com/modelcontextprotocol/servers/blob/main/src/memory/README.md
- deterministic memory evaluation: https://github.com/AlekseiMarchenko/agent-memory-benchmark

The repository deliberately avoids load-all memory banks, embeddings, external stores and LLM-based judges.
