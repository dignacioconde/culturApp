---
id: PB-DIGEST
type: digest
status: Active
created: 2026-05-08
updated: 2026-05-08
aliases:
  - Digest
  - Brain Digest
tags:
  - product-brain
  - digest
---

# Product Brain Digest

*Generado: 2026-05-08 08:35 UTC*

---

## Estado operacional

- **Release activa:** `RELEASE-0.1.0-beta.11` — Dominio email transaccional.
- **Último corte:** `RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver RELEASE-0.1.0-beta.10.
- **Foco:** Cerrar la operativa de email transaccional: email/alias real, dominio/remitente definitivo, DNS y verificación real de invitación + confirmación.

## Prioridades del plan

1. Mantener el ciclo `0.1` enfocado en confianza, portabilidad y primera sesion.
2. Máxima prioridad para el **8 de mayo de 2026**: CACH-B0020 — validar dominio de email transaccional y cambiar remitentes definitivos.
3. Mantener fuera de este corte calendario unificado, mobile financiero, tooling interno amplio, analítica real, i18n y growth.

## Tablero

### Inbox

_Sin issues._

### In progress

_Sin issues._

### Review

_Sin issues._

### Backlog (p1)

| ID | Título | Tipo | P |
|---|---|---|---|
| CACH-0041 | [UX] Simplificar dashboard movil y estado Ahora | feature | p1 |
| CACH-0042 | [UX] Racionalizar navegacion inferior | feature | p1 |
| CACH-0043 | [UX] Limpiar acciones en detalle de proyecto | feature | p1 |
| CACH-0044 | [UX] Crear evento desde proyecto con proyecto preseleccionado | feature | p1 |
| CACH-0045 | [UX] Anadir confirmacion a borrados destructivos | feature | p1 |
| CACH-0046 | [Verify] Anadir verificacion por tipo de cambio | chore | p1 |
| CACH-0047 | [Skills] Actualizar catalogo y symlinks de skills | chore | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | feature | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | feature | p1 |
| CACH-B0004 | Contratantes, facturacion y liquidacion neta | feature | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | feature | p1 |

## Issues abiertas

| ID | Título | Estado | Tipo | P |
|---|---|---|---|---|
| CACH-B0020 | Validar dominio de email transaccional y cambiar remitentes definitivos | ready | chore | p0 |
| CACH-0039 | [Agents] Respetar permisos reales en lanzadores OpenCode | backlog | chore | p0 |
| CACH-0040 | [Agents] Separar plan draft de ejecucion mutante | backlog | chore | p0 |
| CACH-0041 | [UX] Simplificar dashboard movil y estado Ahora | backlog | feature | p1 |
| CACH-0042 | [UX] Racionalizar navegacion inferior | backlog | feature | p1 |
| CACH-0043 | [UX] Limpiar acciones en detalle de proyecto | backlog | feature | p1 |
| CACH-0044 | [UX] Crear evento desde proyecto con proyecto preseleccionado | backlog | feature | p1 |
| CACH-0045 | [UX] Anadir confirmacion a borrados destructivos | backlog | feature | p1 |
| CACH-0046 | [Verify] Anadir verificacion por tipo de cambio | backlog | chore | p1 |
| CACH-0047 | [Skills] Actualizar catalogo y symlinks de skills | backlog | chore | p1 |
| CACH-B0001 | Redisenar Trabajos y jerarquia proyecto-evento | backlog | feature | p1 |
| CACH-B0002 | Simplificar experiencia mobile financiera | backlog | feature | p1 |
| CACH-B0004 | Contratantes facturacion y liquidacion neta | backlog | feature | p1 |
| CACH-B0007 | Calendario unificado e interaccion rapida | backlog | feature | p1 |
| CACH-0048 | [Context] Compactar workflow OpenCode | backlog | chore | p2 |
| CACH-B0008 | PWA notificaciones y offline | backlog | feature | p2 |
| CACH-B0009 | Inteligencia financiera y features Pro | backlog | feature | p2 |
| CACH-B0010 | Tooling de agentes y modelos de desarrollo | backlog | chore | p2 |
| CACH-B0011 | Categorias etiquetas y taxonomia | backlog | spike | p2 |
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

Cerrar CACH-B0020 antes de invitar a más usuarios reales.
