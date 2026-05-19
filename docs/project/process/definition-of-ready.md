---
schema_version: 2
kind: process
id: PB-DEFINITION-READY
title: Definition of Ready
lifecycle: active
created: '2026-05-05'
updated: '2026-05-19'
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

## SDD por niveles

Toda issue ejecutable debe pasar Nivel 1 de [[sdd-levels]].

Antes de mover a `ready`, usar Nivel 2 cuando haya riesgo o complejidad: `size: m`, datos/RLS/seguridad/infra, finanzas, Supabase, auth, calendarios complejos, trabajo multi-componente, varios agentes/PRs o historial de rework por ambiguedad.

Nivel 2 anade escenarios, contrato tecnico, matriz `ACn -> validacion` y riesgos/rollback cuando aplique. No convierte la issue en PRD largo: el objetivo es que un implementador pueda actuar sin reabrir producto.
