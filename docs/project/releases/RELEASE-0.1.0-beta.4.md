---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.4
title: Planificacion anual de proyectos
lifecycle: active
created: '2026-05-06'
updated: '2026-05-08'
aliases:
  - RELEASE-0.1.0-beta.4
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: released
release_current: false
release_branch: feat/CACH-0033-project-year-view
release_tag: v0.1.0-beta.4
release_pr: null
---
# RELEASE-0.1.0-beta.4 — Planificacion anual de proyectos

## Estado

Released

## Rama de release

`feat/CACH-0033-project-year-view`

## Tag

`v0.1.0-beta.4`

## Goal

Transformar `/calendar/projects` en una herramienta de planificacion anual para proyectos culturales, priorizando duracion, solapes, meses activos y carga de trabajo.

## Product Outcome

El usuario puede entender rapidamente que proyectos estan activos en el ano visible, que meses concentran mas carga, que proyectos se solapan y que viene a continuacion sin leer una parrilla diaria/semanal.

## Scope

- [[../issues/CACH-0033|CACH-0033]] — Vista anual en calendario de proyectos.
- Timeline anual tipo Gantt simplificado en desktop.
- Detalle mensual como lista de proyectos activos.
- Vista movil con Gantt compacto por proyecto y lista mensual por cards.
- Helpers puros para rangos, meses activos, cruce de anos, mes mas cargado y proximo inicio.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0033|CACH-0033]] | Vista anual en calendario de proyectos | Released | `feat/CACH-0033-project-year-view` |

## Fuera de alcance

- Calendario de eventos, tareas o citas concretas.
- Cambios de Supabase, SQL, RLS o contratos remotos.
- Filtros avanzados e interaccion rapida del calendario unificado.

## Riesgos

- La validacion visual fue basica; conviene revisar manualmente `/calendar/projects` con datos reales en desktop y mobile.
- La vista movil prioriza legibilidad sin scroll horizontal; si hay muchisimos proyectos, puede requerir filtros o agrupacion futura.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] Build correcto
- [x] Tests/checks correctos
- [x] Revision visual
- [x] Revision responsive
- [x] Revision accesibilidad
- [x] Revision de regresion basica
- [x] Revision de documentacion

## Checklist de salida

- [x] Release mergeada a `main`
- [x] Release notes actualizadas
- [x] Issues marcadas como `Released`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Nueva planificacion anual para `/calendar/projects` con timeline desktop por meses.
- Gantt compacto movil: una tarjeta por proyecto con 12 segmentos mensuales.
- Detalle mensual en lista para proyectos activos.
- Helpers puros de calendario de proyectos con tests unitarios.

### Cambiado

- El calendario de proyectos deja de comportarse como agenda de citas y pasa a priorizar rangos, solapes y carga mensual.
- En movil se evita la parrilla diaria/semanal y el scroll horizontal excesivo.

### Corregido

- Los proyectos largos ya no se repiten visualmente semana a semana en la vista principal.
- Se cubren proyectos que cruzan anos, meses sin proyectos, fechas incompletas y proyectos sin fecha final.

### Eliminado

- Se elimina la dependencia visual de React Big Calendar en `/calendar/projects`.
- Se eliminan chips y barras semanales duplicadas en la experiencia principal de proyectos.

### Tecnico

- Validado con `npm run test -- projectYearCalendar`, `npm run lint`, `npm run build`, CI `app`, CI `e2e` y smoke HTTP de produccion.

## Resultado final

Release cerrada y mergeada a `main` el 2026-05-06 en PR #83. Produccion responde `200` en `/calendar/projects`.
