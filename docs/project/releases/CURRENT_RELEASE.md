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

[[RELEASE-0.1.0-beta.19|RELEASE-0.1.0-beta.19]] — Contratantes estructurados.

## Rama activa

`release/0.1.0-beta.19`

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

Beta 19 abre `CACH-B0004` por el slice seguro de contratantes estructurados. El objetivo es introducir contratantes reutilizables para proyectos y eventos sin cambiar fórmulas financieras ni implementar facturación completa.

Issues incluidas:

- [[../issues/CACH-0057|CACH-0057]] — Definir modelo mínimo de contratantes.
- [[../issues/CACH-0058|CACH-0058]] — Versionar schema de contratantes y RLS.
- [[../issues/CACH-0059|CACH-0059]] — Integrar hooks y portabilidad de contratantes.
- [[../issues/CACH-0060|CACH-0060]] — Añadir UX mínima de contratantes en proyectos y eventos.
- [[../issues/CACH-0061|CACH-0061]] — Verificar regresión financiera y cierre técnico beta 19.

## Regla de trabajo para esta release

Solo entran cambios necesarios para contratantes estructurados y su verificación. Liquidación neta, facturas, CRM, multiusuario, PWA, notificaciones, features Pro y cambios de fórmulas financieras quedan fuera.

## Como cerrar esta release

Cerrar mediante PR única `release/0.1.0-beta.19` -> `main`, CI verde, `pb:guard`, `release:sync-check`, verificación remota Supabase cuando aplique, tag `v0.1.0-beta.19` y smoke de producción sobre `https://app.caches.es` tras merge.
