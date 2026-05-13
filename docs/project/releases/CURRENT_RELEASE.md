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

No hay release activa ahora mismo.

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

`RELEASE-0.1.0-beta.19` — contratantes estructurados. Ver [[RELEASE-0.1.0-beta.19]].

## Scope actual

Pendiente de seleccionar. Beta 19 queda cerrada como primer slice seguro de `CACH-B0004`; el siguiente corte candidato puede ser liquidación neta gasto-ingreso o una release de hardening antes de abrir facturación completa.

Issues incluidas:

- [[../issues/CACH-0057|CACH-0057]] — Definir modelo mínimo de contratantes.
- [[../issues/CACH-0058|CACH-0058]] — Versionar schema de contratantes y RLS.
- [[../issues/CACH-0059|CACH-0059]] — Integrar hooks y portabilidad de contratantes.
- [[../issues/CACH-0060|CACH-0060]] — Añadir UX mínima de contratantes en proyectos y eventos.
- [[../issues/CACH-0061|CACH-0061]] — Verificar regresión financiera y cierre técnico beta 19.

## Regla de trabajo para la próxima release

Definir primero el scope en un documento de release y asociar issues `CACH-*` antes de crear rama. No abrir liquidación neta, facturación completa o CRM sin criterios de aceptación y validación de datos/RLS.

## Como cerrar esta release

Beta 19 se cierra mediante PR única `release/0.1.0-beta.19` -> `main`, CI verde, `pb:guard`, `release:sync-check`, verificación remota Supabase, tag `v0.1.0-beta.19` y smoke de producción sobre `https://app.caches.es` tras merge.
