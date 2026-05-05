---
id: CACH-B0010
title: Tooling de agentes y modelos de desarrollo
type: chore
status: backlog
cycle: unassigned
release: null
priority: p2
estimate: m
area: infra
created_at: 2026-05-04
updated_at: 2026-05-04
aliases:
  - CACH-B0010
tags:
  - product-brain
  - issue
  - tooling
  - agents
---

# CACH-B0010 — Tooling de agentes y modelos de desarrollo

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

- [[CACH-0026|CACH-0026]]
- [[CACH-0028|CACH-0028]]
- [[../context/agent-workflow-guardrails-20260504|agent-workflow-guardrails-20260504]]
- [[../decisions/ADR-0007-product-brain-sync-delete|ADR-0007-product-brain-sync-delete]]
