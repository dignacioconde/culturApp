---
id: PB-DIGEST
type: digest
status: Active
created: 2026-05-06
updated: 2026-05-06
aliases:
  - Digest
  - Brain Digest
tags:
  - product-brain
  - digest
---

# Product Brain Digest

*Generado: 2026-05-06 12:10 UTC*

---

## Estado operacional

- **Release activa:** `RELEASE-0.1.0-beta.2` — rama `release/0.1.0-beta.2`. Ver RELEASE-0.1.0-beta.2.
- **Último corte:** `RELEASE-0.1.0-beta.1` — mergeada a `main`. Ver RELEASE-0.1.0-beta.1.
- **Foco:** Implementar CACH-B0014 en `RELEASE-0.1.0-beta.2`: corregir los 5 bugs críticos de confianza de datos del MVP (agenda y cobros).

## Prioridades del plan

1. Implementar CACH-B0014 en rama `feature/CACH-B0014-hardening`.
2. Mergear feature → `release/0.1.0-beta.2` → `main`.
3. Después: CACH-0030 (paleta/fuentes) como PR directo a main.
4. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.

## Tablero

### Inbox

| ID | Título | Tipo | P |
|---|---|---|---|
| CACH-0030 | Homogeneizar diseno con nueva paleta | chore | p1 |

### In progress

| ID | Título | Tipo | P |
|---|---|---|---|
| CACH-B0014 | Endurecer agenda, cobros y captura del MVP | bug | p1 |

### Review

_Sin issues._

### Backlog (p1)

| ID | Título | Tipo | P |
|---|---|---|---|
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | feature | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | feature | p1 |
| CACH-B0003 | Cobro rapido y gestion de pendientes | feature | p1 |
| CACH-B0004 | Contratantes, facturacion y liquidacion neta | feature | p1 |
| CACH-B0005 | Importacion, exportacion y portabilidad de datos | feature | p1 |
| CACH-B0006 | Onboarding y acceso beta | feature | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | feature | p1 |

## Issues abiertas

| ID | Título | Estado | Tipo | P |
|---|---|---|---|---|
| CACH-B0014 | Endurecer agenda cobros y captura del MVP | in-progress | bug | p1 |
| CACH-0030 | Homogeneizar diseno con nueva paleta de colores y fuentes | inbox | chore | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | backlog | feature | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | backlog | feature | p1 |
| CACH-B0003 | Cobro rapido y gestion de pendientes | backlog | feature | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | backlog | feature | p1 |
| CACH-B0005 | Importacion exportacion y portabilidad de datos | backlog | feature | p1 |
| CACH-B0006 | Onboarding y acceso beta | backlog | feature | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | backlog | feature | p1 |
| CACH-0033 | Vista anual en calendario de proyectos | backlog | feature | p2 |
| CACH-B0008 | PWA notificaciones y offline | backlog | feature | p2 |
| CACH-B0009 | Inteligencia financiera y features Pro | backlog | feature | p2 |
| CACH-B0010 | Tooling de agentes y modelos de desarrollo | backlog | chore | p2 |
| CACH-B0011 | Categorias etiquetas y taxonomia | backlog | feature | p2 |
| CACH-B0012 | Perfil publico viralidad y referidos | backlog | feature | p3 |
| CACH-B0013 | Gestion documental por proyecto evento | backlog | feature | p3 |

## ADRs (últimas 5)

| ID | Título | Fecha | Estado |
|---|---|---|---|
| ADR-0008 | ADR-0008 — Release branching gobernado por Product Brain | 2026-05-05 | Accepted |
| ADR-0009 | ADR-0009 — Politica unica de IDs CACH | 2026-05-05 | Accepted |
| ADR-0010 | ADR-0010 — Frontmatter validado con Zod | 2026-05-05 | Accepted |
| ADR-0011 | ADR-0011 — Timestamps como instantes y Europe/Madrid en cliente | 2026-05-05 | Accepted |
| ADR-0012 | ADR-0012 — Decimales europeos con input text e inputmode decimal | 2026-05-05 | Accepted |

## Knowledge

| ID | Título |
|---|---|
| PB-ZK-20260504-2005 | Marcar evento como cobrado rápido |
| PB-ZK-20260504-AI-READABLE-PRODUCT-BRAIN | Product Brain legible por IA — 2026-05-04 |
| PB-ZK-20260504-PROFILE-409 | 409 en creación de proyecto/evento suele indicar profile faltante |
| PB-ZK-20260504-RBC-HEIGHT | React Big Calendar necesita altura real calculable |
| PB-ZK-20260504-TECH-AUDIT | Auditoría técnica repo — 2026-05-04 |

## Próxima acción

Cerrar CACH-B0014, mergear beta.2 a main y actualizar CURRENT_RELEASE + DIGEST.
