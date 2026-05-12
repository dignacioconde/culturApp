---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.18
title: Cierre P1 UX core
lifecycle: active
created: '2026-05-12'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.18
tags:
  - product-brain
  - release
  - beta
  - ux
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.18
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.18 — Cierre P1 UX core

## Estado

Active.

## Rama de release

`release/0.1.0-beta.18`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.18` es un corte mergeable para cerrar P1 visible sin abrir modelo financiero nuevo.

## Objetivo de la release

Cerrar el P1 de UX core que falta: notas contextuales, pulido financiero móvil y calendarios separados más claros, manteniendo fuera los cambios de datos de contratantes y liquidación neta.

## Alcance funcional

- Edición contextual de notas en detalles de proyecto y evento usando el campo `notes` existente.
- Pulido/regresión móvil financiera sin cambiar fórmulas, hooks públicos, RLS ni schema.
- Calendario de eventos y plan anual de proyectos separados.
- Compatibilidad de rutas: `/calendar` redirige a `/calendar/events` y `/calendar/projects` conserva la planificación anual.

## Scope

- [[../issues/CACH-0054|CACH-0054]] — Editar notas desde detalles de proyecto y evento.
- [[../issues/CACH-0055|CACH-0055]] — Pulido financiero móvil sin cambiar fórmulas.
- [[../issues/CACH-0056|CACH-0056]] — Calendario de eventos y plan anual separados.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0054|CACH-0054]] | Editar notas desde detalles de proyecto y evento | review | `release/0.1.0-beta.18` |
| [[../issues/CACH-0055|CACH-0055]] | Pulido financiero movil sin cambiar formulas | review | `release/0.1.0-beta.18` |
| [[../issues/CACH-0056|CACH-0056]] | Calendario de eventos y plan anual separados | review | `release/0.1.0-beta.18` |

## Fuera de alcance

- `CACH-B0004`.
- Contratantes estructurados, `contractor_id`, facturación, gastos repercutibles y liquidación neta.
- Migraciones Supabase, cambios de RLS o cambios de schema financiero.
- Cambios de fórmulas financieras, KPIs o reglas de `cobro bruto/hora`.
- PWA, notificaciones, offline, features Pro, perfil público o documentos.

## Riesgos

- Las rutas de calendario tocan navegación móvil; deben conservar `Agenda` para eventos y `Plan` como planificación anual.
- React Big Calendar requiere altura real calculable; el cierre exige verificación visual.
- El pulido financiero móvil puede parecer cambio de producto si reintroduce métricas o fórmulas; esta release solo cambia presentación y ergonomía.
- Las notas contextuales no deben convertirse en adjuntos, CRM, privacidad avanzada ni gestión documental.

## Decisiones relacionadas

- [[../issues/CACH-B0001|CACH-B0001]] — Trabajos y jerarquía proyecto-evento.
- [[../issues/CACH-B0002|CACH-B0002]] — Experiencia mobile financiera.
- [[../issues/CACH-B0007|CACH-B0007]] — Calendario e interacción rápida.
- [[../issues/CACH-B0004|CACH-B0004]] queda fuera de este corte.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`
- [x] `npm run release:status`
- [x] Revision visual responsive en 320, 390, 768 y desktop
- [x] Calendario verificado con toolbar, cabeceras, filas/celdas y eventos/proyectos visibles
- [x] Formulas financieras confirmadas sin cambios

## Checklist de salida

- [ ] PR `release/0.1.0-beta.18` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.18` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Edición contextual de notas en detalles de proyecto y evento.

### Cambiado

- Navegación `Agenda` apunta al calendario de eventos; `Plan` mantiene la planificación anual de proyectos.
- Flujos financieros móviles quedan más directos sin cambiar fórmulas ni modelo de datos.

### Corregido

- Las notas ya no dependen de abrir el formulario completo para una edición rápida desde el detalle.

### Eliminado

- No aplica.

### Tecnico

- `/calendar` queda como redirect compatible hacia `/calendar/events`.
- La vista unificada se descarta para beta 18: eventos y plan anual quedan separados.
- No se añaden migraciones ni cambios de RLS.

## Resultado final

Implementación local completa en `release/0.1.0-beta.18`. Pendiente de commits, PR, CI, merge y verificación de producción si aplica.
