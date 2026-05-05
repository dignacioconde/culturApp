---
id: ADR-0011
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0011
tags:
  - product-brain
  - adr
  - datetime
---

# ADR-0011 — Timestamps como instantes y Europe/Madrid en cliente

## Contexto

CACH-B0014 detecto riesgo de drift horario al convertir valores `YYYY-MM-DDTHH:mm` de formularios a `timestamptz` en Supabase.

## Decision

Los campos que representan instantes se tratan como UTC en persistencia y como hora local en UI. El helper `src/lib/datetime.ts` convierte entre input local y `Date` usando `Europe/Madrid` por defecto.

Para cambios horarios:

- Una hora inexistente de primavera se normaliza al siguiente instante valido.
- Una hora ambigua de otono elige la primera ocurrencia.

## Consecuencias

- Se evita `toISOString().slice(0, 16)` para inputs locales.
- Los tests corren en UTC y Madrid para detectar drift entre CI y maquina local.
- Si mas adelante hay eventos en multiples husos, habra que guardar zona por evento.

## Relacionado

- [[../issues/CACH-B0014|CACH-B0014]]
- [[../issues/CACH-B0016|CACH-B0016]]
