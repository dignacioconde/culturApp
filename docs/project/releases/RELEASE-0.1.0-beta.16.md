---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.16
title: Navegación inferior móvil
lifecycle: active
created: '2026-05-10'
updated: '2026-05-10'
aliases:
  - RELEASE-0.1.0-beta.16
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.16
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.16 — Navegación inferior móvil

## Estado

Active.

## Rama de release

`release/0.1.0-beta.16`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.16` retoma la navegacion movil como corte pequeno y verificable tras cerrar el dominio publico de app en beta 15.

## Objetivo de la release

Reducir friccion en la navegacion movil manteniendo accesos claros a las areas principales sin saturar la barra inferior.

## Alcance funcional

- Racionalizar numero de items, etiquetas, iconos y estados activos de la barra inferior.
- Confirmar que la barra cabe en 320 px sin cortar etiquetas.
- Mantener targets tactiles razonables y compatibilidad con safe areas.
- Verificar que las rutas principales siguen accesibles en un toque desde movil.

## Scope

- [[../issues/CACH-0042|CACH-0042]] — Racionalizar navegacion inferior.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0042|CACH-0042]] | Racionalizar navegacion inferior | ready | `feat/CACH-0042-bottom-navigation` |

## Fuera de alcance

- Rediseño completo de UI/Lovable.
- Cambiar rutas, autenticacion, permisos o arquitectura de navegacion desktop.
- Cambios de Supabase, schema, entorno o produccion.
- Implementar la UI directamente durante la preparacion de release.

## Riesgos

- La barra inferior puede romperse en 320 px si se mantienen demasiados items o etiquetas largas.
- El estado activo debe ser evidente sin depender solo del color.
- Los cambios compartidos con desktop deben mantenerse minimos y justificados.

## Decisiones relacionadas

- No aplica.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release definida
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Revision movil en 320, 375, 390 y 768 px
- [ ] Estado activo visible sin depender solo del color
- [ ] Targets tactiles y safe areas verificados
- [ ] Navegacion atras verificada

## Checklist de salida

- [ ] PR `release/0.1.0-beta.16` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.16` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Pendiente hasta integrar `CACH-0042`.

### Cambiado

- Pendiente hasta integrar `CACH-0042`.

### Corregido

- No aplica por ahora.

### Eliminado

- No aplica por ahora.

### Tecnico

- Release activada para que la rama de implementacion `feat/CACH-0042-bottom-navigation` salga de `release/0.1.0-beta.16`.

## Resultado final

Pendiente hasta cerrar la release.
