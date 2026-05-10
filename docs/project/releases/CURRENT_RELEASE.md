---
schema_version: 2
kind: release_status
id: PB-CURRENT-RELEASE
title: Current Release
lifecycle: active
created: '2026-05-05'
updated: '2026-05-10'
aliases:
  - Current Release
tags:
  - product-brain
  - release
  - current
generated: false
release_current: true
---
# Current Release

## Release activa

[[RELEASE-0.1.0-beta.15|RELEASE-0.1.0-beta.15]] — Dominio publico de app.

## Rama activa

`release/0.1.0-beta.15`

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

## Scope actual

Beta 15 prepara el cierre de [[../issues/CACH-0051|CACH-0051]]: dominio publico canonico `https://app.caches.es`, variables de entorno, Supabase Auth redirects y Edge Function `send-beta-invite`.

Issues incluidas:

- [[../issues/CACH-0051|CACH-0051]] — Dominio publico de app y estrategia multientorno.

## Regla de trabajo para esta release

No anadir navegacion movil, redisenos Lovable ni cambios de schema. Beta 15 se limita al dominio publico de app y configuracion multientorno minima.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.15` -> `main`, esperar CI verde, mergear, crear tag `v0.1.0-beta.15` desde `main` y verificar produccion en `https://app.caches.es`.
