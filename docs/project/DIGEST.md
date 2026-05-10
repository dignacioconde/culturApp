---
schema_version: 2
kind: digest
id: PB-DIGEST
title: Product Brain Digest
lifecycle: active
created: 2026-05-05
updated: 2026-05-10
aliases:
  - Digest
  - Brain Digest
tags:
  - product-brain
  - digest
generated: true
---

# Product Brain Digest

Resumen determinista generado desde Product Brain v2.

---

## Estado operacional

- **Release activa:** RELEASE-0.1.0-beta.15 — Dominio publico de app
- **Últimos cortes:** `RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver RELEASE-0.1.0-beta.10.

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver RELEASE-0.1.0-beta.12.

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver RELEASE-0.1.0-beta.13.

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver RELEASE-0.1.0-beta.14.
- **Foco:** Beta 14 queda cerrada. Beta 15 se usa para cerrar el dominio publico de app y multientorno minimo antes de seguir con navegacion movil.

## Prioridades del plan

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Cerrar beta 15 con dominio publico de app antes de retomar navegacion movil.
3. Mantener navegacion movil como siguiente slice candidata, fuera de este corte.

## Tablero

### Intake

_Sin entradas._

### Ready

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-0042 | [UX] Racionalizar navegacion inferior | feature | slice | p1 |

### In progress

_Sin entradas._

### Review / Verify

_Sin entradas._

### Backlog (p1)

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | feature | initiative | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | feature | initiative | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | feature | initiative | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | feature | initiative | p1 |

## Issues abiertas

| ID | Título | Workflow | Tipo | Nivel | P |
|---|---|---|---|---|---|
| CACH-0042 | [UX] Racionalizar navegacion inferior | ready | feature | slice | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | backlog | feature | initiative | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | backlog | feature | initiative | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | backlog | feature | initiative | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | backlog | feature | initiative | p1 |
| CACH-B0008 | PWA notificaciones y offline | backlog | feature | initiative | p2 |
| CACH-B0009 | Inteligencia financiera y features Pro | backlog | feature | initiative | p2 |
| CACH-B0010 | Tooling de agentes y modelos de desarrollo | backlog | chore | initiative | p2 |
| CACH-B0011 | Categorias etiquetas y taxonomia | backlog | spike | initiative | p2 |
| CACH-B0012 | Perfil publico viralidad y referidos | backlog | feature | initiative | p3 |
| CACH-B0013 | Gestion documental por proyecto evento | backlog | feature | initiative | p3 |

## ADRs recientes

| ID | Título | Updated | Estado |
|---|---|---|---|
| ADR-0001 | Mantener el modelo proyecto-evento con finanzas en ambos niveles | 2026-05-08 | Accepted |
| ADR-0002 | Beta prioriza confianza antes que features Pro | 2026-05-08 | Accepted |
| ADR-0003 | Product Brain repo-native y GitHub solo para implementacion | 2026-05-08 | Accepted |
| ADR-0004 | Perfil, IRPF y datos de perfil pasan por useProfile | 2026-05-08 | Accepted |
| ADR-0005 | Controles propios para selectores, fechas y decimales | 2026-05-08 | Accepted |

## Knowledge

| ID | Título |
|---|---|
| PB-ZK-20260504-2005 | Marcar evento como cobrado rápido |
| PB-ZK-20260504-AI-READABLE-PRODUCT-BRAIN | 2026-05-04 |
| PB-ZK-20260504-PROFILE-409 | 409 en creación de proyecto/evento suele indicar profile faltante |
| PB-ZK-20260504-RBC-HEIGHT | React Big Calendar necesita altura real calculable |
| PB-ZK-20260504-TECH-AUDIT | 2026-05-04 |

## Próxima acción

Cerrar PR/tag de beta 15 y verificar produccion en `https://app.caches.es`.
