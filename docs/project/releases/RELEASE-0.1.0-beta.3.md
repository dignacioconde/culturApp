---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.3
title: Rediseño financiero del Dashboard
lifecycle: active
created: '2026-05-06'
updated: '2026-05-08'
aliases:
  - RELEASE-0.1.0-beta.3
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: released
release_current: false
release_branch: release/0.1.0-beta.3
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.3 — Rediseño financiero del Dashboard

## Estado

Released

## Rama de release

`release/0.1.0-beta.3`

## Goal

Convertir el Dashboard en una herramienta clara de control de cobros: plan cobrable del mes, trabajos que explican los importes, deuda accionable y fechas reales de cobro consistentes.

## Product Outcome

El usuario puede abrir el Dashboard y entender qué tiene que cobrar ahora, qué ya se cobró, qué está vencido, qué trabajos explican esos importes y qué cobros pertenecen a meses futuros sin mezclarlo todo bajo el mismo bloque.

## Scope

- [[CACH-0035]] — Bug paid_date en cobros rápidos usa start_date en vez de fecha real
- Rediseño de KPIs de `Caja del mes` como plan cobrable.
- Vista `Trabajos` agregada por proyecto/evento con contabilidad unificada.
- Separación visual de trabajos por perseguir, cobro futuro, ya cobrados y otros trabajos del mes.
- Capa pura `dashboardFinance` con tests unitarios para reglas financieras.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| CACH-0035 | Rediseño financiero del Dashboard y paid_date de cobros rapidos | Released | `release/0.1.0-beta.3` |

## Fuera de alcance

- Corrección de datos históricos ya guardados con `paid_date` incorrecto en Supabase.
- CACH-0030 (paleta/fuentes) — puede ir como PR directo a main separado.

## Riesgos

- Datos históricos con `paid_date` = `start_date` del proyecto seguirán mal hasta migración manual.
- No se ha hecho migración de base de datos; la corrección aplica a nuevos cobros y a la lectura agregada actual.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] Build correcto
- [x] Tests/checks correctos
- [x] Revision visual
- [x] Revision responsive
- [x] Revision accesibilidad
- [x] Revision de regresion basica
- [x] Revision de documentacion

## Checklist de salida

- [x] Release mergeada a `main`
- [x] Release notes actualizadas
- [x] Issues marcadas como `Released`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Añadido

- Nueva capa pura `src/lib/dashboardFinance.js` para calcular KPIs, trabajos relevantes y secciones financieras del Dashboard.
- Tests unitarios para plan cobrable mensual, deuda arrastrada, `paid_date`, agregación proyecto-eventos y separación de trabajos.

### Cambiado

- `Caja del mes` pasa a ser plan cobrable: `A cobrar = Cobrado del plan + Pendiente + Vencido`.
- `Trabajos` agrupa ingresos directos del proyecto e ingresos de eventos hijos; los eventos con proyecto no aparecen duplicados como trabajo financiero separado.
- La lista de trabajos se separa en `Por perseguir`, `Cobro futuro`, `Ya cobrados` y `Otros trabajos`.
- La UI móvil del resumen y de los trabajos se compacta para priorizar pendiente/vencido ahora.

### Corregido

- Dashboard: cobros rápidos de proyecto marcados como pagados ahora guardan `paid_date` con la fecha real de cobro (hoy), no con la `start_date` del proyecto. Los KPIs de Cobrado y Neto reflejan correctamente los ingresos del mes. (CACH-0035)
- Cobros rápidos de evento marcados como pagados usan también fecha real de cobro.
- Los vencidos antiguos solo se arrastran al mes real actual; no se proyectan a meses futuros.

### Eliminado

- Se eliminan gastos, neto y cobro bruto/hora como KPIs principales del Dashboard financiero.
- Se elimina el selector por días de `Próximos cobros`; ahora sigue el mes seleccionado.

### Tecnico

- Validado con `npm test`, `npm run lint`, `npm run build` y `npm run pb:check`.

## Resultado final

Release cerrada y mergeada a `main` el 2026-05-06. El Dashboard queda centrado en control de cobros y trabajos accionables.
