---
id: RELEASE-0.1.0-beta.12
type: release
status: Released
created: 2026-05-08
updated: 2026-05-08
release_branch: release/0.1.0-beta.12
release_tag: v0.1.0-beta.12
aliases:
  - RELEASE-0.1.0-beta.12
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.12 — Pulido proyecto-evento y borrados seguros

## Estado

Released

## Rama de release

`release/0.1.0-beta.12`

## Tag

`v0.1.0-beta.12`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.12` es un corte de codigo visible y acotado tras los guardrails de agentes.

## Objetivo de la release

Pulir el detalle de proyecto, simplificar el flujo proyecto -> evento y proteger borrados destructivos sin tocar schema, Supabase remoto ni formulas financieras.

## Alcance funcional

- Crear eventos desde un proyecto con el proyecto preseleccionado.
- Confirmar borrados destructivos de proyecto, evento, ingreso y gasto.
- Rejerarquizar acciones del detalle de proyecto para que crear evento sea la accion principal y eliminar no domine.

## Scope

- [[../issues/CACH-0044|CACH-0044]] — Crear evento desde proyecto con proyecto preseleccionado.
- [[../issues/CACH-0045|CACH-0045]] — Anadir confirmacion a borrados destructivos.
- [[../issues/CACH-0043|CACH-0043]] — Limpiar acciones en detalle de proyecto.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0044|CACH-0044]] | Crear evento desde proyecto con proyecto preseleccionado | Done | `release/0.1.0-beta.12` |
| [[../issues/CACH-0045|CACH-0045]] | Anadir confirmacion a borrados destructivos | Done | `release/0.1.0-beta.12` |
| [[../issues/CACH-0043|CACH-0043]] | Limpiar acciones en detalle de proyecto | Done | `release/0.1.0-beta.12` |

## Fuera de alcance

- `CACH-B0020`: email/DNS/Brevo/Supabase SMTP pasa a `RELEASE-0.1.0-beta.14`.
- `CACH-0041`: dashboard movil y estado Ahora pasa a `RELEASE-0.1.0-beta.13`.
- `CACH-0042`: navegacion inferior necesita decision UX previa.
- `CACH-0046`, `CACH-0047` y `CACH-0048`: tooling, skills y contexto no se mezclan con esta beta de UX.
- Cambios de schema, RLS, hooks publicos, calculos financieros o Supabase remoto.

## Riesgos

- No anadir una quinta accion fija dominante en mobile ProjectDetail.
- No mantener botones inline que borren ingresos/gastos sin confirmacion.
- No heredar la preseleccion de proyecto cuando se crea un evento desde el flujo general.
- No cambiar formulas financieras ni agregados de proyecto/evento.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso, review o cerradas
- [x] Commits preparados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] Build correcto
- [x] Tests/checks correctos
- [x] Revision visual
- [x] Revision responsive
- [x] Revision accesibilidad basica
- [x] Revision de regresion basica
- [x] Revision de documentacion

## Checklist de salida

- [x] Integrada en `main`
- [x] Checks locales correctos
- [x] Revision aprobada
- [x] Release mergeada en `main`
- [x] Tag creado desde `main`
- [x] Produccion no aplica
- [x] Rama remota pendiente si se empuja
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Current Release actualizado
- [x] Backlog actualizado

## Release notes

### Aniadido

- Confirmacion reutilizable para borrados destructivos.
- Creacion de evento desde proyecto con proyecto preseleccionado.

### Cambiado

- Jerarquia de acciones en detalle de proyecto.

### Corregido

- Borrados inline de ingresos/gastos sin confirmacion previa.

### Eliminado

- Pendiente.

### Tecnico

- Sin cambios de schema, RLS, Supabase remoto ni formulas financieras.

## Resultado final

Release cerrada localmente.
