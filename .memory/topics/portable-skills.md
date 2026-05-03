# Portable Skills Memory

## 2026-05-03 - Skills Use A Single Source With Claude Symlinks

- Context: Commit `f542ffa` added portable skills under `.agents/skills/`, `.agents/templates/portable-skill/SKILL.md`, and `.claude/skills/*` symlinks.
- Durable memory: `.agents/skills/<skill-name>/SKILL.md` is the canonical source; `.claude/skills/<skill-name>` should remain a relative symlink to `../../.agents/skills/<skill-name>`. Do not duplicate skill bodies into `.claude`.
- Source: `docs/agent-skills-strategy.md`; `README.md`; `TECHDOC.md`; `AGENTS.md`.

## 2026-05-03 - Current Portable Skill Set Has Seven Skills

- Context: Commit `37ff950` added `memory-protocol` after the first six review/authoring skills.
- Durable memory: the current set is `portable-skill-authoring`, `cultura-frontend-review`, `cultura-data-finance-review`, `cultura-security-privacy-review`, `cultura-testing-release-check`, `cultura-code-review`, and `memory-protocol`.
- Source: `find .agents/skills -mindepth 2 -maxdepth 2 -name SKILL.md`; commits `f542ffa` and `37ff950`.

## 2026-05-03 - Memory Is Local Markdown And Lower Priority Than Canonical Docs

- Context: Commit `37ff950` added `.memory/`, `docs/agent-memory.md`, and the `memory-protocol` skill.
- Durable memory: memory is for durable, small, auditable context; it must not store secrets and must never outrank current user instructions, `AGENTS.md`, source code, migrations, tests, or canonical docs.
- Source: `.agents/skills/memory-protocol/SKILL.md`; `docs/agent-memory.md`; `.memory/core.md`.
