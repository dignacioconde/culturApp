---
schema_version: 2
kind: release_status
id: PB-CURRENT-RELEASE
title: Current Release
lifecycle: active
created: '2026-05-05'
updated: '2026-05-13'
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

No hay release activa en este momento.

## Rama activa

No aplica. Las siguientes tareas pequeñas salen de `main` salvo que se abra una nueva release.

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver [[RELEASE-0.1.0-beta.15]].

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver [[RELEASE-0.1.0-beta.16]].

`RELEASE-0.1.0-beta.17` — feedback simple beta. Ver [[RELEASE-0.1.0-beta.17]].

`RELEASE-0.1.0-beta.18` — cierre P1 UX core. Ver [[RELEASE-0.1.0-beta.18]].

`RELEASE-0.1.0-beta.19` — contratantes estructurados. Ver [[RELEASE-0.1.0-beta.19]].

`RELEASE-0.1.0-beta.20` — hardening UX móvil financiera. Ver [[RELEASE-0.1.0-beta.20]].

## Scope actual

Sin scope activo. Beta 20 quedó cerrada con `CACH-0063`: patrón compartido de barra contextual móvil en detalles de proyecto y evento.

Issues incluidas:

- No aplica hasta abrir nueva release.

## Regla de trabajo para esta release

No hay release activa. Las tareas fuera de release usan el flujo ligero desde `main`; si se abre una nueva beta, documentar primero release, scope, rama y criterios.

## Como cerrar esta release

Beta 20 ya está cerrada mediante PR #106, CI verde, tag `v0.1.0-beta.20` y smoke postdeploy básico de rutas SPA.
