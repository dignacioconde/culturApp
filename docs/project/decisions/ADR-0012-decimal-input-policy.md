---
id: ADR-0012
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0012
tags:
  - product-brain
  - adr
  - finance
---

# ADR-0012 — Decimales europeos con input text e inputmode decimal

## Contexto

El contexto de Cachés es España. Los importes con coma decimal deben ser fiables, y `input type="number"` no es una base consistente para copiar, pegar ni usar coma.

## Decision

Los importes deben capturarse como texto con `inputmode="decimal"` y normalizarse con `parseDecimal()`.

`parseDecimal()` acepta coma decimal espanola, millares espanoles y pegado simple con punto decimal. Rechaza formatos ambiguos como `1,234.56` en locale `es-ES`.

## Consecuencias

- La logica queda centralizada en `src/lib/decimal.ts`.
- Los formularios pueden migrar gradualmente al helper sin cambiar el modelo de datos.
- Los tests cubren los casos canonicos que rompen confianza financiera.

## Relacionado

- [[../issues/CACH-B0014|CACH-B0014]]
- [[../issues/CACH-B0016|CACH-B0016]]
