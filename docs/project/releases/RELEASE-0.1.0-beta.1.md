---
id: RELEASE-0.1.0-beta.1
type: release
status: Active
created: 2026-05-04
updated: 2026-05-05
github_release: pending
milestone: pending
release_branch: release/0.1.0-beta.1
aliases:
  - Sistema operativo Product Brain
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.1 — Sistema operativo Product Brain

## Estado

Active

## Rama de release

`release/0.1.0-beta.1`

## Goal

Dejar instalado el sistema operativo de producto e ingenieria: backlog, issues Markdown, releases versionadas, ramas, commits trazables, agentes y cierre de entregables.

## Product Outcome

El primer corte `0.1.0-beta.1` no entrega funcionalidad de usuario final; entrega la base operativa para que los siguientes cortes del ciclo `0.1` puedan avanzar con trazabilidad y merge frecuente a `main`.

## Scope

- [[../issues/CACH-B0015]] — Operativizar backlog, releases y ramas en Product Brain
- [[../issues/CACH-B0016]] — Refundacion operativa del Product Brain y tests B0014

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog, releases y ramas en Product Brain | done | `release/0.1.0-beta.1` |
| [[../issues/CACH-B0016|CACH-B0016]] | Refundacion operativa del Product Brain y tests B0014 | done | `chore/cach-b0016-brain-refactor` |

## Out Of Scope

- Cambios de producto usuario final.
- Endurecimiento tecnico del MVP: [[../issues/CACH-B0014|CACH-B0014]].
- Importacion/exportacion: [[../issues/CACH-B0005|CACH-B0005]].
- Onboarding beta: [[../issues/CACH-B0006|CACH-B0006]].
- Simplificacion mobile financiera: [[../issues/CACH-B0002|CACH-B0002]].
- Cobro rapido: [[../issues/CACH-B0003|CACH-B0003]].
- Redisenar Trabajos: [[../issues/CACH-B0001|CACH-B0001]].
- Calendario unificado: [[../issues/CACH-B0007|CACH-B0007]].

## Success Criteria

- [x] Product Brain define backlog operativo.
- [x] Product Brain define release activa/cortes.
- [x] Product Brain define branch strategy.
- [x] Product Brain define commit convention.
- [x] Product Brain define agent workflow.
- [x] Product Brain valida con `npm run pb:check`.

## Related

- [[../decisions/ADR-0008-release-branching-product-brain-workflow]]
- [[CURRENT_RELEASE]]
- [[../process/RELEASE_PROCESS]]

## Checklist de entrada

- [x] Release creada.
- [x] Rama local de release creada: `release/0.1.0-beta.1`.
- [x] Rama remota de release publicada.
- [x] Issues asociadas.
- [x] Alcance definido.
- [x] Criterios de validacion definidos.

## Checklist de desarrollo

- [x] Todas las issues del corte estan cerradas o Ready for Release.
- [x] Commits integrados en rama release.
- [x] No hay cambios sueltos fuera de release.
- [x] No hay issues sin estado.
- [x] Decisiones importantes de workflow documentadas.

## Checklist de estabilizacion

- [x] `npm run lint`.
- [x] `npm run build` no aplica; no toca app React/runtime.
- [x] `npm run pb:check`.
- [x] `npm run pb:status`.
- [x] Revision de documentacion.

## Checklist de salida

- [ ] Release mergeada a `main`.
- [x] Release notes actualizadas.
- [ ] Issues marcadas como `Released` tras merge.
- [x] Current Release actualizado.
- [x] Current Plan actualizado.
- [x] Backlog actualizado.
- [x] Proximos pasos documentados.

## Release notes

### Aniadido

- Sistema operativo de Product Brain para backlog, releases, ramas, commits y agentes.
- `CURRENT_RELEASE.md`, `CURRENT_PLAN.md`, backlog operativo, templates canonicas y docs de proceso.
- Regla de ciclos: `0.1` como ciclo, `0.1.0-beta.N` como cortes mergeables, `0.1.0` como changelog consolidado.
- Refundacion operativa del Product Brain: schema Zod, `pb:check` de coherencia, `pb:index`, captura a inbox y tablero de 5 columnas.
- Tests unitarios de decimal, datetime y payment ejecutados en UTC y Europe/Madrid.

### Cambiado

- Product Brain pasa a ser la fuente de verdad operativa para implementacion; GitHub queda como soporte tecnico de PR/CI.
- La beta usa rama versionada `release/0.1.0-beta.1`.
- Las releases de issues pasan a ser referencias tipadas a archivos reales o `null`.

### Corregido

- Se evita que la release branch sea una rama larga indefinida.
- Se eliminan strings libres de release en issues (`Unassigned`, `Beta`, `Internal`, `Pro`, `Growth`, `Post-MVP`, `0.1-cycle`).

### Eliminado

- Release legacy `RELEASE-0.1-beta`, sustituida por `RELEASE-0.1.0-beta.1`.

### Tecnico

- ADR-0008 documenta release branching gobernado por Product Brain.
- `scripts/product-brain-sync.mjs` conoce las carpetas `backlog/` y `process/`.
- ADR-0009 a ADR-0014 documentan IDs, frontmatter, timestamps, decimales, testing y feedback beta.

## Resultado final

Pendiente de merge a `main` mediante PR.

## Iteracion

Esta release usa numeracion de corte para poder mergear a `main`, ver resultado real y seguir iterando sin mantener una release branch indefinida.

Regla del ciclo:

- `0.1` es el ciclo organizativo de la primera beta privada.
- `0.1.0-beta.1` es el primer corte mergeable.
- `0.1.0-beta.2` sera el siguiente corte si hay que seguir iterando.
- `0.1.0` consolidara el changelog final del ciclo.

Siguiente corte esperado si hace falta otra iteracion de beta:

- `RELEASE-0.1.0-beta.2`
- `release/0.1.0-beta.2`
