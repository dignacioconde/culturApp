---
schema_version: 2
kind: process
id: PB-DEFINITION-READY
title: Definition of Ready
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Definition of Ready
tags:
  - product-brain
  - process
  - ready
generated: false
---
# Definition of Ready

Una issue esta lista cuando cumple INVEST sin teatro.

## Criterios

- Independent: se puede mergear sin coordinar media app.
- Negotiable: describe problema y resultado, no una solucion cerrada innecesaria.
- Valuable: mejora confianza, uso real o capacidad de entregar.
- External: el valor se entiende desde fuera del codigo.
- Small: cabe en una sesion corta; si parece `size: l`, no existe como ready y se parte en slices `xs/s/m`.
- Testable: tiene criterios de aceptacion verificables.

## Regla beta

Ninguna `initiative` entra en `issue_workflow: ready`. Para ejecutar, crear una `slice` hija con `parent`, `components`, criterios verificables y validacion esperada.
