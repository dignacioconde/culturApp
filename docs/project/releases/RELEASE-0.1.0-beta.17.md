---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.17
title: Feedback simple beta
lifecycle: active
created: '2026-05-11'
updated: '2026-05-11'
aliases:
  - RELEASE-0.1.0-beta.17
tags:
  - product-brain
  - release
  - beta
  - feedback
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.17
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.17 — Feedback simple beta

## Estado

Active.

## Rama de release

`release/0.1.0-beta.17`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.17` es un corte pequeno para abrir una via de feedback cualitativo dentro de la app.

## Objetivo de la release

Permitir que usuarios de beta envien feedback desde Cachés sin introducir analitica externa ni proveedores nuevos.

## Alcance funcional

- Formulario global de feedback desde la TopBar.
- Comentario obligatorio, area opcional y consentimiento explicito.
- Persistencia en la tabla propia `feedback` de Supabase.
- RLS endurecida para insercion autenticada propia.
- Decision documentada: PostHog queda diferido a una release futura si hace falta analitica real.

## Scope

- [[../issues/CACH-0052|CACH-0052]] — Formulario simple de feedback beta.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0052|CACH-0052]] | Formulario simple de feedback beta | done | `release/0.1.0-beta.17` |

## Fuera de alcance

- PostHog SDK.
- Plausible.
- Tabla `usage_events`.
- Dashboard interno de metricas.
- Session replay, heatmaps, autocapture o tracking de navegacion.

## Riesgos

- La TopBar puede quedar justa en 320 px si el boton global compite con titulo y salida.
- La politica de RLS debe impedir inserts anonimos y spoofing de `user_id`.
- El texto libre puede contener datos sensibles si la UI no advierte de forma clara.

## Decisiones relacionadas

- [[../decisions/ADR-0015-feedback-simple-posthog-futuro|ADR-0015]] — Feedback simple propio y PostHog diferido.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release definida
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan cerradas o listas para release
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:check`
- [x] `npm run pb:guard`
- [x] Revision responsive del boton/modal en mobile y desktop
- [x] Revision RLS de la migracion local

## Checklist de salida

- [ ] PR `release/0.1.0-beta.17` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.17` eliminada si aplica
- [ ] Release notes actualizadas
- [x] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Boton global de feedback y modal para enviar comentarios de beta.

### Cambiado

- El feedback propio queda endurecido para inserts autenticados con consentimiento.

### Corregido

- No aplica por ahora.

### Eliminado

- Comentario pendiente de Plausible en `index.html`.

### Tecnico

- `CACH-0052` se implementa como scope unico de `RELEASE-0.1.0-beta.17`.
- PostHog queda fuera del bundle y documentado como migracion futura.
- Validacion local completada: lint, tests, build, Product Brain, release status y diff check.
- Smoke visual/funcional con Playwright en 320 px y 1280 px usando sesion Supabase mockeada.

## Resultado final

Pendiente hasta cerrar la release.
