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

`RELEASE-0.1.0-beta.21` — primera sesion guiada y PWA instalable. Ver [[RELEASE-0.1.0-beta.21]].

`RELEASE-0.1.0-beta.22` — historial de novedades beta. Ver [[RELEASE-0.1.0-beta.22]].

## Scope actual

Sin scope activo. Beta 22 queda cerrada como corte ligero de confianza beta: historial de novedades user friendly y guardrail para no lanzar features sin release asignada.

Issues incluidas:

- No aplica hasta abrir nueva release.

## Regla de trabajo para esta release

No hay release activa. Las tareas fuera de release usan el flujo ligero desde `main`; si se abre una nueva beta, documentar primero release, scope, rama y criterios.

## Como cerrar esta release

Beta 22 queda cerrada mediante PR #109, CI verde, tag `v0.1.0-beta.22` y smoke postdeploy basico. No hay release activa hasta abrir el siguiente corte.
