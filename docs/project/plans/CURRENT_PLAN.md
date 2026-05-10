---
schema_version: 2
kind: plan
id: PB-CURRENT-PLAN
title: Current Plan
lifecycle: active
created: '2026-05-05'
updated: '2026-05-10'
aliases:
  - Current Plan
tags:
  - product-brain
  - plan
  - current
generated: false
---
# Current Plan

## Foco actual

Beta 14 queda cerrada. Beta 15 se usa para cerrar el dominio publico de app y multientorno minimo antes de seguir con navegacion movil.

## Release activa

Release activa: [[../releases/RELEASE-0.1.0-beta.15|RELEASE-0.1.0-beta.15]] — Dominio publico de app.

Últimos cortes:

[[../releases/RELEASE-0.1.0-beta.10|RELEASE-0.1.0-beta.10]] — emails transaccionales beta con Brevo.

Beta 11: [[../releases/RELEASE-0.1.0-beta.11|RELEASE-0.1.0-beta.11]] — guardrails de agentes.

Beta 12: [[../releases/RELEASE-0.1.0-beta.12|RELEASE-0.1.0-beta.12]] — pulido proyecto-evento y borrados seguros.

Beta 13: [[../releases/RELEASE-0.1.0-beta.13|RELEASE-0.1.0-beta.13]] — dashboard movil y estado Ahora.

## Cambios consolidados desde beta 10

- Beta 10 queda como corte técnico cerrado: invitaciones por Brevo Edge Function, auditoría y flujo de confirmación de email preparados.
- Beta 11 queda acotada a guardrails de agentes y no absorbe email ni UX de producto.
- Beta 12 cierra un paquete de codigo visible: `CACH-0044`, `CACH-0045` y `CACH-0043`.
- Beta 13 vuelve a ser un corte normal de desarrollo: `CACH-0041` simplifica el dashboard movil y estado "Ahora".
- Beta 14 cierra `CACH-B0020`: email/DNS/Brevo/Supabase SMTP definitivo con `caches.es`.
- Beta 15 cierra `CACH-0051`: dominio publico canonico `app.caches.es`, Vercel, Supabase Auth redirects y Edge Function `APP_URL`.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Cerrar beta 15 con dominio publico de app antes de retomar navegacion movil.
3. Mantener navegacion movil como siguiente slice candidata, fuera de este corte.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Cerrar PR/tag de beta 15 y verificar produccion en `https://app.caches.es`.

## Siguiente release candidata

Tras beta 15, retomar [[../issues/CACH-0042|CACH-0042]] como slice candidata de navegacion movil o abrir el siguiente corte si Lovable redefine la interfaz.
