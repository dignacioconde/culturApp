---
id: CACH-B003
type: issue
status: Backlog
priority: High
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B003
tags:
  - product-brain
  - issue
  - finance
---

# CACH-B003 — Cobro rápido y gestión de pendientes

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

- [ ] Un ingreso pendiente puede marcarse como cobrado desde el listado de pendientes.
- [ ] Un evento con ingreso pendiente ofrece una acción rápida clara.
- [ ] La acción registra `paid_date` y `is_paid` correctamente.
- [ ] El flujo evita marcar importes ambiguos sin confirmación.

## Related

- [[PB-ZK-20260504-2005]]
- [[CACH-B004]]
- [[CACH-B008]]

