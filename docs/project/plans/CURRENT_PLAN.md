---
schema_version: 2
kind: plan
id: PB-CURRENT-PLAN
title: Current Plan
lifecycle: active
created: '2026-05-05'
updated: '2026-05-09'
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

Beta 14 queda cerrada. Preparar el siguiente corte sin mezclarlo con el pendiente de dominio publico de app y multientorno.

## Release activa

No hay release activa. [[../releases/RELEASE-0.1.0-beta.15|RELEASE-0.1.0-beta.15]] queda como siguiente candidata draft.

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

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener fuera de beta 14 el dominio publico de app y multientorno, trazado en [[../issues/CACH-0051|CACH-0051]].
3. Activar explicitamente el siguiente corte antes de implementar trabajo de beta 15.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Elegir siguiente foco: activar beta 15 para navegacion movil o priorizar [[../issues/CACH-0051|CACH-0051]] si el dominio publico de app bloquea invitaciones reales.

## Siguiente release candidata

[[../releases/RELEASE-0.1.0-beta.15|RELEASE-0.1.0-beta.15]] — Navegacion movil esencial queda consolidada como draft para abordar [[../issues/CACH-0042|CACH-0042]]. [[../issues/CACH-0051|CACH-0051]] queda como pendiente infra separado para dominio publico de app y multientorno.
