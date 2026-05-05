---
id: PB-CURRENT-RELEASE
type: release-status
status: No Active Release
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

Ninguna.

## Rama activa

Ninguna.

## Estado

No Active Release

## Ultimo corte

- [[RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] — Sistema operativo de Product Brain, releases, backlog, ramas y agentes.

## Siguiente corte esperado

- `RELEASE-0.1.0-beta.2`
- `release/0.1.0-beta.2`

## Regla

- No implementar features grandes sin crear o activar una release.
- Si una tarea pertenece al ciclo `0.1`, crear el siguiente corte `0.1.0-beta.N`.
- Toda feature debe tener issue Markdown `CACH-*`.
- Todo commit debe poder trazarse a una issue.
- No se trabaja directamente sobre `main`.

## Como activar la siguiente release

1. Crear `docs/project/releases/RELEASE-0.1.0-beta.2.md` desde [[../templates/RELEASE_TEMPLATE]].
2. Definir scope concreto y pequeno.
3. Crear rama `release/0.1.0-beta.2`.
4. Actualizar este archivo con la nueva release activa.
5. Actualizar [[../backlog/BACKLOG]] y [[../plans/CURRENT_PLAN]].
