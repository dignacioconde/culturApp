---
schema_version: 2
kind: issue
id: CACH-B0003
title: Cobro rapido y gestion de pendientes
lifecycle: historical
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0003
tags:
  - product-brain
  - issue
  - finance
generated: false
work_type: feature
work_level: slice
issue_workflow: done
priority: p1
size: m
area: frontend
components:
  - finance
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: RELEASE-0.1.0-beta.5
theme: finance-operations
---
# CACH-B0003 — Cobro rápido y gestión de pendientes

## Summary

Permitir marcar ingresos como cobrados de forma rápida desde listados, pendientes y contexto del evento, sin obligar a entrar al detalle completo.

## Context

Agrupa #30, #46 y la idea capturada: "Cuando estoy en un evento y termino, me gustaría poder marcarlo como cobrado rápido sin tener que entrar al detalle".

## Problem

El cobro es una acción frecuente y de baja fricción esperada justo al terminar un evento o al revisar pendientes. Si exige navegar al detalle completo, se retrasa o se olvida.

## Proposed Solution

- Vista rápida de ingresos pendientes con búsqueda por contratante, proyecto o evento.
- Acción de marcar como cobrado con un tap.
- Acceso directo desde tarjeta/listado de evento cuando sea razonable.
- Recordatorio si la fecha esperada pasa y sigue pendiente.

## Acceptance Criteria

- [x] Un ingreso pendiente puede marcarse como cobrado desde el listado de pendientes.
- [x] Un evento con ingreso pendiente ofrece una acción rápida clara.
- [x] La acción registra `paid_date` y `is_paid` correctamente.
- [x] El flujo evita marcar importes ambiguos sin confirmación.

## Resultado

Released en [[../releases/RELEASE-0.1.0-beta.5|RELEASE-0.1.0-beta.5]] por ampliacion explicita de scope. Integrado en `main` mediante PR #84.

- Dashboard permite marcar cobros pendientes y vencidos como cobrados sin entrar al detalle.
- Proyecto y evento replican el flujo en sus ingresos.
- Los ingresos ambiguos por concepto vacio o generico piden confirmacion antes de cobrarse.
- El feedback de cobro incluye deshacer, aceptar y cierre automatico a los 5 segundos.
- Las fechas de vencimiento se muestran solo en ingresos pendientes.

## Validacion

- `npm run test`
- `npm run lint`
- `npm run build`

## Related

- [[PB-ZK-20260504-2005|PB-ZK-20260504-2005]]
- [[CACH-B0004|CACH-B0004]]
- [[CACH-B0008|CACH-B0008]]
