---
id: RELEASE-0.1.0-beta.5
type: release
status: Released
created: 2026-05-06
updated: 2026-05-07
release_branch: release/0.1.0-beta.5
release_tag: v0.1.0-beta.5
aliases:
  - RELEASE-0.1.0-beta.5
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.5 — Flujo profesional de ramas beta

## Estado

Released

## Rama de release

`release/0.1.0-beta.5`

## Tag

`v0.1.0-beta.5`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.5` es un corte iterativo mergeable centrado en proceso de delivery.

## Objetivo de la release

Dejar instalado y probado el flujo profesional de ramas por beta para que los siguientes cortes usen release remota visible, ramas de tarea locales, squash hacia release y PR unica de release a `main`.

La release tambien consolida la documentacion base de producto y diseno creada durante el mismo trabajo, para que el PRD y el sistema de diseno viajen trazados junto al cambio de proceso.

Durante el cierre se amplia explicitamente el scope para incluir CACH-B0003 y completar el flujo de cobros pendientes en la app.

## Alcance funcional

- Formalizar el contrato de branching beta.
- Registrar que las tareas fuera de scope no salen de una release activa por defecto.
- Alinear naming de ramas nuevas con `feat/`, `fix/`, `chore/` y `docs/`.
- Documentar cierre de beta con PR unica, tag desde `main` y limpieza de rama remota.
- Completar el cobro rapido de pendientes en Dashboard, proyectos y eventos.

## Scope

- [[../issues/CACH-0036|CACH-0036]] — Profesionalizar flujo de ramas por beta.
- [[../issues/CACH-0037|CACH-0037]] — Consolidar PRD y sistema de diseno de Cachés.
- [[../issues/CACH-B0003|CACH-B0003]] — Cobro rapido y gestion de pendientes.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0036|CACH-0036]] | Profesionalizar flujo de ramas por beta | Released | `docs/CACH-0036-beta-branching-flow` |
| [[../issues/CACH-0037|CACH-0037]] | Consolidar PRD y sistema de diseno de Cachés | Released | `docs/CACH-0036-beta-branching-flow` |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | Released | `release/0.1.0-beta.5` |

## Fuera de alcance

- Cambios de app React fuera de CACH-B0003.
- Cambios en Supabase, datos o finanzas.
- Cambios de branch protection o CI.
- Cambios posteriores a la PR #84.

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

- [x] Build correcto
- [x] Tests/checks correctos
- [x] Revision visual
- [x] Revision responsive
- [x] Revision accesibilidad
- [x] Revision de documentacion

## Checklist de salida

- [x] PR `release/0.1.0-beta.5` -> `main` abierta
- [x] CI en verde
- [x] Revision aprobada
- [x] PR mergeada en `main`
- [x] `main` actualizado en local
- [x] Tag `v0.1.0-beta.5` creado desde `main`
- [x] Produccion verificada si aplica
- [x] Rama remota `release/0.1.0-beta.5` eliminada
- [x] Release notes actualizadas
- [x] Issues marcadas como `Released`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Documento de release actualizado como cerrado

## Release notes

### Aniadido

- Release activa para probar el nuevo flujo profesional de ramas beta.
- Issue CACH-0036 como scope trazable del cambio de proceso.
- Issue CACH-0037 para trazar el PRD y el sistema de diseno de Cachés.
- Issue CACH-B0003 para completar el cobro rapido y la gestion de pendientes.
- Notas de contexto estable para PRD y sistema de diseno enlazadas desde el indice de contexto.

### Cambiado

- Product Brain documenta ramas de tarea locales por defecto y squash hacia release.
- El cierre de beta queda definido como PR unica `release/*` -> `main`.
- `feat/` pasa a ser prefijo preferido para ramas nuevas; `feature/` queda legacy.
- Dashboard, proyectos y eventos permiten marcar ingresos pendientes como cobrados con confirmacion cuando el concepto es ambiguo.
- Los ingresos pendientes muestran vencimiento; los ingresos ya cobrados no muestran fecha de vencimiento.

### Corregido

- Se evita que una release activa absorba tareas nuevas fuera de scope por defecto.
- Se eliminan ejemplos canonicos de merge normal de ramas de tarea hacia release.

### Eliminado

- El merge local directo de `release/*` a `main` deja de ser flujo valido de cierre.

### Tecnico

- Validacion esperada: `npm run pb:check`, `git diff --check` y `rg` sobre ejemplos de branching.
- Validacion app CACH-B0003: `npm run test`, `npm run lint` y `npm run build`.

## Resultado final

Release cerrada y mergeada a `main` el 2026-05-07 en PR #84. Tag `v0.1.0-beta.5` creado desde `main`.
