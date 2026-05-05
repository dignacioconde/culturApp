---
id: ADR-0013
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0013
tags:
  - product-brain
  - adr
  - testing
---

# ADR-0013 — Testing quirurgico para beta privada

## Contexto

La app tenia lint y build, pero no tests automaticos para los riesgos de confianza: horas, decimales y cobros.

## Decision

Usar Vitest para logica pura, Playwright para humo e2e y pgTAP/Supabase CLI para RLS cuando las migraciones versionadas esten listas.

La cobertura objetivo es quirurgica: proteger flujos que si fallan destruyen confianza, no perseguir 100% coverage.

## Consecuencias

- `npm run test` corre la suite en proyectos `utc` y `madrid`.
- `npm run test:e2e` existe con un flujo humo `.skip` hasta tener seed/auth e2e.
- `npm run test:db` queda preparado para Supabase CLI.

## Relacionado

- [[../issues/CACH-B0014|CACH-B0014]]
- [[../issues/CACH-B0016|CACH-B0016]]
