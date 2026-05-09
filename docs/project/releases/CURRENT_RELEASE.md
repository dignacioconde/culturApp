---
schema_version: 2
kind: release_status
id: PB-CURRENT-RELEASE
title: Current Release
lifecycle: active
created: '2026-05-05'
updated: '2026-05-09'
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

## Scope actual

Beta 14 cerrada. El email/remitente definitivo de Cachés queda operativo con `caches.es`, Brevo, Edge Function y Supabase Auth SMTP validados.

Issues cerradas:

- [[../issues/CACH-B0020|CACH-B0020]] — Validar dominio de email transaccional y cambiar remitentes definitivos.

## Regla de trabajo para esta release

No iniciar trabajo nuevo desde una release activa hasta activar explicitamente el siguiente corte. La siguiente candidata documentada es [[RELEASE-0.1.0-beta.15|RELEASE-0.1.0-beta.15]].

## Como cerrar esta release

Cerrada mediante PR #94, tag `v0.1.0-beta.14` y smoke de produccion sobre `https://culturapp-rho.vercel.app`.
