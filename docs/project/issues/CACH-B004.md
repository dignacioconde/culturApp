---
id: CACH-B004
type: issue
status: Backlog
priority: High
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B004
tags:
  - product-brain
  - issue
  - finance
  - data
---

# CACH-B004 — Contratantes, facturación y liquidación neta

## Summary

Evolucionar el modelo financiero para soportar contratantes, datos de facturación, gastos repercutibles, liquidación neta y posibles flujos CRM.

## Context

Agrupa #5, #7, #34, #48 y #51.

## Problem

El modelo actual cubre ingresos/gastos por proyecto o evento, pero no expresa bien quién contrata, qué gastos se repercuten, qué ingreso liquida un gasto concreto ni si Cachés debe evolucionar hacia CRM o colaboración.

## Proposed Solution

- Crear entidad contratante con datos de facturación.
- Permitir herencia de contratante desde proyecto a evento.
- Explorar ingresos/gastos unificados por proyecto como opción.
- Asociar gastos a ingresos para calcular cobro neto real.
- Tratar CRM ligero y cooperativa como spikes estratégicos antes de modelo multiusuario.

## Acceptance Criteria

- [ ] El diseño de datos diferencia cliente/contratante de texto libre.
- [ ] Se puede calcular liquidación neta cuando un gasto repercute sobre un ingreso.
- [ ] La opción de unificar ingresos/gastos a nivel proyecto no rompe eventos independientes.
- [ ] La decisión individual vs colaborativa queda resuelta antes de multiusuario.

## Related

- [[CACH-B003]]
- [[CACH-B009]]

