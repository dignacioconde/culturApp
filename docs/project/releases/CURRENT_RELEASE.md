---
schema_version: 2
kind: release_status
id: PB-CURRENT-RELEASE
title: Current Release
lifecycle: active
created: '2026-05-05'
updated: '2026-05-11'
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

[[RELEASE-0.1.0-beta.17|RELEASE-0.1.0-beta.17]] — Feedback simple beta.

## Rama activa

`release/0.1.0-beta.17`

## Últimos cortes

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver [[RELEASE-0.1.0-beta.14]].

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver [[RELEASE-0.1.0-beta.15]].

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver [[RELEASE-0.1.0-beta.16]].

## Scope actual

Beta 17 queda activa para capturar feedback cualitativo desde la app con formulario propio en Supabase, sin PostHog, Plausible ni analitica de eventos.

Issues incluidas:

- [[../issues/CACH-0052|CACH-0052]] — Formulario simple de feedback beta.

## Regla de trabajo para esta release

Mantener el corte acotado a feedback cualitativo simple y hardening de RLS. Cualquier analitica de producto, PostHog o dashboard de metricas requiere issue/ADR propia posterior.

## Como cerrar esta release

Abrir PR `release/0.1.0-beta.17` -> `main`, validar CI, mergear, crear tag `v0.1.0-beta.17` si aplica y verificar produccion en `https://app.caches.es`.
