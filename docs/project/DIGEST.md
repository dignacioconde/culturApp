---
schema_version: 2
kind: digest
id: PB-DIGEST
title: Product Brain Digest
lifecycle: active
created: 2026-05-05
updated: 2026-05-14
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

- **Release activa:** No hay release activa.
- **Últimos cortes:** `RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver RELEASE-0.1.0-beta.10.

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver RELEASE-0.1.0-beta.12.

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver RELEASE-0.1.0-beta.13.

`RELEASE-0.1.0-beta.14` — email definitivo transaccional. Ver RELEASE-0.1.0-beta.14.

`RELEASE-0.1.0-beta.15` — dominio publico de app. Ver RELEASE-0.1.0-beta.15.

`RELEASE-0.1.0-beta.16` — navegacion inferior movil. Ver RELEASE-0.1.0-beta.16.

`RELEASE-0.1.0-beta.17` — feedback simple beta. Ver RELEASE-0.1.0-beta.17.

`RELEASE-0.1.0-beta.18` — cierre P1 UX core. Ver RELEASE-0.1.0-beta.18.

`RELEASE-0.1.0-beta.19` — contratantes estructurados. Ver RELEASE-0.1.0-beta.19.

`RELEASE-0.1.0-beta.20` — hardening UX móvil financiera. Ver RELEASE-0.1.0-beta.20.

`RELEASE-0.1.0-beta.21` — primera sesion guiada y PWA instalable. Ver RELEASE-0.1.0-beta.21.

`RELEASE-0.1.0-beta.22` — historial de novedades beta. Ver RELEASE-0.1.0-beta.22.

`RELEASE-0.1.0-beta.23` — tokens Lovable y visual total. Ver RELEASE-0.1.0-beta.23.

`RELEASE-0.1.0-beta.24` — calendario claro y sincronización suscribible. Ver RELEASE-0.1.0-beta.24.
- **Foco:** No hay release activa. Beta 24 queda cerrada como corte de calendario claro y sincronización suscribible.

## Prioridades del plan

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Mantener el feedback beta simple antes de introducir analitica de producto.
3. No introducir PostHog, Plausible ni analitica de eventos sin issue/ADR posterior.
4. No abrir liquidacion neta, facturacion completa ni CRM salvo issue nueva con criterios de datos/RLS.

## Tablero

### Intake

_Sin entradas._

### Ready

_Sin entradas._

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
| CACH-B0007 | Calendarios claros y sincronizacion suscribible | feature | initiative | p1 |

## Issues abiertas

| ID | Título | Workflow | Tipo | Nivel | P |
|---|---|---|---|---|---|
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | backlog | feature | initiative | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | backlog | feature | initiative | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | backlog | feature | initiative | p1 |
| CACH-B0007 | Calendarios claros y sincronizacion suscribible | backlog | feature | initiative | p1 |
| CACH-B0008 | PWA notificaciones y offline | backlog | feature | initiative | p2 |
| CACH-B0009 | Inteligencia financiera y features Pro | backlog | feature | initiative | p2 |
| CACH-B0010 | Tooling de agentes y modelos de desarrollo | backlog | chore | initiative | p2 |
| CACH-B0011 | Categorias etiquetas y taxonomia | backlog | spike | initiative | p2 |
| CACH-B0012 | Perfil publico viralidad y referidos | backlog | feature | initiative | p3 |
| CACH-B0013 | Gestion documental por proyecto evento | backlog | feature | initiative | p3 |

## ADRs recientes

| ID | Título | Updated | Estado |
|---|---|---|---|
| ADR-0016 | UX móvil financiera: operativa primero y acciones contextuales | 2026-05-13 | Accepted |
| ADR-0014 | Beta feedback propio y Plausible comentado | 2026-05-11 | Superseded |
| ADR-0015 | Feedback simple propio y PostHog diferido | 2026-05-11 | Accepted |
| ADR-0001 | Mantener el modelo proyecto-evento con finanzas en ambos niveles | 2026-05-08 | Accepted |
| ADR-0002 | Beta prioriza confianza antes que features Pro | 2026-05-08 | Accepted |

## Knowledge

| ID | Título |
|---|---|
| PB-ZK-20260504-2005 | Marcar evento como cobrado rápido |
| PB-ZK-20260504-AI-READABLE-PRODUCT-BRAIN | 2026-05-04 |
| PB-ZK-20260504-PROFILE-409 | 409 en creación de proyecto/evento suele indicar profile faltante |
| PB-ZK-20260504-RBC-HEIGHT | React Big Calendar necesita altura real calculable |
| PB-ZK-20260504-TECH-AUDIT | 2026-05-04 |

## Próxima acción

Definir el siguiente corte beta según feedback real de calendario y prioridades pendientes del ciclo `0.1`.
