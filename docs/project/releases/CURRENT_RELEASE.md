---
id: PB-CURRENT-RELEASE
type: release-status
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Current Release
tags:
  - product-brain
  - release
  - current
---

# Current Release

## Release activa

No active release.

Las tareas actuales van directamente a `main` por PR.

## Ultimo corte

`RELEASE-0.1.0-beta.1` — mergeada a `main`. Ver [[RELEASE-0.1.0-beta.1]].

## Siguiente release

No definida. Activar solo si hay varias issues que deban integrarse antes de llegar a `main`.

## Cuando activar una release

Usar release branch solo si:

- Hay varias issues relacionadas que se integran antes de main.
- Hay fase de estabilización real.
- Se necesita release notes agrupadas.

Para fixes, chores y mejoras menores: PR directa a `main` sin release branch.

## Como activar la siguiente release

1. Crear `docs/project/releases/RELEASE-0.1.0-beta.2.md` desde [[../templates/RELEASE_TEMPLATE]].
2. Definir scope concreto con al menos dos issues relacionadas.
3. Crear rama `release/0.1.0-beta.2`.
4. Actualizar este archivo con la nueva release activa y su rama.
5. Actualizar [[../backlog/BACKLOG]] y [[../plans/CURRENT_PLAN]].
