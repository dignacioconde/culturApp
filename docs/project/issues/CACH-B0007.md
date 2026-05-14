---
schema_version: 2
kind: issue
id: CACH-B0007
title: Calendarios claros y sincronizacion suscribible
lifecycle: active
created: '2026-05-04'
updated: '2026-05-14'
aliases:
  - CACH-B0007
tags:
  - product-brain
  - issue
  - calendar
  - ux
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p1
size: m
area: frontend
components:
  - calendar
  - design-system
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: core-work-ux
---
# CACH-B0007 — Calendarios claros y sincronización suscribible

## Summary

Mejorar Agenda y Plan anual como calendarios separados, claros y accionables, con sincronización suscribible de eventos hacia calendarios externos.

## Context

Agrupa #1, #2, #6, #20 y #36. `CACH-0056` decidió no mantener una vista unificada porque mezclar eventos y proyectos empeoraba el modelo mental: eventos son ocurrencias con hora exacta; proyectos son rangos internos de trabajo.

## Problem

Los calendarios actuales están separados, pero no explican bien cuándo usar Agenda o Plan anual. En móvil se pierde visibilidad por la falta de una lista accionable, las marcas de color no comunican suficiente contexto y la agenda no puede llevarse fácilmente al calendario habitual del usuario.

## Proposed Solution

- Mantener Agenda de eventos y Plan anual de proyectos como superficies separadas, con navegación/copy común que explique el modelo.
- Añadir leyendas y resúmenes rápidos que hagan útiles los colores sin depender solo de ellos.
- Priorizar en móvil un patrón de calendario + lista accionable.
- Añadir sincronización privada suscribible `.ics/webcal` para eventos, sin OAuth ni escritura en calendarios externos.
- Disponibilidad como capa opcional futura.

## Acceptance Criteria

- [ ] Agenda y Plan anual explican claramente la diferencia entre evento con hora y proyecto por rango.
- [ ] En móvil, el usuario puede escanear el periodo seleccionado sin perder los eventos/proyectos en una rejilla difícil de leer.
- [ ] Las marcas de color tienen leyenda o texto asociado y no son la única señal.
- [ ] El usuario puede crear y revocar un enlace privado de sincronización de eventos.
- [ ] Crear/editar fechas mantiene entrada manual clara.

## Related

- [[CACH-B0001|CACH-B0001]]
- [[CACH-B0008|CACH-B0008]]
- [[../context/ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../knowledge/PB-ZK-20260504-rbc-height|PB-ZK-20260504-rbc-height]]

## Desarrollo

- Rama:
- PR:
- Estado actual:

## Notas de progreso

- 2026-05-14: Beta 24 reabre la iniciativa como calendario claro y sincronización suscribible, manteniendo la separación decidida en `CACH-0056`.
- 2026-05-14: Implementación local de Beta 24 completada: Agenda con lista visible, Plan anual móvil por mes, feed privado `.ics/webcal` de eventos y UI por Apple/Google/Outlook. Supabase remoto queda pendiente de aplicación/despliegue.
- 2026-05-14: Beta 24 cerrada con feed remoto validado, revocación corregida y gestión de enlaces activos simplificada.

## Cambios de alcance y decisiones

- La vista unificada queda fuera de Beta 24. La sincronización v1 incluye solo eventos y es de solo lectura hacia calendarios externos.

## Bloqueos


## Validación ejecutada

- `npm run lint` OK.
- `npm run test` OK.
- `npm run build` OK.
- `npm run test:e2e -- e2e/core-responsive.spec.ts` OK.
- `npm run pb:guard` OK.
- `npm run verify:pr -- --base origin/main` OK.

## Memoria

Memoria: ver `.memory/projects/calendar.md`.
