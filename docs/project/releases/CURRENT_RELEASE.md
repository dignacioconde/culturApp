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

[[RELEASE-0.1.0-beta.18|RELEASE-0.1.0-beta.18]] — Cierre P1 UX core.

## Rama activa

`release/0.1.0-beta.18`

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver [[RELEASE-0.1.0-beta.15]].

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver [[RELEASE-0.1.0-beta.16]].

`RELEASE-0.1.0-beta.17` — feedback simple beta. Ver [[RELEASE-0.1.0-beta.17]].

## Scope actual

Beta 18 cierra P1 visible de UX core sin abrir modelo financiero nuevo.

Issues incluidas:

- [[../issues/CACH-0054|CACH-0054]] — Editar notas desde detalles de proyecto y evento.
- [[../issues/CACH-0055|CACH-0055]] — Pulido financiero movil sin cambiar formulas.
- [[../issues/CACH-0056|CACH-0056]] — Calendario de eventos y plan anual separados.

## Regla de trabajo para esta release

Solo entra trabajo vinculado al scope de beta 18. `CACH-B0004`, contratantes, facturacion, gastos repercutibles, liquidacion neta, migraciones, RLS y cambios de formulas financieras quedan fuera.

## Como cerrar esta release

Pendiente: validar issues incluidas, abrir PR `release/0.1.0-beta.18` -> `main`, esperar CI verde, mergear, etiquetar y verificar produccion si aplica.
