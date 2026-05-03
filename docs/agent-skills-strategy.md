# Agent Skills Strategy

This repo uses one real source for portable skills:

- Codex source: `.agents/skills/<skill-name>/SKILL.md`
- Claude Code exposure: `.claude/skills/<skill-name>` symlinked to `../../.agents/skills/<skill-name>`
- Template source: `.agents/templates/portable-skill/SKILL.md`

Do not copy the same skill into both `.agents` and `.claude`. If a tool cannot follow project-relative symlinks, copy only as a temporary compatibility workaround and open a follow-up task to remove the duplication.

## What Belongs Where

| Material | Home |
| --- | --- |
| Project identity, domain model, stack, routing, Supabase schema, global rules | `AGENTS.md` and mirrored `CLAUDE.md` |
| Human setup, Supabase bootstrap, app overview | `README.md` |
| State of implementation, file inventory, operational notes | `TECHDOC.md` |
| Repeatable workflows with triggers, procedure, output, severity, and quality bar | `.agents/skills/<skill-name>/SKILL.md` |
| Portable skill skeleton | `.agents/templates/portable-skill/SKILL.md` |
| OpenCode-specific dispatcher and subagent behavior | `.opencode/agents/**` |

## Initial Skill Set

| Skill | Use |
| --- | --- |
| `portable-skill-authoring` | Create, update, review, or promote portable skills. |
| `cultura-frontend-review` | UI, forms, calendars, responsive, accessibility, and frontend performance. |
| `cultura-data-finance-review` | Supabase hooks, RLS, project/event model, and financial calculations. |
| `cultura-security-privacy-review` | Auth, RLS, secrets, privacy, dependency risk, and agent skill safety. |
| `cultura-testing-release-check` | Lint/build, smoke tests, regression matrices, Vercel readiness. |
| `cultura-code-review` | Cross-cutting code review of diffs, PRs, architecture, risk, and maintainability. |
| `memory-protocol` | File-based Markdown memory for durable agent context, recall, curation, and forgetting. |
| `caveman` | Ultra-concise communication mode adapted for CulturaApp, with safety fallbacks for reviews, data, finance, RLS, and irreversible actions. |

This is intentionally small. Add a new skill only when a workflow repeats and cannot be captured by one of these without becoming vague.

## Change Summary

Current portable-skill setup:

- Created `.agents/skills/` as the canonical project skill source.
- Created `.claude/skills/` symlinks so Claude Code can use the same skill folders.
- Created `.agents/templates/portable-skill/SKILL.md` as the required template for future skills.
- Added a short pointer in `AGENTS.md` and mirrored it in `CLAUDE.md`.
- Documented the user-facing overview in `README.md`.
- Documented the technical inventory and validation status in `TECHDOC.md`.
- Added `memory-protocol` as a portable Markdown memory workflow with `.memory/` as the auditable local store.

No third-party skill text, scripts, dependencies, or external scanner code were imported.

## How To Use From Codex

Ask naturally with a trigger such as:

- "Usa la skill `cultura-security-privacy-review` para revisar este cambio."
- "Crea una skill portable para este workflow."
- "Haz una code review de este diff."

Codex should discover project skills from `.agents/skills/`. If a skill is newly added and not visible in the current session, restart Codex.

## How To Use From Claude Code

Claude Code should discover the same skills from `.claude/skills/`. Each entry there should be a symlink to `.agents/skills/<skill-name>`.

Useful checks:

```bash
find .claude/skills -maxdepth 1 -type l -print
readlink .claude/skills/cultura-code-review
```

Expected target form:

```text
../../.agents/skills/<skill-name>
```

## Adding Or Updating A Skill

1. Use `portable-skill-authoring`.
2. Start from `.agents/templates/portable-skill/SKILL.md`.
3. Keep frontmatter to `name` and `description`.
4. Put the real skill in `.agents/skills/<skill-name>/SKILL.md`.
5. Create or update the Claude symlink:

```bash
ln -s ../../.agents/skills/<skill-name> .claude/skills/<skill-name>
```

6. Run a local structure check:

```bash
find .agents/skills -mindepth 2 -maxdepth 2 -name SKILL.md -print | sort
find .claude/skills -maxdepth 1 -type l -print | sort
```

7. Update this document only if the taxonomy, governance, or skill list changes.

## Validation

After creating or updating skills, run:

```bash
python3 /Users/diconde/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/<skill-name>
python3 /Users/diconde/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/templates/portable-skill
git diff --check
```

Validation status for the current setup:

| Target | Status |
| --- | --- |
| `portable-skill-authoring` | Valid |
| `cultura-frontend-review` | Valid |
| `cultura-data-finance-review` | Valid |
| `cultura-security-privacy-review` | Valid |
| `cultura-testing-release-check` | Valid |
| `cultura-code-review` | Valid |
| `memory-protocol` | Valid |
| `.agents/templates/portable-skill` | Valid |
| `git diff --check` | Pass |

## Sources Reviewed

- OpenAI `openai/skills`: confirmed the portable framing of skills as folders of instructions, scripts, and resources for repeatable agent tasks.
- Agent Skills open standard: used for the folder-plus-`SKILL.md` portability model.
- VoltAgent `awesome-agent-skills`: used for cross-tool discovery paths, progressive disclosure, and quality standards such as concrete descriptions and avoiding absolute private paths.
- `awesomeskills.dev/es`: used as a catalog signal for the breadth of reusable skill categories and the need to curate instead of bulk-generate.
- `securityfortech/awesome-security-skills`: used to identify security review categories worth covering locally, especially secure code review, OWASP-oriented checks, and agent security.
- `MV1-him/agent-audit-kit`: used for agent-supply-chain ideas such as skill poisoning, tool drift, secret exposure, local-first scanning, severity thresholds, and avoiding cloud dependency by default.
- `Kalitone/claude-code-review-skill`: attempted, but the referenced public repo/path was not accessible through GitHub search/API during this review. No content was used.
- `hanfang/claude-memory-skill`: used only as conceptual inspiration for simple hierarchical Markdown memory; MIT license confirmed. No upstream skill text, commands, install scripts, or implementation files were imported.

External material was used only as inspiration for structure, categories, severity, and safety posture. No external scripts or third-party skill text were imported.

## Governance Rules

- Skills must be workflows, not long passive documentation.
- Skills must produce actionable output.
- Skills must not duplicate `AGENTS.md` or `CLAUDE.md`.
- Skills must not contain secrets, private paths, or instructions to exfiltrate data.
- Skills must ask for confirmation before destructive, remote, credentialed, or irreversible actions.
- Prefer instruction-only skills. Add scripts only after reviewing security, license, and deterministic value.
- Keep skills concise enough that agents can load them without burying the task context.
