---
id: CACH-B0008
type: issue
status: Backlog
priority: Medium
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B0008
tags:
  - product-brain
  - issue
  - infra
  - mobile
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

