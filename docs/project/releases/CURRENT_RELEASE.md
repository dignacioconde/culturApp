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

[[RELEASE-0.1.0-beta.7|RELEASE-0.1.0-beta.7]] — Portabilidad mínima de datos.

## Rama activa

`release/0.1.0-beta.7`

## Ultimo corte

`RELEASE-0.1.0-beta.6` — preparada en PR #85 el 2026-05-07 y pendiente de cierre final. Ver [[RELEASE-0.1.0-beta.6]].

## Scope actual

- [[../issues/CACH-B0005|CACH-B0005]] — Importacion, exportacion y portabilidad de datos.

## Regla de trabajo para esta release

Beta 7 usa rama de release activa y PR única a `main`.

Las ramas de tarea salen de `release/0.1.0-beta.7` y se integran con squash en la release. No añadir tareas fuera de CACH-B0005 sin actualizar primero el documento de release.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.7` -> `main`, esperar CI en verde, mergear, crear tag `v0.1.0-beta.7` desde `main`, verificar producción si aplica y limpiar la rama remota de release.
