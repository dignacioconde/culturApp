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

[[RELEASE-0.1.0-beta.8|RELEASE-0.1.0-beta.8]] — Onboarding y acceso beta privado.

## Rama activa

`release/0.1.0-beta.8`

## Ultimo corte

`RELEASE-0.1.0-beta.7` — mergeada a `main` en PR #86 el 2026-05-07. Ver [[RELEASE-0.1.0-beta.7]].

## Scope actual

- [[../issues/CACH-B0006|CACH-B0006]] — Onboarding y acceso beta.

## Regla de trabajo para esta release

Las tareas de [[../issues/CACH-B0006|CACH-B0006]] salen de `release/0.1.0-beta.8` y vuelven a esa rama. No mezclar sistema básico de releases ni analítica real en este corte.

## Como cerrar esta release

Cerrar mediante PR única `release/0.1.0-beta.8` -> `main`, validar CI, actualizar release notes, marcar CACH-B0006 como cerrada/Released, crear tag `v0.1.0-beta.8` desde `main` y limpiar rama remota.
