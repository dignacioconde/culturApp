---
id: RELEASE-0.1.0-beta.3
type: release
status: Active
created: 2026-05-06
updated: 2026-05-06
release_branch: release/0.1.0-beta.3
aliases:
  - RELEASE-0.1.0-beta.3
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.3 — Corrección de datos financieros del Dashboard

## Estado

Active

## Rama de release

`release/0.1.0-beta.3`

## Goal

Corregir el bug crítico que hacía que los KPIs de Cobrado/Neto del Dashboard mostrasen 0,00 € para cobros rápidos de proyecto ya marcados como pagados.

## Product Outcome

El usuario puede confiar en que los ingresos marcados como cobrados desde la página de proyecto aparecen en el mes correcto del Dashboard, con totales de Cobrado y Neto correctos.

## Scope

- [[../issues/CACH-0035|CACH-0035]] — Bug paid_date en cobros rápidos usa start_date en vez de fecha real

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| CACH-0035 | Bug paid_date en cobros rapidos de proyecto | in-progress | `release/0.1.0-beta.3` |

## Fuera de alcance

- Corrección de datos históricos ya guardados con `paid_date` incorrecto en Supabase.
- CACH-0030 (paleta/fuentes) — puede ir como PR directo a main separado.

## Riesgos

- Datos históricos con `paid_date` = `start_date` del proyecto seguirán mal hasta migración manual.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin estado
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [ ] Build correcto
- [ ] Tests/checks correctos
- [ ] Revision visual
- [ ] Revision responsive
- [ ] Revision accesibilidad
- [ ] Revision de regresion basica
- [ ] Revision de documentacion

## Checklist de salida

- [ ] Release mergeada a `main`
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Corregido

- Dashboard: cobros rápidos de proyecto marcados como pagados ahora guardan `paid_date` con la fecha real de cobro (hoy), no con la `start_date` del proyecto. Los KPIs de Cobrado y Neto reflejan correctamente los ingresos del mes. (CACH-0035)

## Resultado final

Pendiente hasta cerrar la release.
