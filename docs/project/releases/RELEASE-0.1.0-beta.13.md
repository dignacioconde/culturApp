---
id: RELEASE-0.1.0-beta.13
type: release
status: Released
created: 2026-05-08
updated: 2026-05-08
release_branch: release/0.1.0-beta.13
release_tag: v0.1.0-beta.13
aliases:
  - RELEASE-0.1.0-beta.13
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.13 — Dashboard movil y estado Ahora

## Estado

Released

## Rama de release

`release/0.1.0-beta.13`

## Tag

`v0.1.0-beta.13`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.13` es un corte normal de desarrollo de producto tras el pulido proyecto-evento de beta 12.

## Objetivo de la release

Mejorar el primer pantallazo movil del dashboard para que priorice agenda inmediata y estado "Ahora", reduciendo el peso visual de los KPIs financieros sin cambiar calculos ni contratos de datos.

## Alcance funcional

- Anadir tarjeta movil "Ahora" con estados diferenciados: sin eventos, evento en curso, evento proximo y sin actividad futura.
- Priorizar agenda inmediata por encima de resumen financiero en el primer pantallazo movil.
- Compactar el resumen movil de caja del mes para que no domine la vista.
- Mantener desktop con la densidad y jerarquia profesional existentes.

## Scope

- [[../issues/CACH-0041|CACH-0041]] — Simplificar dashboard movil y estado Ahora.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0041|CACH-0041]] | Simplificar dashboard movil y estado Ahora | Done | `release/0.1.0-beta.13` |

## Fuera de alcance

- `CACH-B0020`: email/DNS/Brevo/Supabase SMTP pasa a `RELEASE-0.1.0-beta.14`.
- `CACH-0042`: navegacion inferior necesita decision UX propia.
- `CACH-0046`, `CACH-0047` y `CACH-0048`: tooling, skills y contexto no se mezclan con esta beta de desarrollo de producto.
- Cambios de schema, RLS, hooks publicos, calculos financieros o Supabase remoto.

## Riesgos

- No cambiar formulas financieras ni agregados de caja/trabajos.
- No introducir dependencia de datos nueva en componentes: dashboard sigue usando hooks existentes.
- No romper la jerarquia desktop ya consolidada.
- No resolver navegacion inferior dentro de este corte.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan cerradas
- [x] Commits preparados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] Lint correcto
- [x] Build correcto
- [x] Product Brain validado
- [x] Revision responsive definida para smoke manual
- [x] Sin cambios de schema, RLS ni Supabase remoto

## Checklist de salida

- [x] Integrada en `main`
- [x] Checks locales correctos
- [x] Release mergeada en `main`
- [x] Tag creado desde `main`
- [x] Produccion no aplica
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Current Release actualizado a beta 14
- [x] Backlog actualizado

## Release notes

### Aniadido

- Tarjeta movil "Ahora" en dashboard con evento en curso/proximo, estado vacio y estado sin actividad futura.

### Cambiado

- Resumen movil de caja del mes compactado para no desplazar la orientacion diaria.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Tecnico

- Nuevo helper `formatTime` en formatters compartidos.
- Sin cambios de schema, RLS, Supabase remoto ni formulas financieras.

## Resultado final

Release cerrada como corte de desarrollo de producto. El scope operativo de email queda trasladado a `RELEASE-0.1.0-beta.14`.
