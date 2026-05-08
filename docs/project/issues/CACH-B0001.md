---
schema_version: 2
kind: issue
id: CACH-B0001
title: Redisenar Trabajos y jerarquia proyecto-evento
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0001
tags:
  - product-brain
  - issue
  - ux
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p1
size: m
area: frontend
components:
  - work
  - projects
  - events
  - design-system
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: pro-growth
---
# CACH-B0001 — Rediseñar Trabajos y jerarquía proyecto-evento

## Summary

Unificar la experiencia de Trabajos para eliminar redundancias entre trabajos activos, proyectos y eventos, dando distinta jerarquía visual a proyectos y eventos.

## Context

Agrupa las fuentes #4, #8, #10, #33 y las tres ideas sin número detectadas en capturas: rediseñar listado Trabajos, ocultar ruido del badge "Confirmado" y evitar repetir "Proyecto: X" en cada evento.

## Problem

La vista actual puede duplicar trabajos y dar el mismo peso visual a contenedores (proyectos) y ocurrencias concretas (eventos). Esto dificulta escanear qué está activo y qué pertenece a qué.

## Proposed Solution

- Colocar Trabajos antes que Dashboard en navegación.
- Agrupar eventos bajo su proyecto padre cuando proceda.
- Diferenciar visualmente proyecto y evento.
- Ocultar o minimizar estados por defecto como "Confirmado".
- Mantener notas editables en evento y proyecto.
- Tratar plantillas de proyecto como spike posterior.

## Acceptance Criteria

- [x] Un evento asociado a un proyecto no aparece duplicado como trabajo independiente en la vista principal.
- [x] Proyecto y evento tienen jerarquía visual distinta.
- [x] El badge "Confirmado" no añade ruido si es el estado normal.
- [ ] Las notas de evento/proyecto se pueden editar desde su contexto.

## Iteración 2026-05-05

PR `#75` corrigió la navegación básica de “Trabajos”:

- `Trabajos` pasa a ser el flujo principal para proyectos y eventos.
- Los tabs de `Trabajos` son direccionables por URL (`/work?view=projects`, `/work?view=events`).
- Los detalles de proyecto y evento vuelven a la pestaña correcta de `Trabajos`, no a listados aislados ni al historial del navegador.
- Los eventos asociados se agrupan bajo su proyecto y los eventos sin proyecto quedan separados.
- Los CTAs en detalles se compactan y se elimina el ruido visual de badges `Confirmado`.

## Lecciones Aprendidas

- “Trabajos” no puede ser una pestaña decorativa encima de `/projects` y `/events`; debe tener ownership del flujo mental completo: listado, detalle, vuelta y navegación entre entidades relacionadas.
- En móvil, una navegación que exige usar el botón atrás del navegador se siente rota aunque las rutas existan técnicamente.
- Las acciones de gestión financiera y edición deben estar disponibles, pero no dominar visualmente la pantalla ni duplicarse en estados vacíos.
- Los estados normales como `Confirmado` deben ocultarse o minimizarse cuando no aportan decisión.
- Las futuras revisiones de esta zona deben probar el bucle completo: `Trabajos -> Proyectos/Eventos -> Detalle -> volver a la pestaña correcta`.

## Related

- [[../plans/backlog-mayo-2026]]
- [[../context/ui-direction-v3-20260504]]

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
