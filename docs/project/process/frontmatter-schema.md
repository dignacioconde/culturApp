---
id: PB-FRONTMATTER-SCHEMA
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Frontmatter schema
tags:
  - product-brain
  - process
  - schema
---

# Frontmatter schema

## Issues

```yaml
id: CACH-0017
title: Titulo claro
type: bug | feature | chore | spike | doc
status: inbox | backlog | ready | in-progress | review | done | blocked | wontfix
cycle: beta-1 | beta-2 | rc | ga | unassigned
release: RELEASE-0.1.0-beta.2 | null
priority: p0 | p1 | p2 | p3
estimate: xs | s | m | l
area: frontend | backend | db | docs | infra | brain
created_at: 2026-05-05
updated_at: 2026-05-05
```

## Reglas

- `release` debe ser `null` o coincidir con un archivo de `docs/project/releases/`.
- Si una issue tiene `release`, debe aparecer en el `## Scope` de esa release.
- Si una release lista una issue en `## Scope`, la issue debe apuntar a esa release.
- `estimate: l` no entra en ciclos beta; se parte antes.
- No usar strings libres como `Unassigned`, `Beta`, `Internal`, `Pro`, `Growth`, `Post-MVP` o `0.1-cycle`.

## Relacionado

- [[../decisions/ADR-0010-frontmatter-schema|ADR-0010]]
