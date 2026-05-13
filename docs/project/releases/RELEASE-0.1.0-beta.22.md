---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.22
title: Historial de novedades beta
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.22
tags:
  - product-brain
  - release
  - beta
  - ux
generated: false
release_phase: released
release_current: false
release_branch: feat/CACH-0074-version-history
release_tag: v0.1.0-beta.22
release_pr: https://github.com/dignacioconde/culturApp/pull/109
---
# RELEASE-0.1.0-beta.22 — Historial de novedades beta

## Estado

Released.

## Rama de release

`feat/CACH-0074-version-history`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.22` es un corte ligero para publicar el historial user friendly de novedades beta y el guardrail que evita volver a lanzar features sin release asignada.

## Objetivo de la release

Dar a usuarios beta un lugar claro para entender que ha cambiado entre versiones y cerrar el fallo operativo que dejo esta feature flotando como PR/Preview sin release.

## Alcance funcional

- Nueva ruta privada `/novedades` con ultima novedad destacada e historial de versiones recientes.
- Accesos desde TopBar, Ajustes y navegacion desktop.
- La navegacion inferior movil se mantiene sin un destino adicional.
- Guardrail local de `ship` para bloquear features con `release: null` salvo excepcion explicita.

## Scope

- [[../issues/CACH-0074|CACH-0074]] — Historial user friendly de novedades beta.
- [[../issues/CACH-0075|CACH-0075]] — Bloquear ship de features sin release.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0074|CACH-0074]] | Historial user friendly de novedades beta | done | `feat/CACH-0074-version-history` |
| [[../issues/CACH-0075|CACH-0075]] | Bloquear ship de features sin release | done | `feat/CACH-0074-version-history` |

## Fuera de alcance

- CMS, backend o tabla editable para novedades.
- Marcar novedades como leidas por usuario.
- Notificaciones push o avisos automaticos.
- Liquidacion neta, facturacion o slices de `CACH-B0004`.

## Riesgos

- La ruta `/novedades` debe seguir protegida por auth y no llamar a Supabase.
- El guardrail no debe bloquear bugs, chores o docs pequenos que puedan salir fuera de release.
- La rama local antigua `release/0.1.0-beta.22` de liquidacion neta no forma parte de este corte.

## Decisiones relacionadas

- [[../issues/CACH-0052|CACH-0052]] — Formulario simple de feedback beta.
- [[../issues/CACH-0065|CACH-0065]] — Ampliar onboarding como tutorial revisitable.
- [[../issues/CACH-0067|CACH-0067]] — PWA instalable basica y navegacion standalone.
- [[../process/WORKFLOW|Workflow]].

## Checklist de entrada

- [x] Release creada
- [x] Rama de release definida como corte ligero via PR #109
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan cerradas
- [x] Commits integrados en la rama del PR
- [x] No hay cambios sueltos fuera del PR
- [x] No hay issues sin `issue_workflow`
- [x] Aprendizaje durable documentado

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:check`
- [x] `npm run pb:guard`
- [x] `git diff --check`
- [x] `npm run verify:pr -- --base origin/main`
- [x] CI de PR #109 en verde antes del merge

## Checklist de salida

- [x] PR #109 abierta contra `main`
- [x] CI en verde
- [x] PR mergeada en `main`
- [x] Tag `v0.1.0-beta.22` creado desde `main`
- [x] Produccion verificada con smoke postdeploy
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Pantalla privada `/novedades` con historial de cambios beta en lenguaje de usuario.
- Acceso a novedades desde TopBar, Ajustes y navegacion desktop.

### Cambiado

- Product Brain asocia `CACH-0074` a un corte beta real en vez de dejarlo como feature con `release: null`.

### Corregido

- `ship --execute` ya no permite lanzar features CACH sin release asignada salvo excepcion explicita con `--allow-no-release`.

### Eliminado

- No aplica.

### Tecnico

- Datos editoriales versionados en `src/lib/versionHistory.js`.
- Guardrail implementado en `scripts/ship.mjs` con lectura del frontmatter de la issue.

## Resultado final

Release preparada mediante PR #109 a `main`. Tag esperado: `v0.1.0-beta.22`. Produccion debe verificarse con smoke postdeploy tras el merge.
