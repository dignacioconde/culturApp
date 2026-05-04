---
id: CACH-B0014
type: issue
status: Backlog
priority: High
release: RELEASE-0.1-beta
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B0014
tags:
  - product-brain
  - issue
  - hardening
---

# CACH-B014 — Endurecer agenda, cobros y captura del MVP

## Summary

Corregir los riesgos tecnicos que pueden romper la confianza basica del MVP: horas de eventos, fechas reales de cobro, importes con coma, cobros vencidos y colisiones en `pb:capture`.

## Context

El barrido tecnico de 2026-05-04 encontro que el producto ya funciona como MVP, pero hay varios puntos donde una usuaria podria ver datos financieros o de agenda incorrectos sin darse cuenta.

Antes de meter mas features de beta, Cachés necesita que lo que ya guarda sea fiable.

## Problem

- Los eventos se envian a `timestamptz` desde valores `YYYY-MM-DDTHH:mm`; hay riesgo de desfase horario si Supabase/Postgres interpreta la hora de forma distinta al navegador.
- El checkbox `Ya esta cobrado` en modales de ingreso guarda `is_paid`, pero no garantiza `paid_date`.
- Algunos importes siguen usando `type="number"` o `Number()`, lo que choca con coma decimal en contexto español.
- Los cobros vencidos desaparecen del panel de pendientes del dashboard.
- `pb:capture` puede generar IDs iguales si se capturan dos notas del mismo tipo en el mismo minuto.

## Proposed Solution

Tratarlo como una pasada de confianza del MVP:

- Definir y probar el contrato de zona horaria para eventos.
- Centralizar el payload de ingresos para que `is_paid` y `paid_date` se mantengan coherentes.
- Usar entrada decimal compatible con coma y punto en ingresos y gastos.
- Separar pendientes proximos y vencidos en dashboard.
- Hacer los IDs de capturas no-issue resistentes a colisiones.

## Acceptance Criteria

- [ ] Crear/editar un evento a las 08:00 en España vuelve a mostrarlo a las 08:00 tras guardar y recargar.
- [ ] Crear o editar un ingreso marcado como cobrado rellena `paid_date` si no existe.
- [ ] Ingresos y gastos aceptan `12,50` y `12.50` en formularios de evento y proyecto.
- [ ] Dashboard muestra cobros vencidos pendientes en vez de ocultarlos.
- [ ] Dos capturas consecutivas del mismo tipo no pisan el mismo archivo.
- [ ] `npm run lint`, `npm run build` y `npm run pb:status` pasan.

## Related

- [[../knowledge/PB-ZK-20260504-technical-audit]]
- [[CACH-B003]]
- [[CACH-B005]]
- [[../context/data-finance-model-20260504]]
- [[../context/beta-readiness-risk-map-20260504]]
