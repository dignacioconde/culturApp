---
id: CACH-B0015
type: issue
status: Ready for Release
priority: High
release: RELEASE-0.1.0-beta.1
created: 2026-05-05
updated: 2026-05-05
aliases:
  - CACH-B0015
tags:
  - product-brain
  - issue
  - workflow
  - releases
  - agents
---

# CACH-B0015 — Operativizar backlog, releases y ramas en Product Brain

## Estado

Ready for Release

## Tipo

Docs / Chore / Process

## Release

[[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]]

## Rama sugerida

`docs/CACH-B0015-product-ops-workflow`

## Contexto

El Product Brain ya es la fuente de verdad de Cachés, pero el flujo operativo aun estaba repartido entre memoria, AGENTS, issues Markdown, release notes y scripts.

## Problema

Sin un sistema explicito de backlog, releases, ramas, commits y cierre, los agentes pueden ejecutar tareas sueltas sin responder de forma consistente:

- que issue justifica el cambio;
- a que release pertenece;
- en que rama se trabaja;
- que commits lo implementan;
- como se valida;
- donde queda documentado el resultado.

## Objetivo

Convertir `docs/project/` en un sistema operativo ligero de producto e ingenieria, manteniendo Product Brain como fuente de verdad y GitHub como soporte tecnico de PRs/checks cuando aplique.

## Alcance

### Incluido

- Backlog operativo con estados.
- Current Release.
- Current Plan.
- Proceso de desarrollo.
- Estrategia de ramas con release branch.
- Convencion de commits.
- Proceso de releases.
- Workflow de agentes.
- Plantillas canonicas de issue, release y ADR.
- ADR de la decision de release branching.

### Fuera de alcance

- Automatizaciones ejecutables nuevas.
- Migrar todas las issues existentes a formato extendido.
- Crear ramas remotas o PRs.
- Sustituir el sistema de sync Product Brain.

## Criterios de aceptacion

- [x] Existe estrategia clara de releases.
- [x] Existe `CURRENT_RELEASE.md`.
- [x] Esta documentado como crear ramas y evitar trabajar sobre `main`.
- [x] Esta documentado como nombrar commits.
- [x] Las issues Markdown tienen plantilla profesional.
- [x] Las releases tienen plantilla profesional.
- [x] Existe proceso para cerrar releases.
- [x] Existe Definition of Ready.
- [x] Existe Definition of Done.
- [x] Existe Definition of Release Done.
- [x] Los agentes tienen instrucciones claras.
- [x] El flujo no depende de GitHub Issues como fuente de verdad.
- [x] El sistema permite trazabilidad entre issue, rama, commit y release.

## Riesgos

- Demasiada documentacion puede volverse burocracia si no se mantiene ligera.
- La memoria antigua aun menciona GitHub Issues como flujo obligatorio; este documento fija la migracion hacia Product Brain como fuente principal.
- La rama de release debe crearse antes de la siguiente implementacion real.

## Dependencias

- [[../decisions/ADR-0003-repo-native-product-brain|ADR-0003]]
- [[../decisions/ADR-0008-release-branching-product-brain-workflow|ADR-0008]]

## Notas tecnicas

- No se anaden scripts nuevos en esta fase; se documentan automatizaciones opcionales para una iteracion futura.
- `npm run pb:check` debe pasar antes de cerrar cambios en `docs/project/`.

## Plan de implementacion

1. Auditar estructura real de Product Brain.
2. Crear backlog/process/current release/current plan.
3. Ampliar plantillas.
4. Documentar estrategia de release branching.
5. Actualizar indices y referencias.
6. Validar Product Brain.

## Validacion

- [x] Revision documental.
- [x] `npm run pb:check`
- [x] `npm run pb:status`
- [x] `npm run lint`

## Resultado

Product Brain queda preparado como sistema operativo de producto e ingenieria: backlog, release activa, ramas, commits, agentes, plantillas y cierre de releases quedan documentados y enlazados.

`pb:status` queda sin conflictos; muestra cambios locales pendientes de publicar al vault con `pb:push` cuando proceda.

La convencion de release queda versionada: `RELEASE-0.1.0-beta.1` usa rama `release/0.1.0-beta.1`.

La regla de ciclos queda consolidada: `0.1` es ciclo organizativo, `0.1.0-beta.N` son cortes mergeables a `main`, y `0.1.0` es el cierre con changelog consolidado.

## Commits relacionados

- Pendiente

## Pull/Merge relacionado

- Pendiente

## Relacionado

- [[../releases/CURRENT_RELEASE]]
- [[../process/DEVELOPMENT_WORKFLOW]]
- [[../process/BRANCHING_STRATEGY]]
- [[../process/COMMIT_CONVENTION]]
- [[../process/RELEASE_PROCESS]]
- [[../process/AGENT_WORKFLOW]]
