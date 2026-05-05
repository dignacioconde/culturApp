---
id: CACH-B0016
title: Refundacion operativa del Product Brain y tests B0014
type: chore
status: done
cycle: beta-1
release: RELEASE-0.1.0-beta.1
priority: p1
estimate: m
area: brain
created_at: 2026-05-05
updated_at: 2026-05-05
aliases:
  - CACH-B0016
tags:
  - product-brain
  - issue
  - testing
  - hardening
adr:
  - ADR-0009
  - ADR-0010
  - ADR-0011
  - ADR-0012
  - ADR-0013
  - ADR-0014
related:
  - CACH-B0014
---

# CACH-B0016 — Refundacion operativa del Product Brain y tests B0014

## Summary

Aplicar la investigacion de refundacion operativa del Product Brain: frontmatter validado, coherencia issue-release, tablero reducido, captura barata, indices generados y tests quirurgicos para los riesgos de CACH-B0014.

## Context

El brain ya era la fuente de verdad, pero no fallaba ante varias incoherencias reales: releases como strings libres, tablero sobredimensionado, validacion incompleta y cero tests automaticos para timezone, importes con coma y coherencia de cobros.

## Scope

- Definir schema Zod para issues, ADRs, releases y feedback.
- Reescribir `pb:check` para validar frontmatter, wikilinks, indices, release scope y tablero.
- Aniadir `pb:index` y reemplazar `pb:capture` por captura directa a inbox con segundos y slug.
- Reducir `BACKLOG.md` a 5 columnas.
- Documentar politicas de IDs, frontmatter, timestamps, decimales, testing y feedback.
- Aniadir helpers y tests para decimales, datetime Madrid/UTC y `paid_date`.
- Preparar tabla `feedback` con RLS de consentimiento y el snippet comentado de Plausible.

## Acceptance Criteria

- [x] `pb:check` valida coherencia issue-release y tablero.
- [x] No quedan `release: Unassigned`, `release: Beta` ni otros strings libres en issues.
- [x] Los tests unitarios cubren decimal, datetime y payment en workspace UTC y Madrid.
- [x] Playwright tiene un flujo humo documentado y omitido hasta que haya seed/auth e2e.
- [x] Supabase tiene migracion de `feedback` con RLS por consentimiento.
- [x] Los ADRs nuevos enlazan las decisiones duraderas.

## Validation

- `npm run test`
- `npm run test:e2e`
- `npm run pb:check`
- `npm run lint`
- `npm run build`

## Result

Implementado como trabajo directo por peticion del usuario, saltando la curaduria previa del inbox.
