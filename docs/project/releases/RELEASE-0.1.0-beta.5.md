---
id: RELEASE-0.1.0-beta.5
type: release
status: Active
created: 2026-05-06
updated: 2026-05-06
release_branch: release/0.1.0-beta.5
aliases:
  - RELEASE-0.1.0-beta.5
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.5 — Flujo profesional de ramas beta

## Estado

Active

## Rama de release

`release/0.1.0-beta.5`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.5` es un corte iterativo mergeable centrado en proceso de delivery.

## Objetivo de la release

Dejar instalado y probado el flujo profesional de ramas por beta para que los siguientes cortes usen release remota visible, ramas de tarea locales, squash hacia release y PR unica de release a `main`.

## Alcance funcional

- Formalizar el contrato de branching beta.
- Registrar que las tareas fuera de scope no salen de una release activa por defecto.
- Alinear naming de ramas nuevas con `feat/`, `fix/`, `chore/` y `docs/`.
- Documentar cierre de beta con PR unica, tag desde `main` y limpieza de rama remota.

## Scope

- [[../issues/CACH-0036|CACH-0036]] — Profesionalizar flujo de ramas por beta.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0036|CACH-0036]] | Profesionalizar flujo de ramas por beta | Review | `docs/CACH-0036-beta-branching-flow` |

## Fuera de alcance

- Cambios de app React.
- Cambios en Supabase, datos o finanzas.
- Cambios de branch protection o CI.
- Merge final a `main`, tag y borrado de rama remota, que ocurren al cerrar la PR de release.

## Riesgos

- El flujo nuevo puede añadir demasiada ceremonia si se aplica a tareas pequenas; queda mitigado manteniendo el flujo ligero desde `main` para cambios fuera de release.
- Las ramas locales pueden perderse si una tarea dura varias sesiones; queda mitigado permitiendo rama remota de tarea como excepcion explicita.

## Decisiones relacionadas

- [[../decisions/ADR-0008-release-branching-product-brain-workflow|ADR-0008]]

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

- [ ] Build correcto
- [x] Tests/checks correctos
- [ ] Revision visual
- [ ] Revision responsive
- [ ] Revision accesibilidad
- [x] Revision de documentacion

## Checklist de salida

- [ ] PR `release/0.1.0-beta.5` -> `main` abierta
- [ ] CI en verde
- [ ] Revision aprobada
- [ ] PR mergeada en `main`
- [ ] `main` actualizado en local
- [ ] Tag `v0.1.0-beta.5` creado desde `main`
- [ ] Produccion verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.5` eliminada
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Documento de release actualizado como cerrado

## Release notes

### Aniadido

- Release activa para probar el nuevo flujo profesional de ramas beta.
- Issue CACH-0036 como scope trazable del cambio de proceso.

### Cambiado

- Product Brain documenta ramas de tarea locales por defecto y squash hacia release.
- El cierre de beta queda definido como PR unica `release/*` -> `main`.
- `feat/` pasa a ser prefijo preferido para ramas nuevas; `feature/` queda legacy.

### Corregido

- Se evita que una release activa absorba tareas nuevas fuera de scope por defecto.
- Se eliminan ejemplos canonicos de merge normal de ramas de tarea hacia release.

### Eliminado

- El merge local directo de `release/*` a `main` deja de ser flujo valido de cierre.

### Tecnico

- Validacion esperada: `npm run pb:check`, `git diff --check` y `rg` sobre ejemplos de branching.

## Resultado final

Cambios de proceso integrados por squash en `release/0.1.0-beta.5`. Pendiente PR unica `release/0.1.0-beta.5` -> `main`, tag `v0.1.0-beta.5` desde `main` y limpieza de rama remota al cerrar.
