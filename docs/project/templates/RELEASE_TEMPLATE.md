---
schema_version: 2
kind: release
id: RELEASE-X.Y.Z-name
title: Nombre
lifecycle: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
aliases:
  - RELEASE-X.Y.Z-name
tags:
  - product-brain
  - release
generated: false
release_phase: draft
release_current: false
release_branch: release/x.y.z-name
release_tag: null
release_pr: null
---

# RELEASE-X.Y.Z-name — Nombre

## Release phase

draft / active / released / deprecated / archived

## Rama de release

`release/x.y.z-name`

## Ciclo

`X.Y` es el ciclo organizativo. `X.Y.Z-beta.N` es un corte iterativo mergeable. `X.Y.Z` es el cierre consolidado del ciclo.

## Objetivo de la release

Explica el objetivo principal.

## Alcance funcional

- ...

## Scope

- [[../issues/CACH-XXXX|CACH-XXXX]] — ...

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| CACH-XXXX | ... | backlog | `feat/CACH-XXXX-short-name` |

## Fuera de alcance

- ...

## Riesgos

- ...

## Decisiones relacionadas

- ADR-XXXX

## Checklist de entrada

- [ ] Release creada
- [ ] Rama de release creada
- [ ] Issues asociadas
- [ ] Alcance definido
- [ ] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin `issue_workflow`
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

- [ ] PR `release/<version>` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/<version>` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- ...

### Cambiado

- ...

### Corregido

- ...

### Eliminado

- ...

### Tecnico

- ...

## Resultado final

Pendiente hasta cerrar la release.
