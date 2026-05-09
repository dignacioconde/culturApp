---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.15
title: Navegacion movil esencial
lifecycle: draft
created: '2026-05-09'
updated: '2026-05-09'
aliases:
  - RELEASE-0.1.0-beta.15
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: draft
release_current: false
release_branch: release/0.1.0-beta.15
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.15 — Navegacion movil esencial

## Estado

Draft consolidado. No activo mientras `RELEASE-0.1.0-beta.14` siga como release actual.

## Rama de release

`release/0.1.0-beta.15`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.15` queda como siguiente corte candidato de producto tras cerrar `RELEASE-0.1.0-beta.14`.

## Objetivo de la release

Reducir friccion en la navegacion movil para que las areas principales de Cachés sigan accesibles en un toque sin saturar la barra inferior.

## Regla de activacion

Activar esta release solo cuando `RELEASE-0.1.0-beta.14` este cerrada o explicitamente desplazada. Hasta entonces, beta 15 funciona como plan consolidado y siguiente corte candidato.

## Alcance funcional

- Revisar items, etiquetas, iconos y estados activos de la navegacion inferior.
- Asegurar que la barra inferior cabe desde 320px y respeta safe areas.
- Mantener rutas principales accesibles desde movil.
- No cambiar arquitectura de rutas ni navegacion desktop salvo ajuste compartido imprescindible.

## Scope

- [[../issues/CACH-0042|CACH-0042]] — Racionalizar navegacion inferior.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0042|CACH-0042]] | Racionalizar navegacion inferior | ready | `feat/CACH-0042-bottom-navigation` |

## Fuera de alcance

- `CACH-B0020`: email/DNS/Brevo/Supabase SMTP sigue en `RELEASE-0.1.0-beta.14`.
- Redisenar el flujo completo de Trabajos (`CACH-B0001`).
- Rehacer experiencia financiera mobile completa (`CACH-B0002`) mas alla de la navegacion.
- Calendario unificado, filtros y resumen rapido (`CACH-B0007`).
- Cambios de schema, RLS, hooks publicos, Supabase remoto o formulas financieras.

## Riesgos

- No reducir accesos principales hasta romper el flujo diario en movil.
- No depender solo del color para indicar estado activo.
- No introducir textos demasiado largos que corten en 320px.
- No resolver dentro de este corte iniciativas amplias que necesitan slices propias.

## Checklist de entrada

- [x] Release creada
- [ ] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits preparados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin `issue_workflow`
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [ ] Lint correcto
- [ ] Build correcto
- [ ] Revision visual 320, 375, 390 y 768 px
- [ ] Revision responsive
- [ ] Revision accesibilidad basica
- [ ] Regression smoke de rutas principales
- [ ] Product Brain validado

## Checklist de salida

- [ ] PR `release/0.1.0-beta.15` -> `main` abierta
- [ ] CI en verde
- [ ] Revision aprobada
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main`
- [ ] Produccion verificada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Current Release actualizado
- [ ] Backlog actualizado

## Release notes

### Aniadido

- Pendiente.

### Cambiado

- Pendiente.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Tecnico

- Pendiente.

## Resultado final

Release draft consolidada como siguiente corte candidato. No activa hasta cerrar o desplazar `RELEASE-0.1.0-beta.14`.
