---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.21
title: Primera sesion guiada y PWA instalable
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.21
tags:
  - product-brain
  - release
  - beta
  - onboarding
  - pwa
generated: false
release_phase: released
release_current: false
release_branch: release/0.1.0-beta.21
release_tag: v0.1.0-beta.21
release_pr: https://github.com/dignacioconde/culturApp/pull/108
---
# RELEASE-0.1.0-beta.21 — Primera sesion guiada y PWA instalable

## Estado

Released.

## Rama de release

`release/0.1.0-beta.21`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.21` es un corte pequeno de confianza movil antes de retomar liquidacion neta, push, notificaciones u offline de datos.

## Objetivo de la release

Mejorar la primera sesion de usuarios beta con un tutorial mas completo, corregir el consentimiento que seguia anclado a beta 8 y crear una PWA instalable basica para que Cachés pueda abrirse desde el movil como app.

## Alcance funcional

- Consentimiento de uso versionado por texto aceptado, no por beta historica.
- Tutorial revisitable con modelo mental de trabajos, proyectos, eventos, cobros, gastos, contratantes, exportacion y uso movil.
- Checklist compacto para cuentas vacias o casi vacias.
- PWA instalable basica con manifest, iconos, meta tags y service worker limitado al app shell/assets.

## Scope

- [[../issues/CACH-0064|CACH-0064]] — Corregir version y copy de consentimiento beta.
- [[../issues/CACH-0065|CACH-0065]] — Ampliar onboarding como tutorial revisitable.
- [[../issues/CACH-0066|CACH-0066]] — Checklist compacto de primeros pasos.
- [[../issues/CACH-0067|CACH-0067]] — PWA instalable basica y navegacion standalone.
- [[../issues/CACH-0068|CACH-0068]] — Verificacion responsive PWA y cierre beta 21.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0064|CACH-0064]] | Corregir version y copy de consentimiento beta | done | `release/0.1.0-beta.21` |
| [[../issues/CACH-0065|CACH-0065]] | Ampliar onboarding como tutorial revisitable | done | `release/0.1.0-beta.21` |
| [[../issues/CACH-0066|CACH-0066]] | Checklist compacto de primeros pasos | done | `release/0.1.0-beta.21` |
| [[../issues/CACH-0067|CACH-0067]] | PWA instalable basica y navegacion standalone | done | `release/0.1.0-beta.21` |
| [[../issues/CACH-0068|CACH-0068]] | Verificacion responsive PWA y cierre beta 21 | done | `release/0.1.0-beta.21` |

## Fuera de alcance

- Liquidacion neta, facturacion, CRM o siguientes slices de `CACH-B0004`.
- Push, notificaciones, recordatorios, resumen semanal y preferencias de alertas.
- Offline de datos, mutaciones offline o resolucion de conflictos.
- Supabase remoto, schema, RLS o nuevas tablas.

## Riesgos

- La instalacion PWA real debe verificarse en iPhone Safari y Android Chrome tras deploy, porque Playwright local solo cubre manifest/app shell.
- El service worker no debe cachear datos de usuario ni llamadas Supabase.
- El tutorial debe seguir siendo util sin convertirse en una pantalla larga que bloquee la primera sesion.
- El checklist no debe molestar a usuarios con actividad real.

## Decisiones relacionadas

- [[../issues/CACH-B0006|CACH-B0006]] — Onboarding y acceso beta.
- [[../issues/CACH-B0008|CACH-B0008]] — PWA notificaciones y offline.
- [[../context/beta-readiness-risk-map-20260504|Beta readiness y mapa de riesgos]].

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run test:e2e`
- [x] `npm run pb:check`
- [x] `npm run pb:guard`
- [x] Smoke local de build con `npm run smoke:postdeploy -- --url=http://127.0.0.1:4173`
- [x] Revision responsive 320, 390, 768 y desktop
- [x] Smoke manual iPhone Safari y Android Chrome queda documentado como pendiente humano tras deploy

## Checklist de salida

- [x] PR `release/0.1.0-beta.21` -> `main` abierta
- [x] CI en verde
- [x] PR mergeada en `main`
- [x] Tag creado desde `main` si aplica
- [x] Produccion verificada o marcada no aplica
- [x] Rama remota `release/0.1.0-beta.21` eliminada si aplica
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Tutorial ampliado y revisitable desde Ajustes.
- Checklist compacto de primeros pasos para cuentas nuevas.
- Manifest, iconos PWA y service worker de app shell.

### Cambiado

- Copy y version de consentimiento dejan de referirse a beta 8.
- Viewport de la app anade `viewport-fit=cover` para experiencia instalada.

### Corregido

- `usage_consent_version` ya no guarda `beta-8`.

### Eliminado

- No aplica por ahora.

### Tecnico

- Service worker registrado solo en build de produccion.
- No se cachean llamadas remotas ni datos de Supabase.

## Resultado final

Release cerrada mediante PR #108 a `main`. Tag `v0.1.0-beta.21` preparado desde `main`; produccion verificada con smoke de rutas SPA y assets PWA en `https://app.caches.es`. La instalacion real desde iPhone Safari y Android Chrome queda como smoke manual humano, porque requiere dispositivos/navegadores reales fuera del entorno del agente.
