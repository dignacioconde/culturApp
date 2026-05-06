---
id: PB-CURRENT-RELEASE
type: release-status
status: Active
created: 2026-05-05
updated: 2026-05-07
aliases:
  - Current Release
tags:
  - product-brain
  - release
  - current
---

# Current Release

## Release activa

`RELEASE-0.1.0-beta.5` — Flujo profesional de ramas beta.

## Rama activa

`release/0.1.0-beta.5`

## Ultimo corte

`RELEASE-0.1.0-beta.4` — mergeada a `main` el 2026-05-06. Ver [[RELEASE-0.1.0-beta.4]].

## Scope actual

- [[../issues/CACH-0036|CACH-0036]] — Profesionalizar flujo de ramas por beta.
- [[../issues/CACH-0037|CACH-0037]] — Consolidar PRD y sistema de diseno de Cachés.
- [[../issues/CACH-B0003|CACH-B0003]] — Cobro rapido y gestion de pendientes.

## Regla de trabajo para esta release

- La tarea se trabaja en rama local `docs/CACH-0036-beta-branching-flow` nacida desde `release/0.1.0-beta.5`.
- La tarea se integra en la release mediante squash.
- `CACH-B0003` entra en esta release por ampliacion explicita de scope solicitada durante el cierre.
- El cierre sera una PR unica `release/0.1.0-beta.5` -> `main`.
- El tag `v0.1.0-beta.5` se creara desde `main` actualizado despues de mergear la PR.

## Cuando activar una release

Usar release branch solo si:

- Hay varias issues relacionadas que se integran antes de main.
- Hay fase de estabilización real.
- Se necesita release notes agrupadas.

Para fixes, chores y mejoras menores: PR directa a `main` sin release branch.

## Como cerrar esta release

1. Confirmar que `CACH-0036`, `CACH-0037` y `CACH-B0003` estan integradas en `release/0.1.0-beta.5`.
2. Ejecutar validaciones finales.
3. Abrir PR `release/0.1.0-beta.5` -> `main`.
4. Tras mergear la PR, actualizar `main`, crear tag `v0.1.0-beta.5` y borrar la rama remota de release.
5. Actualizar esta pagina, [[../plans/CURRENT_PLAN|Current Plan]], [[../backlog/BACKLOG|Backlog]] y la release.
