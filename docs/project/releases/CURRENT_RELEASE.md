---
schema_version: 2
kind: release_status
id: PB-CURRENT-RELEASE
title: Current Release
lifecycle: active
created: '2026-05-05'
updated: '2026-05-20'
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

[[RELEASE-0.1.0-beta.25|RELEASE-0.1.0-beta.25]] — Liquidacion neta minima.

## Rama activa

`release/0.1.0-beta.25`

## Estado

Activa en QA local. Siguiente corte de `CACH-B0004` tras contratantes estructurados, acotado a liquidacion neta minima sin facturacion completa.

Implementacion preparada: contrato, migracion local/remota, helpers, portabilidad y UX minima. PR #114 abierta como draft hacia `main`; pendiente antes de publication-ready: CI, merge, tag y publicacion.

## Scope

- [[../issues/CACH-0099|CACH-0099]] — Preparar Beta 25 de liquidacion neta.
- [[../issues/CACH-0100|CACH-0100]] — Definir contrato de liquidacion neta minima.
- [[../issues/CACH-0101|CACH-0101]] — Versionar schema y RLS de gastos repercutibles.
- [[../issues/CACH-0102|CACH-0102]] — Integrar hooks y helpers de liquidacion neta.
- [[../issues/CACH-0103|CACH-0103]] — UX minima de liquidacion en detalles.
- [[../issues/CACH-0104|CACH-0104]] — QA financiera y cierre de Beta 25.

## Reglas de trabajo

- Las ramas de tarea salen de `release/0.1.0-beta.25`.
- No empujar rama remota ni tocar Supabase remoto sin confirmacion humana.
- Los slices de datos/finanzas requieren SDD, `pb:ready-check` antes de mover a `ready` y verificacion RLS.
- El dashboard mensual conserva `Caja del mes` y `Trabajos`; no convertir gastos/neto en KPI principal de este corte.
- `cobro bruto/hora` mantiene su regla actual: solo ingresos cobrados con `event_id` y horas de eventos.

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

`RELEASE-0.1.0-beta.23` — tokens Lovable y visual total. Ver [[RELEASE-0.1.0-beta.23]].

`RELEASE-0.1.0-beta.24` — calendario claro y sincronización suscribible. Ver [[RELEASE-0.1.0-beta.24]].

## Siguiente corte

Pendiente tras cerrar Beta 25.
