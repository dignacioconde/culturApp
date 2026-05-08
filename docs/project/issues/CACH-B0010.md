---
schema_version: 2
kind: issue
id: CACH-B0010
title: Tooling de agentes y modelos de desarrollo
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - CACH-B0010
tags:
  - product-brain
  - issue
  - tooling
  - agents
generated: false
work_type: chore
work_level: initiative
issue_workflow: backlog
priority: p2
size: m
area: infra
components:
  - agents
  - infra-deploy
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: internal-agent-ops
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
- Piloto controlado: `GPT-5.5` como lead/orquestador/verificador y `GPT-5.3-Codex-Spark` solo como worker rápido para tareas locales, acotadas y verificables.
- Registrar telemetría operativa por run en `.opencode/runs/`: modelo por rol, tipo de tarea, motivo de routing, ownership, verificación, retries, escalaciones, coste estimado, duración y resultado.
- No convertir Spark en default hasta validar coste por tarea aceptada y defectos post-merge.

## Acceptance Criteria

- [ ] El tooling no contamina la UX ni el runtime de Cachés.
- [ ] Los casos del LLM local están documentados antes de integrar.
- [ ] El routing de modelos tiene criterios observables.
- [ ] El piloto compara 20-30 tareas reales entre `GPT-5.5` solo y `GPT-5.5 lead + Spark workers`.
- [ ] Spark solo se usa con ownership explícito, bajo riesgo, verificación objetiva y máximo 1 retry antes de escalar.
- [ ] Datos/RLS, seguridad, finanzas, calendarios complejos, review final, PR/release y acciones sensibles quedan reservadas para `GPT-5.5` o revisión fuerte.
- [ ] Cada ejecución de agentes deja telemetría operativa en `.opencode/runs/<timestamp>/metadata.json`.
- [ ] La promoción de Spark exige 25-40% menos coste o latencia sin aumento de CI rojo, bugs post-merge ni findings severos.
- [ ] Las ideas de Product Brain no se convierten en GitHub Issues salvo implementación.

## Validation Plan

- Medir coste por tarea aceptada, tasa de aceptación a la primera, retries, tiempo end-to-end, fallos de lint/build/test, findings de review, defectos escapados, escalaciones y conflictos por ownership.
- Mantener los logs y metadatos del piloto como estado operativo en `.opencode/runs/`; no guardarlos en `.memory/`.
- Revisar el piloto antes de cambiar de forma masiva los campos `model:` de los perfiles OpenCode.

## Related

- [[CACH-0026|CACH-0026]]
- [[CACH-0028|CACH-0028]]
- [[../context/agent-workflow-guardrails-20260504|agent-workflow-guardrails-20260504]]
- [[../decisions/ADR-0007-product-brain-sync-delete|ADR-0007-product-brain-sync-delete]]

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
