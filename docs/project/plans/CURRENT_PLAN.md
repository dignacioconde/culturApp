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

Beta 16 queda activa para retomar navegacion movil como slice pequeno y verificable, limitada a [[../issues/CACH-0042|CACH-0042]].

## Release activa

Release activa: [[../releases/RELEASE-0.1.0-beta.16|RELEASE-0.1.0-beta.16]] — Navegación inferior móvil.

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
- Beta 16 queda activa para `CACH-0042`: racionalizar navegacion inferior movil.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener beta 16 acotada a navegacion inferior movil.
3. No mezclar rediseño Lovable ni cambios de rutas/schema salvo decision explicita posterior.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Implementar [[../issues/CACH-0042|CACH-0042]] desde `feat/CACH-0042-bottom-navigation`, validar lint/build y revisar mobile en 320, 375, 390 y 768 px.

## Siguiente release candidata

Tras beta 16, elegir el siguiente corte segun resultado de navegacion movil y estado del rediseño Lovable.
