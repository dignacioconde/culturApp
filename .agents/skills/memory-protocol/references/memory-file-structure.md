# Memory File Structure

This reference defines the repository-local memory layout used by `memory-protocol`.

```text
.memory/
  core.md
  me.md
  topics/
    README.md
    <topic>.md
  projects/
    README.md
    <area-or-project>.md
```

## `core.md`

Use `core.md` as the memory map. It should contain:

- Short summaries that help an agent orient quickly.
- Pointers to detailed topic or project files.
- Known areas where memory exists.
- Very small warnings that future agents should see before doing related work.

Do not use `core.md` as a chronological journal. If a section grows past a few bullets, move details into `topics/` or `projects/` and keep a pointer.

Recommended shape:

```markdown
# Core Memory

## Active Map

- Frontend forms: custom selectors and date controls matter. See [topics/forms.md](topics/forms.md).
- Calendar layout: React Big Calendar height is fragile. See [projects/calendar.md](projects/calendar.md).

## Maintenance

- Last curated: YYYY-MM-DD
- Memory protocol: see [docs/agent-memory.md](../docs/agent-memory.md)
```

## `me.md`

Use `me.md` for durable user preferences that affect collaboration:

- Communication style.
- Review preferences.
- Product or design taste that the user has explicitly shared.
- Stable operating preferences for this repo.

Do not store sensitive personal data, private life details, credentials, or inferred traits.

## `topics/`

Use topic files for cross-cutting knowledge:

- `forms.md`
- `testing.md`
- `deployment.md`
- `agent-workflows.md`
- `supabase-rls.md`

Each durable memory should be one dated `##` block:

```markdown
## YYYY-MM-DD - Short title

- Context: what happened or what was decided.
- Durable memory: the reusable lesson.
- Source: issue, PR, commit, conversation, or file path when available.
```

## `projects/`

Use project files for CulturaApp-specific areas, features, or incidents:

- `calendar.md`
- `dashboard-finance.md`
- `events.md`
- `projects.md`
- `settings.md`

Prefer project files when the memory is tied to an app route, feature area, schema path, or production issue.

## Naming

- Use lowercase kebab-case file names.
- Keep names stable and boring.
- Prefer one existing file over creating a near-duplicate.
- Rename only when the old name is misleading, and update pointers in `core.md`.

## Linking

- Links from `.memory/core.md` to memory files should be relative to `.memory/`.
- Links from docs to memory should be relative to the doc location.
- If a target file does not exist yet, create it with a short title and first dated entry.
