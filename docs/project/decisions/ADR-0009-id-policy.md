---
id: ADR-0009
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0009
tags:
  - product-brain
  - adr
  - ids
---

# ADR-0009 — Politica unica de IDs CACH

## Contexto

El Product Brain conserva issues historicas `CACH-0026`, `CACH-0028` y una serie beta `CACH-B0001` a `CACH-B0016`. Mantener varios estilos sin politica hace mas dificil buscar, enlazar y validar.

## Decision

A partir de la siguiente issue nueva, el ID canonico sera `CACH-NNNN` con contador monotono global. La letra `B` queda como legado historico de la primera beta y no se usara para issues nuevas.

El tipo de trabajo vive en frontmatter (`type: bug | feature | chore | spike | doc`) y el ciclo vive en `cycle`, no en el ID.

## Consecuencias

- No se renombran issues legacy para no romper historial ni enlaces.
- `pb:check` acepta `CACH-BNNNN` solo como compatibilidad historica.
- Las plantillas nuevas dejan claro que el contador no codifica tipo, release ni ciclo.

## Relacionado

- [[../issues/CACH-B0016|CACH-B0016]]
