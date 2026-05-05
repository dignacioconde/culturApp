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
  - Primera beta privada
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.1 — Primera beta privada

## Estado

Active

## Rama de release

`release/0.1.0-beta.1`

## Goal

Permitir que una primera persona usuaria cree trabajos reales, registre cobros y gastos, entienda el estado economico basico y pueda recuperar/exportar sus datos.

## Product Outcome

La beta no busca parecer completa. Busca que Cachés sea fiable para probar con datos reales sin miedo a perderlos ni malinterpretarlos.

## Scope

- [[../issues/CACH-B0014]] — Endurecer agenda, cobros y captura del MVP
- [[../issues/CACH-B0005]] — Importacion, exportacion y portabilidad de datos
- [[../issues/CACH-B0006]] — Onboarding y acceso beta
- [[../issues/CACH-B0002]] — Simplificar experiencia mobile financiera
- [[../issues/CACH-B0003]] — Cobro rapido y gestion de pendientes
- [[../issues/CACH-B0001]] — Rediseñar Trabajos y jerarquia proyecto-evento
- [[../issues/CACH-B0007]] — Calendario unificado e interaccion rapida
- [[../issues/CACH-B0015]] — Operativizar backlog, releases y ramas en Product Brain

## Issues incluidas

| Issue | Titulo | Estado | Rama sugerida |
|---|---|---|---|
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda, cobros y captura del MVP | Ready for development | `fix/CACH-B0014-mvp-trust-pass` |
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | Backlog refinado | `feature/CACH-B0005-data-portability` |
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | Backlog refinado | `feature/CACH-B0006-beta-onboarding` |
| [[../issues/CACH-B0002|CACH-B0002]] | Simplificar experiencia mobile financiera | Backlog refinado | `feature/CACH-B0002-mobile-finance` |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | Backlog refinado | `feature/CACH-B0003-quick-paid-action` |
| [[../issues/CACH-B0001|CACH-B0001]] | Redisenar Trabajos y jerarquia proyecto-evento | Backlog refinado | `feature/CACH-B0001-work-hierarchy` |
| [[../issues/CACH-B0007|CACH-B0007]] | Calendario unificado e interaccion rapida | Backlog refinado | `feature/CACH-B0007-unified-calendar` |
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog, releases y ramas en Product Brain | Ready for Release | `docs/CACH-B0015-product-ops-workflow` |

## Out Of Scope

- Inteligencia financiera Pro.
- Perfil publico, referidos y viralidad.
- Gestion documental avanzada.
- Offline completo y notificaciones complejas, salvo recordatorios minimos si son necesarios para cobros.

## Success Criteria

- [ ] Una persona nueva entiende proyecto, evento e ingreso sin explicacion externa larga.
- [ ] Puede crear un primer trabajo real desde movil.
- [ ] Puede registrar un ingreso, marcarlo como cobrado y verlo en dashboard correctamente.
- [ ] Puede exportar sus datos antes de confiar mas informacion a Cachés.
- [ ] No hay desfases de hora visibles al crear/editar eventos.
- [ ] La app explica o pide consentimiento antes de capturar analitica de uso.

## Related

- [[../context/beta-readiness-risk-map-20260504]]
- [[../decisions/ADR-0002-beta-trust-before-pro]]
- [[../decisions/ADR-0008-release-branching-product-brain-workflow]]
- [[CURRENT_RELEASE]]
- [[../process/RELEASE_PROCESS]]

## Checklist de entrada

- [x] Release creada.
- [x] Rama local de release creada: `release/0.1.0-beta.1`.
- [ ] Rama remota de release publicada.
- [x] Issues asociadas.
- [x] Alcance definido.
- [x] Criterios de validacion definidos.

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas.
- [ ] Commits integrados en rama release.
- [ ] No hay cambios sueltos fuera de release.
- [ ] No hay issues sin estado.
- [x] Decisiones importantes de workflow documentadas.

## Checklist de estabilizacion

- [ ] `npm run lint`.
- [ ] `npm run build`.
- [ ] `npm run pb:check`.
- [ ] Revision visual.
- [ ] Revision responsive.
- [ ] Revision accesibilidad.
- [ ] Revision de documentacion.

## Checklist de salida

- [ ] Release mergeada a `main`.
- [ ] Release notes actualizadas.
- [ ] Issues marcadas como `Released`.
- [ ] Current Release actualizado.
- [ ] Current Plan actualizado.
- [ ] Backlog actualizado.
- [ ] Proximos pasos documentados.

## Release notes

### Aniadido

- Sistema operativo de Product Brain para backlog, releases, ramas, commits y agentes.

### Cambiado

- La beta declara rama versionada `release/0.1.0-beta.1`.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Tecnico

- ADR-0008 documenta release branching gobernado por Product Brain.

## Resultado final

Pendiente hasta cerrar la release.

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

## Sync

Las releases del Product Brain se vinculan a GitHub Release y Milestone.

### Flujo actual (manual)

1. Crear GitHub Release con `gh release create <tag> --title "..." --notes "..."`.
2. Crear Milestone con `gh api repos/<owner>/<repo>/milestones --method POST -f title="..."`.
3. Vincular issues al milestone desde GitHub UI o API.
4. Actualizar documento del Product Brain con `github_release` y `milestone` en el frontmatter.
5. Commitear y pushear cambios.

### Mejora futura (automatica)

Propuesta: crear script `scripts/github-release-sync.mjs` que:
- Acepte tag de release como argumento
- Cree GitHub Release automaticamente desde el tag de git
- Cree Milestone si no existe
- Pida issues a vincular (seleccion multiple)
- Actualice el documento del Product Brain con los enlaces

### Comandos utiles

```bash
# Listar releases
gh release list

# Ver milestone
gh api repos/dignacioconde/culturApp/milestones

# Vincular issue a milestone
gh issue edit <num> --milestone "RELEASE-0.1.0-beta.1"
```
