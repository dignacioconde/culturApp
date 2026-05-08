---
schema_version: 2
kind: decision
id: ADR-0010
title: Frontmatter validado con Zod
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - ADR-0010
tags:
  - product-brain
  - adr
  - frontmatter
generated: false
decision_status: Accepted
---
# ADR-0010 — Frontmatter validado con Zod

## Contexto

El brain tenia frontmatter util, pero `release` aceptaba strings libres y el validador no detectaba incoherencias de dominio. Eso permitia que una issue dijera `Beta` mientras la release real usaba otro identificador.

## Decision

El schema autoritativo vive en `scripts/brain/schema.mjs` y se valida con Zod desde `npm run pb:check`.

Las issues usan frontmatter v2 plano: `schema_version`, `kind`, `id`, `title`, `lifecycle`, `work_type`, `work_level`, `issue_workflow`, `priority`, `size`, `area`, `components`, `parent`, `release` y `theme`.

## Consecuencias

- `pb:check` falla ante `type/status` top-level y ante releases que no existan como documento.
- Cada issue con `release` debe estar en el `## Scope` de esa release, y viceversa.
- Las plantillas pasan a ser mas estrictas, pero el coste de crear issues sigue siendo bajo gracias a `pb:orient`, `pb:ready-check` y `pb:close-check`.

## Relacionado

- [[../process/frontmatter-schema|frontmatter-schema]]
- [[../issues/CACH-B0016|CACH-B0016]]
