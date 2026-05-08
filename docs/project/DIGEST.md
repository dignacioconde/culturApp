---
schema_version: 2
kind: digest
id: PB-DIGEST
title: Product Brain Digest
lifecycle: active
created: 2026-05-05
updated: 2026-05-08
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

- **Release activa:** RELEASE-0.1.0-beta.14 — Email definitivo transaccional
- **Últimos cortes:** `RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver RELEASE-0.1.0-beta.10.

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver RELEASE-0.1.0-beta.12.

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver RELEASE-0.1.0-beta.13.
- **Foco:** Cerrar la operativa de email transaccional en beta 14: email/alias real, dominio/remitente definitivo, DNS y verificación real de invitación + confirmación.

## Prioridades del plan

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Máxima prioridad operativa en beta 14: CACH-B0020 — validar dominio de email transaccional y cambiar remitentes definitivos.
3. Mantener fuera de este corte navegacion inferior, tooling interno, skills, contexto, analitica real, i18n y growth.

## Tablero

### Intake

_Sin entradas._

### Ready

_Sin entradas._

### In progress

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-B0020 | Validar dominio de email transaccional y cambiar remitentes definitivos | chore | task | p0 |

### Review / Verify

_Sin entradas._

### Backlog (p1)

| ID | Título | Tipo | Nivel | P |
|---|---|---|---|---|
| CACH-0042 | [UX] Racionalizar navegacion inferior | feature | slice | p1 |
| CACH-0046 | [Verify] Anadir verificacion por tipo de cambio | chore | task | p1 |
| CACH-0047 | [Skills] Actualizar catalogo y symlinks de skills | chore | task | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | feature | initiative | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | feature | initiative | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | feature | initiative | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | feature | initiative | p1 |

## Issues abiertas

| ID | Título | Workflow | Tipo | Nivel | P |
|---|---|---|---|---|---|
| CACH-B0020 | Validar dominio de email transaccional y cambiar remitentes definitivos | in_progress | chore | task | p0 |
| CACH-0042 | [UX] Racionalizar navegacion inferior | backlog | feature | slice | p1 |
| CACH-0046 | [Verify] Anadir verificacion por tipo de cambio | backlog | chore | task | p1 |
| CACH-0047 | [Skills] Actualizar catalogo y symlinks de skills | backlog | chore | task | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | backlog | feature | initiative | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | backlog | feature | initiative | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | backlog | feature | initiative | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | backlog | feature | initiative | p1 |
| CACH-0048 | [Context] Compactar workflow OpenCode | backlog | chore | task | p2 |
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

Cerrar CACH-B0020 en beta 14 antes de invitar a más usuarios reales.
