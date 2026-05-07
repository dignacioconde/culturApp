---
id: CACH-B0005
title: Importacion exportacion y portabilidad de datos
type: feature
status: in-progress
cycle: unassigned
release: RELEASE-0.1.0-beta.7
priority: p1
estimate: m
area: db
created_at: 2026-05-04
updated_at: 2026-05-07
aliases:
  - CACH-B0005
tags:
  - product-brain
  - issue
  - data
  - beta
---

# CACH-B0005 — Importación, exportación y portabilidad de datos

## Summary

Crear garantías de portabilidad antes de beta: exportar todos los datos e importar desde CSV/Excel/Google Sheets o notas.

## Context

Agrupa #26 y #52.

## Problem

Antes de pedir confianza a usuarios beta, Cachés debe permitir sacar sus datos y facilitar migración desde hojas de cálculo o formatos manuales.

## Proposed Solution

- Exportación JSON/CSV de proyectos, eventos, ingresos y gastos.
- Importación mínima CSV con mapeo de columnas.
- Validación de datos antes de persistir.
- Estrategia clara para errores, duplicados y campos incompletos.

## Beta 7 Scope

- Exportar datos propios de proyectos, eventos, ingresos y gastos.
- Importar CSV básico validado antes de persistir.
- Mantener `user_id` derivado de sesión autenticada, nunca del archivo.
- Documentar límites de formato, duplicados y campos incompletos.
- Dejar onboarding, invitaciones y analítica para [[CACH-B0006|CACH-B0006]].

## Acceptance Criteria

- [ ] Un usuario puede exportar sus datos completos.
- [ ] Un usuario puede importar un CSV básico validado.
- [ ] Los errores de importación se muestran antes de guardar.
- [ ] La exportación no filtra datos de otros usuarios.

## Validation

- Ejecutar `npm run test`, `npm run lint`, `npm run build` y `npm run pb:check`.
- Smoke autenticado: exportar datos, importar CSV válido, importar CSV con errores y confirmar que no se persisten filas inválidas.
- Revisar que la importación ignora o rechaza cualquier `user_id` de archivo.

## Related

- [[CACH-B0006|CACH-B0006]]
