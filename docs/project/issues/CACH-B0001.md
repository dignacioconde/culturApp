---
id: CACH-B0001
type: issue
status: Backlog
priority: High
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B0001
tags:
  - product-brain
  - issue
  - ux
---

# CACH-B001 — Rediseñar Trabajos y jerarquía proyecto-evento

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

- [ ] Un evento asociado a un proyecto no aparece duplicado como trabajo independiente en la vista principal.
- [ ] Proyecto y evento tienen jerarquía visual distinta.
- [ ] El badge "Confirmado" no añade ruido si es el estado normal.
- [ ] Las notas de evento/proyecto se pueden editar desde su contexto.

## Related

- [[../plans/backlog-mayo-2026]]

