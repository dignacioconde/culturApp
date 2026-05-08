---
schema_version: 2
kind: issue
id: CACH-B0011
title: Categorias etiquetas y taxonomia
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0011
tags:
  - product-brain
  - issue
  - ux
  - data
generated: false
work_type: spike
work_level: initiative
issue_workflow: backlog
priority: p2
size: s
area: data
components:
  - design-system
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: core-work-ux
---
# CACH-B0011 — Categorías, etiquetas y taxonomía

## Summary

Decidir como deben funcionar categorias y etiquetas antes de personalizarlas por usuario, usarlas en analisis Pro o cambiar datos existentes.

## Context

Agrupa #16 y #39. Desbloquea futuras mejoras de filtros, presupuestos por categoria y taxonomia por usuario, pero no debe convertirse en una tarea de documentacion larga ni en una implementacion directa.

## Problem

Las categorias afectan a proyectos, eventos, gastos, ingresos, filtros, importacion/exportacion y presupuestos. Cambiarlas sin una decision de modelo puede generar deuda de datos, UI confusa y migraciones fragiles.

## Objective

Dejar una decision accionable sobre categorias y etiquetas que indique que se mantiene, que se cambia y que queda fuera de v1.

## Scope

- Evaluar categorias de proyectos, eventos y gastos.
- Decidir si ingresos necesitan categoria propia o si heredan contexto de proyecto/evento.
- Separar categorias operativas de etiquetas libres opcionales.
- Revisar impacto en filtros, busqueda, importacion/exportacion y datos actuales.
- Revisar relacion futura con presupuestos por categoria de gasto.

## Out Of Scope

- Manuales, guias de uso, onboarding documental o documentacion educativa.
- UI final de gestion de taxonomia.
- Migraciones Supabase definitivas.
- Presupuestos Pro por categoria.
- Automatizaciones o IA de clasificacion.

## Preliminary Recommendation

- Mantener categorias operativas simples como base.
- Tratar etiquetas libres como capa separada y opcional.
- Priorizar gastos como primera entidad donde una taxonomia financiera aporta valor real.
- No mezclar etiquetas descriptivas con categorias financieras.
- Mantener compatibilidad con el campo actual `category text default 'otros'`.

## Acceptance Criteria

- [ ] Hay una decision accionable sobre categorias y etiquetas.
- [ ] Queda claro que entidades usan `category`, cuales podrian usar `tags` y que queda fuera de v1.
- [ ] La decision cubre proyectos, eventos, gastos e ingresos.
- [ ] Se define compatibilidad con el campo actual `category text default 'otros'`.
- [ ] #16 no se implementa como ajuste aislado antes de resolver este spike.
- [ ] Si hacen falta issues hijas, se crean sin incluir manuales, guias de uso ni documentacion extensa.
- [ ] El modelo soporta evolucion sin migraciones fragiles.

## Validation

- `npm run pb:check`
- No requiere `npm run lint` ni `npm run build`: cambio documental en Product Brain.

## Related

- [[CACH-B0009]]

## Desarrollo

- Rama:
- PR:
- Estado actual:

## Notas de progreso


## Cambios de alcance y decisiones


## Bloqueos


## Validación ejecutada

Pendiente hasta ejecutar la issue.

## Memoria

No aplica por ahora.
