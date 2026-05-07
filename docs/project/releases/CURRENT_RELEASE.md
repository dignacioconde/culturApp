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

[[RELEASE-0.1.0-beta.9|RELEASE-0.1.0-beta.9]] — Panel admin de invitaciones.

## Rama activa

`release/0.1.0-beta.9`

## Ultimo corte

`RELEASE-0.1.0-beta.8` — mergeada a `main` en PR #87 el 2026-05-07. Ver [[RELEASE-0.1.0-beta.8]].

## Scope actual

- [[../issues/CACH-B0017|CACH-B0017]] — Panel admin para invitaciones beta.

## Regla de trabajo para esta release

Las tareas de [[../issues/CACH-B0017|CACH-B0017]] salen de `release/0.1.0-beta.9` y vuelven a esa rama. No mezclar calendario unificado, mobile financiero, tooling interno ni analítica real en este corte.

## Como cerrar esta release

Cerrar mediante PR única `release/0.1.0-beta.9` -> `main`, validar CI, actualizar release notes, marcar CACH-B0017 como cerrada/Released, crear tag `v0.1.0-beta.9` desde `main` y limpiar rama remota.
