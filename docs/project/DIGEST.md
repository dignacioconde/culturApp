---
schema_version: 2
kind: digest
id: PB-DIGEST
title: Product Brain Digest
lifecycle: active
created: 2026-05-05
updated: 2026-05-13
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

- **Release activa:** RELEASE-0.1.0-beta.19 — Contratantes estructurados
- **Últimos cortes:** `RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver RELEASE-0.1.0-beta.10.

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver RELEASE-0.1.0-beta.12.

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver RELEASE-0.1.0-beta.13.

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver RELEASE-0.1.0-beta.14.

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver RELEASE-0.1.0-beta.15.

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver RELEASE-0.1.0-beta.16.

`RELEASE-0.1.0-beta.17` — feedback simple beta. Ver RELEASE-0.1.0-beta.17.

`RELEASE-0.1.0-beta.18` — cierre P1 UX core. Ver RELEASE-0.1.0-beta.18.
- **Foco:** Beta 19 está activa para introducir contratantes estructurados como primer slice de `CACH-B0004`, manteniendo fuera liquidación neta, facturación completa, CRM y cambios de fórmulas financieras.

## Prioridades del plan

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener el feedback beta simple antes de introducir analitica de producto.
3. No introducir PostHog, Plausible ni analitica de eventos sin issue/ADR posterior.
4. Durante beta 19, permitir contratantes estructurados, migraciones/RLS y portabilidad necesarias; mantener fuera liquidacion neta, facturacion completa y cambios de formulas financieras.

## Tablero

### Intake

_Sin entradas._

### Ready

_Sin entradas._

### In progress

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-0061 | Verificar regresion financiera y cierre tecnico beta 19 | chore | task | p1 |

### Review / Verify

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-0057 | Definir modelo minimo de contratantes | spike | task | p1 |
| CACH-0058 | Versionar schema de contratantes y RLS | feature | slice | p1 |
| CACH-0059 | Integrar hooks y portabilidad de contratantes | feature | slice | p1 |
| CACH-0060 | Anadir UX minima de contratantes en proyectos y eventos | feature | slice | p1 |

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
| CACH-0061 | Verificar regresion financiera y cierre tecnico beta 19 | in_progress | chore | task | p1 |
| CACH-0057 | Definir modelo minimo de contratantes | review | spike | task | p1 |
| CACH-0058 | Versionar schema de contratantes y RLS | review | feature | slice | p1 |
| CACH-0059 | Integrar hooks y portabilidad de contratantes | review | feature | slice | p1 |
| CACH-0060 | Anadir UX minima de contratantes en proyectos y eventos | review | feature | slice | p1 |
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
| ADR-0014 | Beta feedback propio y Plausible comentado | 2026-05-11 | Superseded |
| ADR-0015 | Feedback simple propio y PostHog diferido | 2026-05-11 | Accepted |
| ADR-0001 | Mantener el modelo proyecto-evento con finanzas en ambos niveles | 2026-05-08 | Accepted |
| ADR-0002 | Beta prioriza confianza antes que features Pro | 2026-05-08 | Accepted |
| ADR-0003 | Product Brain repo-native y GitHub solo para implementacion | 2026-05-08 | Accepted |

## Knowledge

| ID | Título |
|---|---|
| PB-ZK-20260504-2005 | Marcar evento como cobrado rápido |
| PB-ZK-20260504-AI-READABLE-PRODUCT-BRAIN | 2026-05-04 |
| PB-ZK-20260504-PROFILE-409 | 409 en creación de proyecto/evento suele indicar profile faltante |
| PB-ZK-20260504-RBC-HEIGHT | React Big Calendar necesita altura real calculable |
| PB-ZK-20260504-TECH-AUDIT | 2026-05-04 |

## Próxima acción

Ejecutar beta 19 por slices: modelo mínimo, schema/RLS, hooks/portabilidad, UX mínima y regresión financiera.
