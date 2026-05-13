---
schema_version: 2
kind: plan
id: PB-CURRENT-PLAN
title: Current Plan
lifecycle: active
created: '2026-05-05'
updated: '2026-05-13'
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

Beta 20 queda cerrada. El foco vuelve a evaluar el siguiente corte del ciclo `0.1` sin absorber tareas nuevas por defecto: o bien abrir una nueva beta para `CACH-B0004`, o mantener un corte pequeño de hardening si el feedback privado lo pide.

## Release activa

No hay release activa en este momento.

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
- Beta 16 cierra `CACH-0042`: racionalizar navegacion inferior movil.
- Beta 17 cierra `CACH-0052`: feedback simple propio en Supabase y PostHog diferido.
- Beta 18 cierra `CACH-0054`, `CACH-0055` y `CACH-0056`: notas contextuales, quick forms financieros y calendario de eventos separado del plan anual.
- Beta 19 cierra el primer corte de `CACH-B0004`: contratantes estructurados, schema/RLS, hooks, portabilidad, UX mínima y regresión financiera.
- Beta 20 cierra `CACH-0063`: `BottomActionBar` compartido en detalles de proyecto y evento.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener el feedback beta simple antes de introducir analitica de producto.
3. No introducir PostHog, Plausible ni analitica de eventos sin issue/ADR posterior.
4. No abrir liquidacion neta, facturacion completa ni CRM salvo issue nueva con criterios de datos/RLS.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Decidir si el próximo corte es `CACH-B0004` liquidación neta gasto-ingreso o un hardening pequeño derivado del feedback beta.

## Siguiente release candidata

Tras beta 20, evaluar `CACH-B0004` para liquidación neta gasto-ingreso o mantener otro corte de hardening si la beta privada lo pide.
