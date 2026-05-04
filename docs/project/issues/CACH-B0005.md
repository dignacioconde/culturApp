---
id: CACH-B0005
type: issue
status: Backlog
priority: High
release: Beta
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B0005
tags:
  - product-brain
  - issue
  - data
  - beta
---

# CACH-B005 — Importación, exportación y portabilidad de datos

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

## Acceptance Criteria

- [ ] Un usuario puede exportar sus datos completos.
- [ ] Un usuario puede importar un CSV básico validado.
- [ ] Los errores de importación se muestran antes de guardar.
- [ ] La exportación no filtra datos de otros usuarios.

## Related

- [[CACH-B006]]

