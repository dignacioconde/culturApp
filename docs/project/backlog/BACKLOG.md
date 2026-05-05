---
id: PB-BACKLOG
type: backlog
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Backlog operativo
  - Backlog
tags:
  - product-brain
  - backlog
  - workflow
---

# Backlog operativo

Este archivo es el tablero ligero del Product Brain. No sustituye a las issues: cada trabajo ejecutable vive en `docs/project/issues/` con ID `CACH-*`.

## Fuentes

- Issues canonicas: [[../indexes/issues.index|Issues Index]]
- Release activa: [[../releases/CURRENT_RELEASE|Current Release]]
- Plan actual: [[../plans/CURRENT_PLAN|Current Plan]]
- Ideas sin refinar: [[IDEAS]]
- Triage: [[TRIAGE]]

## Estados

| Estado | Uso |
|---|---|
| Ideas | Capturas o posibilidades todavia sin problema claro. |
| Triage | Entrada revisandose para decidir destino. |
| Backlog refinado | Issue existe, pero aun no esta lista para construir. |
| Ready for development | Issue cumple Definition of Ready. |
| In progress | Hay rama de trabajo o agente asignado. |
| In review | Implementacion pendiente de review/validacion. |
| Ready for release | Issue cerrada funcionalmente e integrada en release branch. |
| Released | Cambio mergeado a `main` y reflejado en estado de producto. |
| Archived | Cerrada, cancelada o absorbida por otra issue. |

## Backlog refinado

| ID | Titulo | Tipo | Prioridad | Release | Notas |
|---|---|---|---|---|---|
| [[../issues/CACH-B0001|CACH-B0001]] | Redisenar Trabajos y jerarquia proyecto-evento | Feature | Alta | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Necesita partirse en issues pequenas antes de desarrollo. |
| [[../issues/CACH-B0002|CACH-B0002]] | Simplificar experiencia mobile financiera | Feature | Alta | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Validacion mobile obligatoria. |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | Feature | Media | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Depende de coherencia de ingresos/cobros. |
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | Feature | Alta | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Necesario para confianza beta. |
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | Feature | Alta | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Debe evitar friccion en primera sesion. |
| [[../issues/CACH-B0007|CACH-B0007]] | Calendario unificado e interaccion rapida | Feature | Alta | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Requiere QA visual y responsive. |

## Ready for development

| ID | Titulo | Rama sugerida | Dependencias |
|---|---|---|---|
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda, cobros y captura del MVP | `fix/CACH-B0014-mvp-trust-pass` | Ninguna critica. |

## In progress

| ID | Titulo | Rama | Responsable | Estado |
|---|---|---|---|---|
| Pendiente | Ninguna issue marcada aqui | Pendiente | Pendiente | Actualizar cuando se abra rama. |

## In review

| ID | Titulo | Rama | Validacion |
|---|---|---|---|
| Pendiente | Ninguna issue marcada aqui | Pendiente | Pendiente |

## Ready for release

| ID | Titulo | Release | Validacion |
|---|---|---|---|
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog, releases y ramas en Product Brain | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | `pb:check` y revision documental. |

## Released

| ID | Titulo | Release | Resultado |
|---|---|---|---|
| [[../issues/CACH-0026|CACH-0026]] | Setup inicial Product Brain | Unassigned | Product Brain inicial creado. |
| [[../issues/CACH-0028|CACH-0028]] | Corregir sync iCloud y estructura versionada | Unassigned | Sync repo/vault estabilizado. |

## Regla de mantenimiento

Actualizar este tablero cuando una issue cambie de fase operativa. No copiar aqui todo el contenido de la issue; enlazar y resumir solo lo necesario para coordinar.
