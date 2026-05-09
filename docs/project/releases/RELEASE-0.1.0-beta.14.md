---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.14
title: Email definitivo transaccional
lifecycle: active
created: '2026-05-08'
updated: '2026-05-09'
aliases:
  - RELEASE-0.1.0-beta.14
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.14
release_tag: null
release_pr: 'https://github.com/dignacioconde/culturApp/pull/94'
---
# RELEASE-0.1.0-beta.14 — Email definitivo transaccional

## Estado

Active, lista para PR `release/0.1.0-beta.14` -> `main`.

## Rama de release

`release/0.1.0-beta.14`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.14` queda reservado para la operativa manual de email definitivo tras el corte de desarrollo normal de beta 13.

## Objetivo de la release

Dejar un email/remitente definitivo real de Cachés operativo para emails transaccionales, eliminando el remitente personal temporal confirmado en Brevo.

## Alcance funcional

- Crear o activar el email/alias real de Cachés.
- Validar dominio/remitente en Brevo.
- Configurar DNS SPF, DKIM y DMARC requeridos.
- Actualizar remitentes de Edge Function y Supabase Auth SMTP solo tras validacion.
- Verificar invitacion beta y confirmacion de cuenta con smoke test real.

## Scope

- [[../issues/CACH-B0020|CACH-B0020]] — Validar dominio de email transaccional y cambiar remitentes definitivos.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0020|CACH-B0020]] | Validar dominio de email transaccional y cambiar remitentes definitivos | Done | `release/0.1.0-beta.14` |

## Fuera de alcance

- Cambios de UX de dashboard movil, cubiertos por `RELEASE-0.1.0-beta.13`.
- Cambios de UX de proyecto-evento, cubiertos por `RELEASE-0.1.0-beta.12`.
- Newsletter, CRM, automatizaciones y redisenos de plantillas.
- Cambios de tooling de agentes o verificadores.
- Dominio publico de app (`app.caches.es`) y configuracion multientorno, trazados en [[../issues/CACH-0051|CACH-0051]].

## Riesgos

- No cambiar remitentes a un email de Cachés hasta que exista y Brevo lo marque como validado.
- No exponer secretos, tokens, SMTP ni valores de `.env.local`.
- No ejecutar mutaciones de produccion sin confirmacion humana explicita.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits preparados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] DNS verificado
- [x] Brevo valida dominio/remitente
- [x] Edge Function usa remitente definitivo
- [x] Supabase Auth SMTP usa remitente definitivo
- [x] Invitacion beta verificada
- [x] Confirmacion de cuenta verificada
- [x] Documentacion actualizada

## Checklist de salida

- [x] PR `release/0.1.0-beta.14` -> `main` abierta si hay cambios versionados
- [ ] CI en verde si aplica
- [ ] Revision aprobada
- [ ] PR mergeada en `main` si aplica
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Current Release actualizado
- [ ] Backlog actualizado

## Release notes

### Aniadido

- Dominio de email definitivo `caches.es`.
- Buzon real `contacto@caches.es` y alias transaccional `no-reply@caches.es`.

### Cambiado

- Invitaciones beta y confirmaciones de Supabase Auth pasan a usar `no-reply@caches.es` como remitente visible.
- Los redirects de confirmacion de Supabase Auth usan `VITE_APP_URL` con fallback temporal a `https://culturapp-rho.vercel.app`.

### Corregido

- Evitado que registros hechos desde local generen confirmaciones Auth hacia `localhost`.

### Eliminado

- Remitente personal temporal como remitente operativo.

### Tecnico

- `caches.es` autenticado en Brevo y `send-beta-invite` desplegada con `no-reply@caches.es` como remitente y `contacto@caches.es` como reply-to.
- `CACH-0051` captura el trabajo pendiente de dominio publico de app y multientorno.

## Resultado final

Release activa y lista para PR a `main`. Email transaccional definitivo verificado; dominio publico de app y multientorno quedan fuera de scope en `CACH-0051`.
