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

Desbloquear la operativa de email transaccional: email/alias real, dominio/remitente definitivo, DNS público validable por Brevo y verificación real de invitación + confirmación.

## Release activa

[[../releases/RELEASE-0.1.0-beta.11|RELEASE-0.1.0-beta.11]] — Dominio email transaccional.

Ultimo corte: [[../releases/RELEASE-0.1.0-beta.10|RELEASE-0.1.0-beta.10]] — emails transaccionales beta con Brevo.

## Cambios consolidados desde beta 10

- Beta 10 queda como corte técnico cerrado: invitaciones por Brevo Edge Function, auditoría y flujo de confirmación de email preparados.
- Beta 11 absorbe la deuda operativa de beta 10: remitente real de Cachés, validación Brevo, SPF/DKIM/DMARC y sustitución del remitente temporal en Supabase Auth y Edge Function.
- CACH-B0020 es el único scope activo de beta 11 y queda bloqueado hasta que exista un dominio/remitente real con DNS público validable.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Máxima prioridad para el **8 de mayo de 2026**: [[../issues/CACH-B0020|CACH-B0020]] — desbloquear dominio/remitente real, validar Brevo y cambiar remitentes definitivos.
3. Mantener fuera de este corte calendario unificado, mobile financiero, tooling interno amplio, analítica real, i18n y growth.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Registrar/delegar dominio o escoger uno operativo, crear el alias definitivo y repetir la verificación DNS/Brevo antes de invitar a más usuarios reales.
