---
schema_version: 2
kind: process
id: PB-SDD-LEVELS
title: SDD por niveles
lifecycle: active
created: 2026-05-19
updated: 2026-05-19
aliases:
  - SDD por niveles
  - SDD Nivel 2
  - Nivel 2 SDD
  - Spec-driven development
  - Spec slice
tags:
  - product-brain
  - process
  - sdd
  - agents
generated: false
load_policy: profile_only
index_policy: index_metadata_only
---
# SDD por niveles

Caches usa SDD progresivo: suficiente especificacion para reducir rework, sin convertir cada tarea en un PRD largo ni duplicar reglas globales.

## Nivel 1 - Issue ejecutable

Nivel por defecto para tareas `xs` o `s` de bajo riesgo.

Requiere:

- Objetivo claro.
- Alcance con `Incluido` y `Fuera de alcance`.
- Criterios de aceptacion como checklist con IDs `AC1`, `AC2`, etc.
- Validacion esperada que mencione cada `ACn`.
- Plan tecnico corto cuando lo pida `pb:ready-check` o `pb:sdd-check`.

Gates:

- `npm run pb:ready-check -- CACH-XXXX`
- `npm run pb:sdd-check -- CACH-XXXX`

## Nivel 2 - Spec slice

Nivel obligatorio antes de ejecutar una issue si aparece cualquiera de estos triggers:

- `size: m`.
- `area: data`, `security` o `infra`.
- Componentes `finance`, `supabase`, `auth-onboarding` o `calendar`.
- Trabajo multi-componente.
- Trabajo que vaya a varios agentes, varias PRs o una release multi-issue.
- Cambio con migraciones, RLS, permisos, calculos financieros, sincronizacion, estados complejos de UI o riesgo alto de drift.
- Dolor repetido: criterios ambiguos, rework por scope, validacion que no prueba los ACs o agentes que no encuentran el contexto.

Requiere todo el Nivel 1 y ademas:

- `Escenarios SDD`: al menos un escenario observable con forma `Cuando... entonces...` o `Given/When/Then`.
- `Contrato tecnico`: contratos, modulos, hooks, schemas, policies, scripts, estados UX o superficies afectadas.
- `Validacion`: matriz ligera `ACn -> check/evidencia` dentro de la seccion de validacion.
- `Riesgos y rollback`: obligatorio cuando hay datos, seguridad, infra, finanzas, Supabase o auth.

El Nivel 2 no debe copiar contexto global. Debe enlazar ADRs, source touchpoints, memoria o docs canonicos cuando haga falta.

## Nivel 3 - Decision o dossier

Nivel excepcional, no automatico. Usarlo solo cuando una decision gobierna varias slices o releases.

Requiere:

- ADR o decision canonica si cambia arquitectura, modelo de datos, seguridad, finanzas o proceso durable.
- Initiative o parent que agrupe slices.
- Slices hijas ejecutables con Nivel 1 o Nivel 2.

No crear por defecto:

- Carpetas `.specify/`.
- Task dumps generados.
- Vector DB, embeddings o RAG pesado.
- Specs que repitan `AGENTS.md`, memoria o `WORKFLOW`.

## Relacionado

- [[definition-of-ready]]
- [[definition-of-done]]
- [[WORKFLOW]]
- [[retrieval-profiles]]
