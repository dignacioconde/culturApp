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
release_current: false
---
# Current Release

## Release activa

No hay release activa.

## Rama activa

No aplica.

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver [[RELEASE-0.1.0-beta.15]].

## Scope actual

Beta 15 queda cerrada. El dominio publico canonico de la app es `https://app.caches.es`; Vercel, `VITE_APP_URL`, Supabase Auth redirects y Edge Function `send-beta-invite` quedaron alineados con ese dominio.

Issues cerradas:

- [[../issues/CACH-0051|CACH-0051]] — Dominio publico de app y estrategia multientorno.

## Regla de trabajo para esta release

No iniciar trabajo nuevo desde una release activa hasta activar explicitamente el siguiente corte. La siguiente candidata puede retomar [[../issues/CACH-0042|CACH-0042]] o ajustarse al rediseño Lovable.

## Como cerrar esta release

Cerrada mediante PR #96, tag `v0.1.0-beta.15` y smoke de produccion sobre `https://app.caches.es`.
