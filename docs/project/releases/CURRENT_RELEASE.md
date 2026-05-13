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

`RELEASE-0.1.0-beta.21` — primera sesion guiada y PWA instalable. Ver [[RELEASE-0.1.0-beta.21]].

## Rama activa

`release/0.1.0-beta.21`.

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

Beta 21 es un corte pequeno de confianza movil: tutorial ampliado, consentimiento actualizado y PWA instalable basica.

Issues incluidas:

- [[../issues/CACH-0064|CACH-0064]] — Corregir version y copy de consentimiento beta.
- [[../issues/CACH-0065|CACH-0065]] — Ampliar onboarding como tutorial revisitable.
- [[../issues/CACH-0066|CACH-0066]] — Checklist compacto de primeros pasos.
- [[../issues/CACH-0067|CACH-0067]] — PWA instalable basica y navegacion standalone.
- [[../issues/CACH-0068|CACH-0068]] — Verificacion responsive PWA y cierre beta 21.

## Regla de trabajo para esta release

La beta 21 no absorbe liquidacion neta, push, notificaciones, recordatorios ni offline de datos. Es un corte acotado de primera sesion y PWA instalable.

## Como cerrar esta release

Cerrar cuando pasen lint, tests, build, e2e, Product Brain y la verificacion manual PWA en iPhone Safari y Android Chrome tras deploy.
