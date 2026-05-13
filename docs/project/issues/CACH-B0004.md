---
schema_version: 2
kind: issue
id: CACH-B0004
title: Contratantes facturacion y liquidacion neta
lifecycle: active
created: '2026-05-04'
updated: '2026-05-13'
aliases:
  - CACH-B0004
tags:
  - product-brain
  - issue
  - finance
  - data
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p1
size: m
area: data
components:
  - finance
  - design-system
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: finance-operations
---
# CACH-B0004 — Contratantes, facturación y liquidación neta

## Summary

Evolucionar el modelo financiero para soportar contratantes, datos de facturación, gastos repercutibles, liquidación neta y posibles flujos CRM.

## Context

Agrupa #5, #7, #34, #48 y #51.

## Problem

El modelo actual cubre ingresos/gastos por proyecto o evento, pero no expresa bien quién contrata, qué gastos se repercuten, qué ingreso liquida un gasto concreto ni si Cachés debe evolucionar hacia CRM o colaboración.

## Proposed Solution

- Crear entidad contratante con datos de facturación.
- Permitir herencia/inferencia de contratante desde proyecto a evento cuando el evento no define uno propio.
- Explorar ingresos/gastos unificados por proyecto como opción.
- Asociar gastos a ingresos para calcular cobro neto real.
- Tratar CRM ligero y cooperativa como spikes estratégicos antes de modelo multiusuario.

## Slicing beta

`RELEASE-0.1.0-beta.19` abre esta iniciativa con el slice seguro de contratantes estructurados:

- [[CACH-0057|CACH-0057]] — Definir modelo mínimo de contratantes.
- [[CACH-0058|CACH-0058]] — Versionar schema de contratantes y RLS.
- [[CACH-0059|CACH-0059]] — Integrar hooks y portabilidad de contratantes.
- [[CACH-0060|CACH-0060]] — Añadir UX mínima de contratantes en proyectos y eventos.
- [[CACH-0061|CACH-0061]] — Verificar regresión financiera y cierre técnico beta 19.

Quedan fuera de beta 19: facturas emitidas, liquidación neta gasto-ingreso, CRM ligero, colaboración multiusuario y cambios de fórmulas financieras.

## Acceptance Criteria

- [ ] El diseño de datos diferencia cliente/contratante de texto libre.
- [ ] Se puede calcular liquidación neta cuando un gasto repercute sobre un ingreso.
- [ ] La opción de unificar ingresos/gastos a nivel proyecto no rompe eventos independientes.
- [ ] La decisión individual vs colaborativa queda resuelta antes de multiusuario.

## Related

- [[CACH-B0003|CACH-B0003]]
- [[CACH-B0009|CACH-B0009]]
- [[../context/data-finance-model-20260504|data-finance-model-20260504]]

## Desarrollo

- Rama:
- PR:
- Estado actual:

## Notas de progreso

2026-05-13: Se activa `RELEASE-0.1.0-beta.19` como primer corte de la iniciativa, limitado a contratantes estructurados y compatibilidad con `client` legacy.

## Cambios de alcance y decisiones

Beta 19 no implementa liquidación neta ni facturación completa. Es una base de datos/UX para contratantes reutilizables.

## Bloqueos


## Validación ejecutada

Pendiente hasta ejecutar la issue.

## Memoria

No aplica por ahora.
