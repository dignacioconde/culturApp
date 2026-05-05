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

Tablero ligero del Product Brain. Cada trabajo ejecutable vive como issue Markdown en `docs/project/issues/`.

## Fuentes

- Issues canonicas: [[../indexes/issues.index|Issues Index]]
- Release activa: [[../releases/CURRENT_RELEASE|Current Release]]
- Plan actual: [[../plans/CURRENT_PLAN|Current Plan]]
- Ideas sin refinar: [[IDEAS]]
- Triage: [[TRIAGE]]

## Estados

| Columna | Frontmatter |
|---|---|
| Inbox | `status: inbox` |
| Backlog | `status: backlog`, `ready` o `blocked` |
| In progress | `status: in-progress` |
| Review | `status: review` |
| Done | `status: done` |

`wontfix` no tiene columna propia: se deja como nota en la issue y se excluye del tablero.

## Inbox

Sin issues en inbox. Las capturas sin procesar viven en [[../inbox/README|inbox]] hasta la weekly review.

## Backlog

| ID | Titulo | Tipo | Prioridad | Nota |
|---|---|---|---|---|
| [[../issues/CACH-B0001|CACH-B0001]] | Redisenar Trabajos y jerarquia proyecto-evento | feature | p1 | Partir antes de ejecutar. |
| [[../issues/CACH-B0002|CACH-B0002]] | Simplificar experiencia mobile financiera | feature | p1 | Validacion mobile obligatoria. |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | feature | p1 | Depende de coherencia de cobros. |
| [[../issues/CACH-B0004|CACH-B0004]] | Contratantes, facturacion y liquidacion neta | feature | p1 | Evolucion de modelo financiero. |
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | feature | p1 | Necesario para confianza beta. |
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | feature | p1 | Primera sesion y beta privada. |
| [[../issues/CACH-B0007|CACH-B0007]] | Calendario unificado e interaccion rapida | feature | p1 | QA visual y responsive. |
| [[../issues/CACH-B0008|CACH-B0008]] | PWA, notificaciones y offline | feature | p2 | Post confianza basica. |
| [[../issues/CACH-B0009|CACH-B0009]] | Inteligencia financiera y features Pro | feature | p2 | No antes de beta trust. |
| [[../issues/CACH-B0010|CACH-B0010]] | Tooling de agentes y modelos de desarrollo | chore | p2 | Tooling interno. |
| [[../issues/CACH-B0011|CACH-B0011]] | Categorias, etiquetas y taxonomia | feature | p2 | Requiere decision de producto. |
| [[../issues/CACH-B0012|CACH-B0012]] | Perfil publico, viralidad y referidos | feature | p3 | Growth futuro. |
| [[../issues/CACH-B0013|CACH-B0013]] | Gestion documental por proyecto/evento | feature | p3 | Post-MVP. |
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda, cobros y captura del MVP | bug | p1 | Candidato para beta-2. |

## In progress

Sin issues en progreso.

## Review

Sin issues en review.

## Done

| ID | Titulo | Release | Resultado |
|---|---|---|---|
| [[../issues/CACH-0026|CACH-0026]] | Setup inicial Product Brain | null | Product Brain inicial creado. |
| [[../issues/CACH-0028|CACH-0028]] | Corregir sync iCloud y estructura versionada | null | Sync repo/vault estabilizado. |
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog, releases y ramas en Product Brain | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Sistema operativo inicial. |
| [[../issues/CACH-B0016|CACH-B0016]] | Refundacion operativa del Product Brain y tests B0014 | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Validador, tests y politicas. |

## Regla de mantenimiento

Actualizar este tablero cuando cambie `status` en una issue. Si el tablero y el frontmatter divergen, `npm run pb:check` debe fallar.
