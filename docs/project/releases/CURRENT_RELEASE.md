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

`RELEASE-0.1.0-beta.23` — tokens Lovable para sistema visual. Ver [[RELEASE-0.1.0-beta.23]].

## Rama activa

`release/0.1.0-beta.23`

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

Beta 23 es un corte pequeno de sistema visual para alinear Cachés con el export Lovable `artistic-rhythm` sin importar su stack completo ni redisenar pantallas.

Issues incluidas:

- [[../issues/CACH-0076|CACH-0076]] — Alinear tokens de diseno con export Lovable.

## Regla de trabajo para esta release

Solo entra trabajo de compatibilidad de tokens/estilos para `CACH-0076`. Cualquier rediseño visible, dark mode, import de componentes Lovable o cambio funcional requiere issue nueva.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.23` -> `main`, validar `lint`, `build`, `pb:guard`, `release:status` y `git diff --check`. Si se mergea, crear tag `v0.1.0-beta.23` desde `main` y actualizar esta nota a "No hay release activa".
