---
id: PB-CURRENT-RELEASE
type: release-status
status: No active release
created: 2026-05-05
updated: 2026-05-06
aliases:
  - Current Release
tags:
  - product-brain
  - release
  - current
---

# Current Release

## Release activa

Ninguna.

## Ultimo corte

`RELEASE-0.1.0-beta.4` — mergeada a `main` el 2026-05-06. Ver [[RELEASE-0.1.0-beta.4]].

## Siguiente release

Pendiente de definir. Candidatas: CACH-0030 como PR directo o siguiente corte centrado en beta privada.

## Cuando activar una release

Usar release branch solo si:

- Hay varias issues relacionadas que se integran antes de main.
- Hay fase de estabilización real.
- Se necesita release notes agrupadas.

Para fixes, chores y mejoras menores: PR directa a `main` sin release branch.

## Como activar la siguiente release

1. Crear `docs/project/releases/RELEASE-0.1.0-beta.5.md` desde [[../templates/RELEASE_TEMPLATE]].
2. Definir scope concreto con al menos dos issues relacionadas.
3. Crear rama `release/0.1.0-beta.5`.
4. Actualizar este archivo con la nueva release activa y su rama.
5. Actualizar [[../backlog/BACKLOG]] y [[../plans/CURRENT_PLAN]].
