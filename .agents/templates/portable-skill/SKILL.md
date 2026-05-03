---
name: skill-name
description: Clear description of when this skill should be used. Mention specific triggers and when not to use it.
---

# Skill Title

## Purpose

State the concrete job this skill performs in one or two short paragraphs.

## When to use this skill

- Use when the user request matches a repeatable workflow with a clear output.
- Include concrete trigger words, file paths, tools, domains, or symptoms.

## When not to use this skill

- Do not use for global project context or passive reference material.
- Do not use when another skill has narrower ownership.
- Do not use when the workflow requires unsafe actions without confirmation.

## Inputs to inspect

- List the files, commands, docs, diffs, screenshots, or logs the agent should inspect first.
- Prefer relative repo paths.
- Do not include private machine-specific paths or secrets.

## Procedure

1. Describe the workflow in ordered, verifiable steps.
2. Keep steps procedural, not motivational.
3. Include validation and fallback behavior.
4. Make destructive, remote, or credentialed operations opt-in only.

## Output format

Define the exact shape of the final answer: findings, checklist, patch summary, commands run, risks, or next actions.

## Severity / priority model

- CRITICAL:
- HIGH:
- MEDIUM:
- LOW:

Adapt labels if the skill is not a review/audit skill, but keep the prioritization explicit.

## Quality bar

- State what "done well" means.
- Include the minimum verification required.
- Keep the skill concise and auditable.

## Common mistakes to avoid

- List common failure modes.
- Include scope boundaries and anti-patterns.

## Safety notes

State secrets, privacy, destructive command, external service, licensing, and remote-system constraints. Require explicit confirmation for risky actions.
