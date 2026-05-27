---
schema_version: 2
kind: plan
id: PB-CURRENT-PLAN
title: Current Plan
lifecycle: active
created: '2026-05-05'
updated: '2026-05-27'
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

Sin release activa. Beta 25 queda publicada y el siguiente corte se define desde backlog.

## Release activa

No active release.

Rama: no active release branch.

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
- Beta 21 cierra primera sesion guiada y PWA instalable.
- Beta 22 cierra historial de novedades beta.
- Beta 23 queda enfocada en unificacion visual total con `CACH-0076` a `CACH-0088`, sin cambios funcionales.
- Beta 24 cierra el corte de calendario: Agenda/Plan más claros, móvil más escaneable y feed privado `.ics/webcal` de eventos.
- Beta 25 cierra liquidacion neta minima: resumen operativo en detalles, gastos repercutibles, schema/RLS y portabilidad sin abrir facturacion completa.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener el feedback beta simple antes de introducir analitica de producto.
3. No introducir PostHog, Plausible ni analitica de eventos sin issue/ADR posterior.
4. Definir el siguiente corte manteniendo facturacion completa, PDF, IVA, CRM y colaboracion fuera de scope salvo issue/release explicita.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Definir la siguiente beta candidata y confirmar scope antes de abrir nueva rama de release.

## Siguiente release candidata

Pendiente de definir desde backlog.
