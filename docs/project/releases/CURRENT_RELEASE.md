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

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver [[RELEASE-0.1.0-beta.16]].

`RELEASE-0.1.0-beta.17` — feedback simple beta. Ver [[RELEASE-0.1.0-beta.17]].

`RELEASE-0.1.0-beta.18` — cierre P1 UX core. Ver [[RELEASE-0.1.0-beta.18]].

## Scope actual

Beta 18 queda cerrada. La app incorpora notas contextuales editables, quick forms financieros más ergonómicos y mantiene calendario de eventos separado del plan anual de proyectos.

Issues incluidas:

- [[../issues/CACH-0054|CACH-0054]] — Editar notas desde detalles de proyecto y evento.
- [[../issues/CACH-0055|CACH-0055]] — Pulido financiero movil sin cambiar formulas.
- [[../issues/CACH-0056|CACH-0056]] — Calendario de eventos y plan anual separados.

## Regla de trabajo para esta release

No iniciar trabajo nuevo desde una release activa hasta activar explicitamente el siguiente corte.

## Como cerrar esta release

Cerrada mediante PR #104. Tag `v0.1.0-beta.18` y smoke de produccion sobre `https://app.caches.es` tras merge a `main`.
