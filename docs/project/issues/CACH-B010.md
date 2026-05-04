---
id: CACH-B010
type: issue
status: Backlog
priority: Medium
release: Internal
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B010
tags:
  - product-brain
  - issue
  - tooling
  - agents
---

# CACH-B010 — Tooling de agentes y modelos de desarrollo

## Summary

Mejorar el entorno de desarrollo con creación de issues desde Codex/notas, skill autobrowse, LLM local y routing inteligente de modelos.

## Context

Agrupa #9, #21, #22, #23, #24 y #25. Es tooling interno, no producto usuario final.

## Problem

El proyecto depende cada vez más de rituales de agentes. Hace falta reducir fricción y coste sin mezclar tooling interno con la app Cachés.

## Proposed Solution

- Crear issues desde Codex/notas cuando vaya a implementarse.
- Explorar skill autobrowse.
- Investigar LLM local 8B para tareas simples.
- Definir casos de uso antes de integrar modelo local.
- Diseñar routing inteligente entre modelos según tarea.

## Acceptance Criteria

- [ ] El tooling no contamina la UX ni el runtime de Cachés.
- [ ] Los casos del LLM local están documentados antes de integrar.
- [ ] El routing de modelos tiene criterios observables.
- [ ] Las ideas de Product Brain no se convierten en GitHub Issues salvo implementación.

## Related

- [[CACH-026]]
- [[CACH-028]]

