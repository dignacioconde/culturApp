---
schema_version: 2
kind: decision
id: ADR-0014
title: Beta feedback propio y Plausible comentado
lifecycle: active
created: '2026-05-05'
updated: '2026-05-11'
aliases:
  - ADR-0014
tags:
  - product-brain
  - adr
  - feedback
generated: false
decision_status: Superseded
---
# ADR-0014 — Beta feedback propio y Plausible comentado

## Decision status

Superseded por [[ADR-0015-feedback-simple-posthog-futuro|ADR-0015]].

## Contexto

La beta privada necesita senales reales sin meter friccion RGPD ni herramientas de analitica demasiado grandes para una persona.

## Decision

Preparar una tabla `feedback` propia en Supabase con RLS de insercion por consentimiento explicito. Dejar Plausible comentado en `index.html` para activarlo cuando empiece la beta privada.

No se anade PostHog en esta fase.

## Consecuencias

- El feedback cualitativo puede entrar por widget futuro sin exponer lectura a usuarios.
- La analitica queda aplazada hasta activacion consciente.
- Cualquier UI de feedback debe enviar `consent_given = true`.

## Relacionado

- [[../issues/CACH-B0016|CACH-B0016]]
- [[ADR-0015-feedback-simple-posthog-futuro|ADR-0015]]
