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

[[RELEASE-0.1.0-beta.16|RELEASE-0.1.0-beta.16]] — Navegación inferior móvil.

## Rama activa

`release/0.1.0-beta.16`

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver [[RELEASE-0.1.0-beta.15]].

## Scope actual

Beta 16 prepara el cierre de [[../issues/CACH-0042|CACH-0042]]: racionalizar la navegacion inferior movil manteniendo accesos claros, targets tactiles razonables y una barra que quepa en 320 px.

Issues incluidas:

- [[../issues/CACH-0042|CACH-0042]] — Racionalizar navegacion inferior.

## Regla de trabajo para esta release

No anadir rediseño Lovable, cambios de rutas, autenticacion, permisos, Supabase, schema, entorno o produccion. Beta 16 se limita a navegacion inferior movil.

## Como cerrar esta release

Implementar `CACH-0042` desde `feat/CACH-0042-bottom-navigation`, validar lint/build y revisar mobile en 320, 375, 390 y 768 px. Despues, abrir PR `release/0.1.0-beta.16` -> `main`, esperar CI verde, mergear y crear tag `v0.1.0-beta.16` desde `main` si aplica.
