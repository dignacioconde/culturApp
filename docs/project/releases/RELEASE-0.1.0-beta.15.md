---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.15
title: Dominio publico de app
lifecycle: active
created: '2026-05-09'
updated: '2026-05-10'
aliases:
  - RELEASE-0.1.0-beta.15
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.15
release_tag: v0.1.0-beta.15
release_pr: null
---
# RELEASE-0.1.0-beta.15 — Dominio publico de app

## Estado

Ready for PR.

## Rama de release

`release/0.1.0-beta.15`

## Tag

`v0.1.0-beta.15`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.15` cierra el cambio de dominio publico de app pendiente tras beta 14.

## Objetivo de la release

Dejar `https://app.caches.es` como dominio publico canonico de Cachés para app, invitaciones beta y confirmaciones de Supabase Auth.

## Alcance funcional

- Asignar `app.caches.es` al proyecto Vercel `culturapp`.
- Configurar DNS en Hostinger con `CNAME app -> cname.vercel-dns.com`.
- Configurar `VITE_APP_URL=https://app.caches.es` en Vercel para production, preview y development.
- Actualizar fallback de confirmacion Auth en codigo a `https://app.caches.es`.
- Actualizar secret `APP_URL` de `send-beta-invite`.
- Actualizar Supabase Auth URL Configuration con Site URL canonico y redirects permitidos.
- Documentar estrategia minima prod/staging/local sin crear segundo proyecto Supabase todavia.

## Scope

- [[../issues/CACH-0051|CACH-0051]] — Dominio publico de app y estrategia multientorno.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0051|CACH-0051]] | Dominio publico de app y estrategia multientorno | Done | `chore/CACH-0051-app-domain-multienv` |

## Fuera de alcance

- Navegacion movil inferior, que vuelve a quedar como slice futura en [[../issues/CACH-0042|CACH-0042]].
- Rediseno completo de UI/Lovable.
- Migrar datos entre proyectos Supabase.
- Crear un segundo proyecto Supabase persistente para staging.
- Cambiar DNS, Brevo, SPF, DKIM, DMARC o remitentes de email transaccional, cerrado en `RELEASE-0.1.0-beta.14`.

## Riesgos

- No cambiar el dominio raiz `caches.es`: el apex sigue gestionado en Hostinger.
- No tocar registros MX/SPF/DKIM/DMARC de email.
- No considerar `caches.es` misconfigured como bloqueo de `app.caches.es`; validar el subdominio por project domain y smoke.
- Mantener `culturapp-rho.vercel.app` como alias temporal para rollback y compatibilidad.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release definida
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan cerradas o con resultado documentado
- [x] Cambios preparados en rama de tarea
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] Estrategia de entorno documentada

## Checklist de estabilizacion

- [x] DNS autoritativo de Hostinger verificado
- [x] Vercel project domain verificado
- [x] `VITE_APP_URL` configurado en Vercel
- [x] Edge Function `APP_URL` configurado en Supabase
- [x] Supabase Auth URL Configuration actualizada
- [x] Smoke de rutas SPA en `https://app.caches.es`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`

## Checklist de salida

- [ ] PR `release/0.1.0-beta.15` -> `main` abierta
- [ ] CI en verde
- [ ] Revision aprobada
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main`
- [ ] Produccion verificada
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Current Release actualizado para preparar el corte
- [x] Backlog actualizado

## Release notes

### Aniadido

- Dominio publico canonico `https://app.caches.es` para la app.
- Nota de contexto `deploy-environments-20260510` con estrategia minima de dominio y entornos.

### Cambiado

- `VITE_APP_URL` pasa a `https://app.caches.es` en Vercel.
- Confirmaciones de Supabase Auth pasan a usar `https://app.caches.es` como fallback canonico.
- `send-beta-invite` pasa a construir enlaces con `https://app.caches.es`.

### Corregido

- Se elimina la dependencia operativa de `https://culturapp-rho.vercel.app` como URL canonica temporal.

### Eliminado

- No aplica.

### Tecnico

- Vercel sirve `app.caches.es` mediante CNAME `cname.vercel-dns.com`.
- Supabase Auth queda con `Site URL` canonico y redirects permitidos para app, alias temporal y local.
- `culturapp-rho.vercel.app` se mantiene como alias temporal heredado.

## Resultado final

Pendiente de PR, merge, tag y smoke posterior a produccion.
