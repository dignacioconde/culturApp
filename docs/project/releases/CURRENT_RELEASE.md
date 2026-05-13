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

`RELEASE-0.1.0-beta.23` — tokens Lovable y visual acotada. Ver [[RELEASE-0.1.0-beta.23]].

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

Beta 23 es un corte pequeno de sistema visual para alinear Cachés con el export Lovable `artistic-rhythm`: tokens base ya integrados y visual acotada en pantallas core, sin importar su stack completo ni abrir funcionalidades nuevas.

Issues incluidas:

- [[../issues/CACH-0076|CACH-0076]] — Alinear tokens de diseno con export Lovable.
- [[../issues/CACH-0077|CACH-0077]] — Aplicar tokens Lovable al shell y navegacion.
- [[../issues/CACH-0078|CACH-0078]] — Pulir Trabajos y listas con visual Lovable acotada.
- [[../issues/CACH-0079|CACH-0079]] — Pulir Dashboard financiero con visual Lovable acotada.
- [[../issues/CACH-0080|CACH-0080]] — Inventariar gaps funcionales Lovable fuera de beta 23.

## Regla de trabajo para esta release

Solo entra trabajo de tokens y visual acotada para `CACH-0076`, `CACH-0077`, `CACH-0078`, `CACH-0079` y la frontera documental `CACH-0080`. Quedan fuera: import shadcn/Radix/TanStack, Supabase/RLS/data, formulas financieras, calendario custom, dark mode, command palette, FAB/sheets, origin-aware back nav, busqueda/tab de ano en Work, settings fiscal/preferencias nuevas, notificaciones y soporte/privacidad/about.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.23` -> `main`, validar `lint`, `test`, `build`, `pb:guard`, `release:status`, `verify:pr`, checks visuales de las rutas tocadas y `git diff --check`. Si se mergea, crear tag `v0.1.0-beta.23` desde `main` y actualizar esta nota a "No hay release activa".
