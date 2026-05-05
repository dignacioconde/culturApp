---
id: CACH-B0013
title: Gestion documental por proyecto evento
type: feature
status: backlog
cycle: unassigned
release: null
priority: p3
estimate: m
area: db
created_at: 2026-05-04
updated_at: 2026-05-04
aliases:
  - CACH-B0013
tags:
  - product-brain
  - issue
  - data
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
