---
id: PB-CURRENT-PLAN
type: plan
status: Active
created: 2026-05-05
updated: 2026-05-08
aliases:
  - Current Plan
tags:
  - product-brain
  - plan
  - current
---

# Current Plan

## Foco actual

Cerrar la operativa de email transaccional: email/alias real, dominio/remitente definitivo, DNS y verificación real de invitación + confirmación.

## Release activa

[[../releases/RELEASE-0.1.0-beta.13|RELEASE-0.1.0-beta.13]] — Email definitivo transaccional.

Ultimo corte: [[../releases/RELEASE-0.1.0-beta.10|RELEASE-0.1.0-beta.10]] — emails transaccionales beta con Brevo.

Beta 11: [[../releases/RELEASE-0.1.0-beta.11|RELEASE-0.1.0-beta.11]] — guardrails de agentes.

Beta 12: [[../releases/RELEASE-0.1.0-beta.12|RELEASE-0.1.0-beta.12]] — pulido proyecto-evento y borrados seguros.

## Cambios consolidados desde beta 10

- Beta 10 queda como corte técnico cerrado: invitaciones por Brevo Edge Function, auditoría y flujo de confirmación de email preparados.
- Beta 11 queda acotada a guardrails de agentes y no absorbe email ni UX de producto.
- Beta 12 cierra un paquete de codigo visible: `CACH-0044`, `CACH-0045` y `CACH-0043`.
- Beta 13 toma `CACH-B0020` para email/DNS/Brevo/Supabase SMTP, por requerir pasos manuales y operativa externa.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Máxima prioridad operativa: [[../issues/CACH-B0020|CACH-B0020]] — validar dominio de email transaccional y cambiar remitentes definitivos.
3. Mantener fuera de este corte dashboard movil amplio, navegacion inferior, tooling interno, skills, contexto, analitica real, i18n y growth.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Cerrar CACH-B0020 antes de invitar a más usuarios reales.
