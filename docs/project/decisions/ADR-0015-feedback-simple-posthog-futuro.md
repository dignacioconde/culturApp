---
schema_version: 2
kind: decision
id: ADR-0015
title: Feedback simple propio y PostHog diferido
lifecycle: active
created: '2026-05-11'
updated: '2026-05-11'
aliases:
  - ADR-0015
tags:
  - product-brain
  - adr
  - feedback
  - privacy
  - analytics
generated: false
decision_status: Accepted
---
# ADR-0015 — Feedback simple propio y PostHog diferido

## Decision status

Accepted

## Contexto

La beta necesita una via inmediata para recibir feedback cualitativo sin introducir una herramienta externa de analitica ni aumentar la superficie RGPD antes de validar el uso real.

PostHog puede ser mejor cuando Cachés necesite funnels, cohorts, surveys gestionadas o paneles de producto, pero ahora el objetivo es capturar comentarios concretos con coste y mantenimiento minimos.

## Decision

Implementar en `RELEASE-0.1.0-beta.17` un formulario simple de feedback propio que escribe en la tabla `feedback` de Supabase.

No se anade PostHog, Plausible, `usage_events`, autocapture, heatmaps, session replay ni dashboards de metricas en esta release.

Si mas adelante hace falta analitica de producto, se abrira una ADR nueva para PostHog con region UE, consentimiento explicito, autocapture desactivado y eventos manuales allowlist.

## Consecuencias

- El feedback vive en la base de datos actual y no sale a un proveedor externo.
- La UI puede recoger senales cualitativas sin crear una capa de analitica prematura.
- El equipo pierde por ahora funnels, surveys administradas y paneles no tecnicos.
- La migracion a PostHog sigue abierta, pero exigira decision, configuracion de privacidad y scope propio.

## Alternativas consideradas

- PostHog ahora: mas potente para producto, pero introduce proveedor externo y decisiones de privacidad antes de necesitarlas.
- Supabase `usage_events`: mantiene todo en casa, pero crea trabajo de analitica que no hace falta para este corte.
- Plausible: queda descartado para esta necesidad porque el usuario pide evitarlo y no resuelve feedback cualitativo.

## Fecha

2026-05-11

## Relacionado con

- [[../releases/RELEASE-0.1.0-beta.17|RELEASE-0.1.0-beta.17]]
- [[../issues/CACH-0052|CACH-0052]]
- [[ADR-0014-analytics-feedback|ADR-0014]]
