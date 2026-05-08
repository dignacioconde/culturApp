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

Avanzar beta 11 con tareas desarrollables y verificables desde repo, sin pasos manuales externos.

## Release activa

[[../releases/RELEASE-0.1.0-beta.11|RELEASE-0.1.0-beta.11]] — Desarrollo sin pasos manuales.

Ultimo corte: [[../releases/RELEASE-0.1.0-beta.10|RELEASE-0.1.0-beta.10]] — emails transaccionales beta con Brevo.

## Cambios consolidados desde beta 10

- Beta 10 queda como corte técnico cerrado: invitaciones por Brevo Edge Function, auditoría y flujo de confirmación de email preparados.
- Beta 11 deja fuera la deuda operativa manual de email/remitente para no bloquear desarrollo.
- [[../issues/CACH-B0020|CACH-B0020]] pasa a [[../releases/RELEASE-0.1.0-beta.12|RELEASE-0.1.0-beta.12]], donde sí se asumirán pasos manuales de dominio, DNS, Brevo y Supabase Auth SMTP.

## Prioridades

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Escoger para beta 11 tareas pequeñas que no requieran pasos manuales externos.
3. Mantener [[../issues/CACH-B0020|CACH-B0020]] fuera de beta 11 y retomarlo en beta 12.

## Plan operativo

- Usar [[../backlog/BACKLOG|Backlog]] como tablero.
- Usar [[../process/WORKFLOW|Workflow]] como contrato.
- Usar [[../process/BRANCHING_STRATEGY|Branching Strategy]] para ramas.
- Usar [[../process/COMMIT_CONVENTION|Commit Convention]] para commits.
- Usar [[../process/RELEASE_PROCESS|Release Process]] para cierre de release.
- Usar [[../process/WORKFLOW|Workflow]] antes de implementar.

## Próximo checkpoint

Seleccionar la siguiente issue de beta 11 con verificación local/CI clara.
