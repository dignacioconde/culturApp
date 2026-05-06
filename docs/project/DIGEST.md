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

*Generado: 2026-05-06 12:14 UTC*

---

## Estado operacional

- **Release activa:** ninguna — PRs directas a `main`
- **Último corte:** `RELEASE-0.1.0-beta.2` — mergeada a `main` el 2026-05-06. Ver RELEASE-0.1.0-beta.2.
- **Foco:** Sin release activa. Siguiente: CACH-0030 (PR directo) o abrir beta.3.

## Prioridades del plan

1. CACH-0030 (paleta/fuentes) como PR directo a main.
2. Evaluar backlog p1 para definir si se abre `beta.3`.
3. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.

## Tablero

### Inbox

| ID | Título | Tipo | P |
|---|---|---|---|
| CACH-0030 | Homogeneizar diseno con nueva paleta | chore | p1 |

### In progress

_Sin issues._

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

Decidir si CACH-0030 va como PR directo o si se abre `beta.3` con más scope.
