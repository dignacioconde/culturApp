---
schema_version: 2
kind: issue
id: CACH-B0004
title: Contratantes facturacion y liquidacion neta
lifecycle: active
created: '2026-05-04'
updated: '2026-05-20'
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

`RELEASE-0.1.0-beta.25` continua la iniciativa con liquidacion neta minima:

- [[CACH-0099|CACH-0099]] — Preparar Beta 25 de liquidacion neta.
- [[CACH-0100|CACH-0100]] — Definir contrato de liquidacion neta minima.
- [[CACH-0101|CACH-0101]] — Versionar schema y RLS de gastos repercutibles.
- [[CACH-0102|CACH-0102]] — Integrar hooks y helpers de liquidacion neta.
- [[CACH-0103|CACH-0103]] — UX minima de liquidacion en detalles.
- [[CACH-0104|CACH-0104]] — QA financiera y cierre de Beta 25.

Quedan fuera de beta 25: facturacion legal completa, numeracion de facturas, PDF, IVA, CRM, pagos, conciliacion bancaria, colaboracion multiusuario y cambios de KPIs principales del dashboard.

## Acceptance Criteria

- [x] El diseño de datos diferencia cliente/contratante de texto libre.
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

2026-05-13: Implementación local de beta 19 preparada: schema/RLS local, hook, portabilidad y UX mínima de contratantes. Quedan pendientes verificación remota Supabase y smoke autenticado antes de considerar la release production-ready.

2026-05-20: Se activa `RELEASE-0.1.0-beta.25` como segundo corte de la iniciativa, limitado a liquidacion neta minima y gastos repercutibles.

## Cambios de alcance y decisiones

Beta 19 no implementa liquidación neta ni facturación completa. Es una base de datos/UX para contratantes reutilizables.

Beta 25 no implementa facturas, IVA, PDF, CRM ni cambios de dashboard. Su salida esperada es un resumen operativo de liquidacion en detalles y soporte minimo de datos para gastos repercutibles.

## Bloqueos


## Validación ejecutada

- `npm run lint` OK.
- `npm run test` OK.
- `npm run build` OK.
- Verificación remota Supabase pendiente.

## Memoria

No aplica por ahora.
