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

- [x] Cachés es instalable como PWA.
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

- 2026-05-13: se abre el primer slice acotado de esta iniciativa en [[CACH-0067|CACH-0067]] para PWA instalable basica dentro de `RELEASE-0.1.0-beta.21`. Quedan fuera push, notificaciones, recordatorios, resumen semanal y offline de datos.
- 2026-05-13: [[CACH-0067|CACH-0067]] queda cerrado en `RELEASE-0.1.0-beta.21` con manifest, iconos, service worker de app shell y smoke de rutas SPA/PWA. Quedan pendientes los canales de notificacion, recordatorios, resumen semanal y offline de datos.

## Cambios de alcance y decisiones

- La iniciativa se parte por seguridad y verificabilidad: primero instalabilidad y standalone; despues preferencias/canales; despues recordatorios; push y offline quedan para cortes separados con criterios de privacidad y conflictos.

## Bloqueos


## Validación ejecutada

PWA instalable basica verificada por `CACH-0067`. Resto de iniciativa pendiente.

## Memoria

No aplica por ahora.
