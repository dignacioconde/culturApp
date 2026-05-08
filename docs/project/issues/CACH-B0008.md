---
schema_version: 2
kind: issue
id: CACH-B0008
title: PWA notificaciones y offline
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0008
tags:
  - product-brain
  - issue
  - infra
  - mobile
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p2
size: m
area: infra
components:
  - infra-deploy
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: internal-agent-ops
---
# CACH-B0008 — PWA, notificaciones y offline

## Summary

Crear la base móvil avanzada: PWA, notificaciones, recordatorios, resúmenes automáticos y offline básico.

## Context

Agrupa #31, #35, #41, #42, #44 y #45.

## Problem

Recordatorios y resumen semanal dependen de canales de notificación. La experiencia móvil mejora si Cachés se puede instalar y consultar o registrar datos básicos sin conexión.

## Proposed Solution

- Convertir Cachés en PWA.
- Definir canales de notificación: in-app, email y push si aplica.
- Preferencias de usuario para alertas.
- Recordatorios de eventos y cobros.
- Resumen semanal configurable.
- Offline básico con estrategia de conflictos.

## Acceptance Criteria

- [ ] Cachés es instalable como PWA.
- [ ] Las notificaciones tienen preferencias claras.
- [ ] Se puede recordar evento/cobro con canal soportado.
- [ ] Offline básico no pisa datos sin resolución de conflictos.

## Related

- [[CACH-B0003|CACH-B0003]]
- [[CACH-B0007|CACH-B0007]]

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
