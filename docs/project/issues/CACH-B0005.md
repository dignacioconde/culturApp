---
schema_version: 2
kind: issue
id: CACH-B0005
title: Importacion exportacion y portabilidad de datos
lifecycle: historical
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0005
tags:
  - product-brain
  - issue
  - data
  - beta
generated: false
work_type: feature
work_level: slice
issue_workflow: done
priority: p1
size: m
area: data
components:
  - data-portability
  - auth-onboarding
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: RELEASE-0.1.0-beta.7
theme: beta-trust
---
# CACH-B0005 — Importación, exportación y portabilidad de datos

## Summary

Crear garantías de portabilidad antes de beta: exportar los datos operativos y ofrecer una importación CSV mínima, validada y explícitamente limitada.

## Context

Agrupa #26 y #52.

## Problem

Antes de pedir confianza a usuarios beta, Cachés debe permitir sacar sus datos y facilitar migración desde hojas de cálculo o formatos manuales.

## Proposed Solution

- Exportación JSON/CSV de proyectos, eventos, ingresos y gastos.
- Importación mínima CSV con plantilla fija y claves locales.
- Validación de datos antes de persistir.
- Estrategia clara para errores, duplicados, campos incompletos y guardado no atómico.

## Beta 7 Scope

- Exportar datos operativos propios de proyectos, eventos, ingresos y gastos.
- Importar CSV básico validado antes de persistir, sin prometer restore completo ni transacción multi-tabla.
- Mantener `user_id` derivado de sesión autenticada, nunca del archivo.
- Usar `project_key` y `event_key` locales para relaciones; no aceptar UUIDs crudos del archivo.
- Documentar límites de formato, duplicados, campos incompletos, tamaño y filas.
- Dejar onboarding, invitaciones y analítica para [[CACH-B0006|CACH-B0006]].
- Dejar Excel/XLSX, Google Sheets directo, notas libres, mapeo avanzado, importación idempotente y restore JSON fuera de Beta 7.

## Acceptance Criteria

- [x] Un usuario puede exportar sus datos operativos en JSON y CSV por entidad.
- [x] Un usuario puede importar un CSV básico con plantilla fija, `project_key` y `event_key`.
- [x] Los errores de importación se muestran antes de guardar.
- [x] La exportación no filtra datos de otros usuarios.
- [x] La importación rechaza `id`, `user_id`, `created_at`, `project_id` y `event_id` del archivo.
- [x] La importación comunica que es create-only y no atómica.
- [x] Exportación e importación CSV mitigan fórmulas de hoja de cálculo.

## Validation

- Ejecutado `npm run test`, `npm run lint`, `npm run build` y `npm run pb:check`.
- Ejecutado `git diff --check`.
- Smoke autenticado aceptado por revisión manual del usuario el 2026-05-07.
- Revisar que la importación ignora o rechaza cualquier `user_id` de archivo.
- Revisar límites: 1 MB, 500 filas, columnas esperadas y errores acotados.

## Resultado

Released en [[../releases/RELEASE-0.1.0-beta.7|RELEASE-0.1.0-beta.7]]. Integrado en `main` mediante PR #86.

## Related

- [[CACH-B0006|CACH-B0006]]
