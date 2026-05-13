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

`RELEASE-0.1.0-beta.20` — hardening UX móvil financiera. Ver [[RELEASE-0.1.0-beta.20]].

## Rama activa

`release/0.1.0-beta.20`

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

Hardening pequeño antes de abrir liquidación neta o facturación completa. El corte se limita a consolidar la deuda residual de `CACH-B0002`: un patrón compartido de barra contextual móvil en detalles de proyecto y evento.

Issues incluidas:

- [[../issues/CACH-0063|CACH-0063]] — Unificar BottomActionBar en detalles.

## Regla de trabajo para esta release

Las ramas de tarea salen de `release/0.1.0-beta.20`. No tocar fórmulas financieras, hooks públicos, schema, RLS, Supabase remoto, liquidación neta, facturación ni CRM. La verificación visual debe cubrir `/events/:id` y `/projects/:id` en 320 px, 390 px, 768 px y desktop.

## Como cerrar esta release

Beta 20 se cierra mediante PR única `release/0.1.0-beta.20` -> `main`, CI verde, `npm run lint`, `npm run build`, `npm run pb:guard`, `npm run release:sync-check` y smoke visual de los detalles afectados.
