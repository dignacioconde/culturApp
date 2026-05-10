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
release_pr: https://github.com/dignacioconde/culturApp/pull/98
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
| [[../issues/CACH-0042|CACH-0042]] | Racionalizar navegacion inferior | review | `feat/CACH-0042-bottom-navigation` |

## Fuera de alcance

- Rediseño completo de UI/Lovable.
- Cambiar rutas, autenticacion, permisos o arquitectura de navegacion desktop.
- Cambios de Supabase, schema, entorno o produccion.
- Cambios visuales ajenos a la navegacion inferior movil.

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
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run build`
- [x] Revision movil en 320, 375, 390 y 768 px
- [x] Estado activo visible sin depender solo del color
- [x] Targets tactiles y safe areas verificados
- [ ] Navegacion atras verificada

## Checklist de salida

- [x] PR `release/0.1.0-beta.16` -> `main` abierta
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

- Barra inferior movil compacta con accesos a Trabajos, Inicio, Agenda, Plan, Datos y Ajustes.

### Cambiado

- La navegacion principal comparte configuracion entre sidebar/drawer y barra inferior movil.
- Los paneles moviles de calendario y los toasts se elevan sobre la nueva barra inferior.

### Corregido

- No aplica por ahora.

### Eliminado

- No aplica por ahora.

### Tecnico

- Release activada para que la rama de implementacion `feat/CACH-0042-bottom-navigation` salga de `release/0.1.0-beta.16`.
- Implementacion local de `CACH-0042` integrada por squash en `release/0.1.0-beta.16`; PR #98 abierta hacia `main`.

## Resultado final

Pendiente hasta cerrar la release.
