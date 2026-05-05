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

[[RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]]

## Rama activa

`release/0.1.0-beta.1`

## Estado

Active

## Objetivo

Permitir una primera beta privada fiable: agenda, cobros, gastos, datos portables y onboarding suficiente para probar Cachés con informacion real.

## Issues incluidas

- [[../issues/CACH-B0014|CACH-B0014]] — Endurecer agenda, cobros y captura del MVP
- [[../issues/CACH-B0005|CACH-B0005]] — Importacion, exportacion y portabilidad de datos
- [[../issues/CACH-B0006|CACH-B0006]] — Onboarding y acceso beta
- [[../issues/CACH-B0002|CACH-B0002]] — Simplificar experiencia mobile financiera
- [[../issues/CACH-B0003|CACH-B0003]] — Cobro rapido y gestion de pendientes
- [[../issues/CACH-B0001|CACH-B0001]] — Redisenar Trabajos y jerarquia proyecto-evento
- [[../issues/CACH-B0007|CACH-B0007]] — Calendario unificado e interaccion rapida
- [[../issues/CACH-B0015|CACH-B0015]] — Operativizar backlog, releases y ramas en Product Brain

## Reglas de trabajo

- Toda feature de esta release debe salir de `release/0.1.0-beta.1`.
- Toda feature debe tener issue Markdown `CACH-*`.
- Todo commit debe poder trazarse a una issue.
- No se trabaja directamente sobre `main`.
- No se anaden nuevas features a la release sin actualizar este archivo y la release.
- Si un hotfix sale de `main`, propagarlo a esta rama si aplica.

## Validacion minima para cerrar

- `npm run lint`
- `npm run build`
- `npm run pb:check` si cambia Product Brain
- QA visual/responsive para cambios UI
- Release notes completas en [[RELEASE-0.1.0-beta.1]]
