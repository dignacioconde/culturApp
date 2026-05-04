---
id: CACH-B011
type: issue
status: Backlog
priority: Medium
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B011
tags:
  - product-brain
  - issue
  - ux
  - data
---

# CACH-B011 — Categorías, etiquetas y taxonomía

## Summary

Resolver si las categorías deben ser libres, predefinidas, opcionales o combinadas antes de tocar categorías por usuario.

## Context

Agrupa #16 y #39.

## Problem

Las categorías afectan a proyectos, eventos, ingresos, gastos, presupuestos y filtros. Cambiarlas sin decisión de modelo puede generar deuda de datos y UI.

## Proposed Solution

- Spike de categorías libres vs predefinidas.
- Evaluar si el usuario puede desactivar categorías.
- Separar categorías operativas de etiquetas libres.
- Revisar impacto en presupuestos por categoría.

## Acceptance Criteria

- [ ] Hay una decisión clara sobre categorías y etiquetas.
- [ ] La decisión cubre proyectos, eventos, ingresos y gastos.
- [ ] #16 no se implementa como ajuste aislado antes del spike.
- [ ] El modelo soporta evolución sin migraciones frágiles.

## Related

- [[CACH-B009]]

