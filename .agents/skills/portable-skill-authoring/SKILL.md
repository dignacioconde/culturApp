---
name: portable-skill-authoring
description: Create, review, or update portable Agent Skills for this repository. Use when the task mentions SKILL.md, Codex skills, Claude Code skills, .agents/skills, .claude/skills, skill templates, skill portability, skill catalogs, or avoiding duplicated agent instructions. Do not use for normal app feature work unless the requested output is a reusable skill workflow.
---

# Portable Skill Authoring

## Purpose

Create small, auditable, portable skills that work from `.agents/skills/<skill-name>/SKILL.md` and are exposed to Claude Code through `.claude/skills/<skill-name>` symlinks.

## When to use this skill

- The user asks to create, update, audit, or promote skills.
- The task is a repeatable workflow that can produce an actionable output.
- The workflow should be reusable by Codex, Claude Code, OpenCode, Cursor, Gemini CLI, or another SKILL.md-compatible agent.
- The current instructions are duplicated across tools and should become one maintained source.

## When not to use this skill

- The material is global project context, product domain knowledge, architecture reference, or long-form documentation better suited to `AGENTS.md`, `CLAUDE.md`, `README.md`, `TECHDOC.md`, or `docs/`.
- The request is a one-off prompt, a broad role persona, or a generic checklist with no clear trigger.
- The skill would need secrets, remote credentials, destructive commands, or unreviewed third-party scripts.

## Inputs to inspect

- `AGENTS.md` and `CLAUDE.md`.
- Existing `.agents/skills/`, `.claude/skills/`, `.opencode/agents/`, `.cursor/`, `.github/`, and `docs/` if present.
- Repo scripts in `package.json`.
- Existing repeated workflows in issue comments, agent prompts, review templates, and run logs.
- The portable template at `.agents/templates/portable-skill/SKILL.md`.

## Procedure

1. Classify the instruction: global rule, domain context, architecture rule, reusable workflow, quality check, or tool-specific operation.
2. Keep global rules in global docs. Only create a skill when the workflow has triggers, steps, a checklist, and an actionable output.
3. Choose a lowercase hyphenated name under 64 characters.
4. Write only `name` and `description` in YAML frontmatter. Make `description` trigger-friendly and include when not to use the skill.
5. Use the required section structure from the portable template.
6. Keep the skill instruction-only unless a script is clearly safer and more deterministic than prose.
7. Avoid copying external skill text. Extract patterns such as severity models, evidence requirements, and output shape.
8. Store the real skill in `.agents/skills/<skill-name>/SKILL.md`.
9. Expose it to Claude Code with a relative symlink from `.claude/skills/<skill-name>` to `../../.agents/skills/<skill-name>`.
10. Document why the skill exists in `docs/agent-skills-strategy.md` if the taxonomy or governance changes.

## Output format

Return:

- Decision: create, update, merge, split, or reject.
- Location: real path and symlink path.
- Trigger: example user requests that should activate it.
- Scope: what it covers and what remains global context.
- Safety notes: destructive actions, secrets, external tools, or remote systems avoided.
- Validation: format checks and symlink checks performed.

## Severity / priority model

- CRITICAL: skill can cause data exposure, unsafe tool execution, prompt injection, secret handling, or destructive actions.
- HIGH: skill duplicates global rules, conflicts with `AGENTS.md`, or gives misleading workflow steps.
- MEDIUM: trigger is vague, output is not actionable, or scope overlaps another skill.
- LOW: wording, examples, naming, or maintenance polish.

## Quality bar

- One clear job per skill.
- Triggerable by concrete user language.
- Less than 500 lines unless there is a strong reason.
- No secrets, absolute private paths, or unreviewed external commands.
- Clear input list, procedure, output format, severity model, and safety notes.
- Compatible with both Codex and Claude Code discovery paths.

## Common mistakes to avoid

- Turning `AGENTS.md` into many tiny skills.
- Creating broad roles such as "expert developer" instead of workflows.
- Copying third-party checklists wholesale.
- Adding scripts before proving prose is insufficient.
- Forgetting the `.claude/skills` symlink.
- Letting a template under `.agents/skills` become a discoverable fake skill.

## Safety notes

Do not include credentials, `.env.local` values, service role keys, private user data, or commands that mutate remote systems. Any destructive local action, force push, irreversible migration, bulk delete, or secret rotation needs explicit user confirmation outside the skill.
