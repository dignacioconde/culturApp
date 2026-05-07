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

[[RELEASE-0.1.0-beta.6|RELEASE-0.1.0-beta.6]] — Estabilización visual y mobile financiero.

## Rama activa

`release/0.1.0-beta.6`

## Ultimo corte

`RELEASE-0.1.0-beta.5` — mergeada a `main` en PR #84 el 2026-05-07. Ver [[RELEASE-0.1.0-beta.5]].

## Scope actual

- [[../issues/CACH-0030|CACH-0030]] — Homogeneizar diseño con nueva paleta de colores y fuentes.
- [[../issues/CACH-0038|CACH-0038]] — Compactar mobile financiero y detalles accionables.

## Regla de trabajo para esta release

Beta 6 usa rama de release activa y PR única a `main`.

Las ramas de tarea salen de `release/0.1.0-beta.6` y se integran con squash en la release. No añadir tareas fuera de CACH-0030/CACH-0038 sin actualizar primero el documento de release.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.6` -> `main`, esperar CI en verde, mergear, crear tag `v0.1.0-beta.6` desde `main`, verificar producción si aplica y limpiar la rama remota de release.
