---
schema_version: 2
kind: process
id: PB-FRONTMATTER-SCHEMA
title: Frontmatter schema
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Frontmatter schema
tags:
  - product-brain
  - process
  - schema
generated: false
---
# Frontmatter schema

## Issues

```yaml
schema_version: 2
kind: issue
id: CACH-0017
title: Titulo claro
lifecycle: active
created: 2026-05-05
updated: 2026-05-08
aliases:
  - CACH-0017
tags:
  - product-brain
  - issue
generated: false
work_type: bug | feature | chore | spike | doc
work_level: initiative | slice | task
issue_workflow: inbox | backlog | ready | in_progress | review | blocked | done | wont_fix
priority: p0 | p1 | p2 | p3
size: xs | s | m
area: frontend | data | backend | infra | docs | brain | security
components:
  - dashboard
parent: CACH-B0002 | null
related: []
depends_on: []
blocked_by: []
adr: []
release: RELEASE-0.1.0-beta.2 | null
theme: beta-trust | core-work-ux | finance-operations | portability-onboarding | pro-growth | internal-agent-ops | null
```

## Reglas

- `release` debe ser `null` o coincidir con un archivo de `docs/project/releases/`.
- Si una issue tiene `release`, debe aparecer en el `## Scope` de esa release.
- Si una release lista una issue en `## Scope`, la issue debe apuntar a esa release.
- `work_level: initiative` nunca pasa a `ready`; se parte en `slice`.
- `size` solo permite `xs`, `s` o `m`; si parece grande, se divide.
- `parent` expresa jerarquia y debe apuntar a una initiative existente; `related` queda para relaciones laterales.
- No usar `type/status` top-level en Product Brain v2.

## Relacionado

- [[../decisions/ADR-0010-frontmatter-schema|ADR-0010]]
