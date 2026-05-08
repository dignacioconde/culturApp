---
schema_version: 2
kind: issue
id: CACH-B0007
title: Calendario unificado e interaccion rapida
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
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
# CACH-B0007 — Calendario unificado e interacción rápida

## Summary

Mejorar el calendario para soportar eventos/proyectos juntos, filtros y acciones rápidas, respetando preferencias de fecha manual.

## Context

Agrupa #1, #2, #6, #20 y #36.

## Problem

Tener calendarios separados y detalles lentos puede dificultar la visión global del trabajo cultural. A la vez, el usuario prefiere fechas manuales y no conviene forzar selectores incómodos.

## Proposed Solution

- Calendario con filtros para eventos, proyectos o ambos.
- Proyectos con presencia visual más suave que eventos.
- Modal al pulsar en calendario con resumen y navegación.
- Evento de un día por defecto; rango solo si se activa.
- Disponibilidad como capa opcional futura.

## Acceptance Criteria

- [ ] El calendario puede mostrar eventos y proyectos sin confundir jerarquías.
- [ ] El usuario puede filtrar qué ve.
- [ ] Pulsar un item abre resumen útil y acceso al detalle.
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


## Cambios de alcance y decisiones


## Bloqueos


## Validación ejecutada

Pendiente hasta ejecutar la issue.

## Memoria

No aplica por ahora.
