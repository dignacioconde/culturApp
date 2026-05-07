---
id: PB-BACKLOG
type: backlog
status: Active
created: 2026-05-05
updated: 2026-05-07
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

Sin issues en inbox.

## Backlog

| ID | Titulo | Tipo | Prioridad | Nota |
|---|---|---|---|---|
| [[../issues/CACH-B0001|CACH-B0001]] | Redisenar Trabajos y jerarquia proyecto-evento | feature | p1 | Partir antes de ejecutar. |
| [[../issues/CACH-B0002|CACH-B0002]] | Simplificar experiencia mobile financiera | feature | p1 | Validacion mobile obligatoria. |
| [[../issues/CACH-B0004|CACH-B0004]] | Contratantes, facturacion y liquidacion neta | feature | p1 | Evolucion de modelo financiero. |
| [[../issues/CACH-B0007|CACH-B0007]] | Calendario unificado e interaccion rapida | feature | p1 | QA visual y responsive. |
| [[../issues/CACH-B0008|CACH-B0008]] | PWA, notificaciones y offline | feature | p2 | Post confianza basica. |
| [[../issues/CACH-B0009|CACH-B0009]] | Inteligencia financiera y features Pro | feature | p2 | No antes de beta trust. |
| [[../issues/CACH-B0010|CACH-B0010]] | Tooling de agentes y modelos de desarrollo | chore | p2 | Tooling interno. |
| [[../issues/CACH-B0011|CACH-B0011]] | Categorias, etiquetas y taxonomia | feature | p2 | Requiere decision de producto. |
| [[../issues/CACH-B0012|CACH-B0012]] | Perfil publico, viralidad y referidos | feature | p3 | Growth futuro. |
| [[../issues/CACH-B0013|CACH-B0013]] | Gestion documental por proyecto/evento | feature | p3 | Post-MVP. |
## In progress

| ID | Titulo | Tipo | Prioridad | Nota |
|---|---|---|---|---|

## Review

| ID | Titulo | Tipo | Prioridad | Nota |
|---|---|---|---|---|

## Done

| ID | Titulo | Release | Resultado |
|---|---|---|---|
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | [[../releases/RELEASE-0.1.0-beta.8|RELEASE-0.1.0-beta.8]] | Acceso por invitación, onboarding y consentimiento básico integrados por PR #87. |
| [[../issues/CACH-0030|CACH-0030]] | Homogeneizar diseno con nueva paleta | [[../releases/RELEASE-0.1.0-beta.6|RELEASE-0.1.0-beta.6]] | Cerrada por beta 6 en PR #85; drift documental corregido tras beta 7. |
| [[../issues/CACH-0038|CACH-0038]] | Compactar mobile financiero y detalles accionables | [[../releases/RELEASE-0.1.0-beta.6|RELEASE-0.1.0-beta.6]] | Cerrada por beta 6 en PR #85; drift documental corregido tras beta 7. |
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | [[../releases/RELEASE-0.1.0-beta.7|RELEASE-0.1.0-beta.7]] | Export JSON/CSV e import CSV minima integradas por PR #86. |
| [[../issues/CACH-0036|CACH-0036]] | Profesionalizar flujo de ramas por beta | [[../releases/RELEASE-0.1.0-beta.5|RELEASE-0.1.0-beta.5]] | Flujo beta profesional integrado en main por PR #84. |
| [[../issues/CACH-0037|CACH-0037]] | Consolidar PRD y sistema de diseno de Cachés | [[../releases/RELEASE-0.1.0-beta.5|RELEASE-0.1.0-beta.5]] | PRD y sistema de diseno base integrados en main por PR #84. |
| [[../issues/CACH-0033|CACH-0033]] | Vista anual en calendario de proyectos | [[../releases/RELEASE-0.1.0-beta.4|RELEASE-0.1.0-beta.4]] | Planificacion anual con Gantt desktop y compacto movil. |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | [[../releases/RELEASE-0.1.0-beta.5|RELEASE-0.1.0-beta.5]] | Cobro accionable con confirmacion, deshacer y vencimientos solo en pendientes. |
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda, cobros y captura del MVP | [[../releases/RELEASE-0.1.0-beta.2|RELEASE-0.1.0-beta.2]] | 5 bugs críticos corregidos. |
| [[../issues/CACH-0035|CACH-0035]] | Rediseño financiero del Dashboard y paid_date en cobros rapidos | [[../releases/RELEASE-0.1.0-beta.3|RELEASE-0.1.0-beta.3]] | Dashboard financiero centrado en cobros y trabajos accionables. |
| [[../issues/CACH-0032|CACH-0032]] | Priorizar operativa diaria en dashboard movil | null | Mergeada a main. Dashboard mobile operativo. |
| [[../issues/CACH-0034|CACH-0034]] | €/h muestra valor incorrecto cuando no hay eventos con horas | null | Muestra '—' cuando no hay eventos con horas calculables. |
| [[../issues/CACH-0026|CACH-0026]] | Setup inicial Product Brain | null | Product Brain inicial creado. |
| [[../issues/CACH-0028|CACH-0028]] | Corregir sync iCloud y estructura versionada | null | Sync repo/vault estabilizado. |
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog, releases y ramas en Product Brain | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Sistema operativo inicial. |
| [[../issues/CACH-B0016|CACH-B0016]] | Refundacion operativa del Product Brain y tests B0014 | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Validador, tests y politicas. |
| [[../issues/CACH-0029|CACH-0029]] | Integrar helpers CACH-B0016 en flujos reales | [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]] | Mergeada PR #59. Commit 5e2e601. |
| [[../issues/CACH-0031|CACH-0031]] | Corregir ajustes UX movil detectados en exploracion | null | Mergeada PR #74. Ajustes mobile aplicados. |

## Regla de mantenimiento

Actualizar este tablero cuando cambie `status` en una issue. Si el tablero y el frontmatter divergen, `npm run pb:check` debe fallar.
