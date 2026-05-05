---
id: ADR-0010
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0010
tags:
  - product-brain
  - adr
  - frontmatter
---

# ADR-0010 — Frontmatter validado con Zod

## Contexto

El brain tenia frontmatter util, pero `release` aceptaba strings libres y el validador no detectaba incoherencias de dominio. Eso permitia que una issue dijera `Beta` mientras la release real usaba otro identificador.

## Decision

El schema autoritativo vive en `scripts/brain/schema.mjs` y se valida con Zod desde `npm run pb:check`.

Las issues usan frontmatter explicito: `id`, `title`, `type`, `status`, `cycle`, `release`, `priority`, `estimate`, `area`, `created_at` y `updated_at`.

## Consecuencias

- `pb:check` falla ante releases libres como `Unassigned`, `Beta`, `Internal`, `Pro`, `Growth`, `Post-MVP` o `0.1-cycle`.
- Cada issue con `release` debe estar en el `## Scope` de esa release, y viceversa.
- Las plantillas pasan a ser mas estrictas, pero el coste de crear issues sigue siendo bajo.

## Relacionado

- [[../process/frontmatter-schema|frontmatter-schema]]
- [[../issues/CACH-B0016|CACH-B0016]]
