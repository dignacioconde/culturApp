---
id: PB-DEFINITION-READY
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Definition of Ready
tags:
  - product-brain
  - process
  - ready
---

# Definition of Ready

Una issue esta lista cuando cumple INVEST sin teatro.

## Criterios

- Independent: se puede mergear sin coordinar media app.
- Negotiable: describe problema y resultado, no una solucion cerrada innecesaria.
- Valuable: mejora confianza, uso real o capacidad de entregar.
- External: el valor se entiende desde fuera del codigo.
- Small: cabe en una sesion corta; si parece `estimate: l`, se parte.
- Testable: tiene criterios de aceptacion verificables.

## Regla beta

Ninguna issue `estimate: l` entra en `cycle: beta-*`.
