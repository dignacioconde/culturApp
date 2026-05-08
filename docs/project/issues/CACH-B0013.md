---
schema_version: 2
kind: issue
id: CACH-B0013
title: Gestion documental por proyecto evento
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0013
tags:
  - product-brain
  - issue
  - data
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p3
size: m
area: data
components:
  - projects
  - events
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: pro-growth
---
# CACH-B0013 — Gestión documental por proyecto/evento

## Summary

Permitir adjuntar o enlazar contratos, riders y facturas a proyectos o eventos.

## Context

Sale de #38. Post-MVP: revisar límites de Supabase free tier antes de implementar almacenamiento.

## Problem

Los documentos forman parte del flujo real de trabajo cultural, pero añaden coste, permisos y superficie de privacidad.

## Proposed Solution

- Empezar con enlaces externos o metadatos antes de storage propio.
- Evaluar límites de Supabase Storage.
- Definir permisos por usuario y relación proyecto/evento.

## Acceptance Criteria

- [ ] Los documentos no exponen datos privados entre usuarios.
- [ ] La solución respeta límites de coste.
- [ ] Se puede vincular documento a proyecto o evento.
- [ ] La feature queda post-MVP salvo evidencia fuerte.

## Related

- [[CACH-B0004]]

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
