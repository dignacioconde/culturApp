---
schema_version: 2
kind: issue
id: CACH-XXXX
title: Titulo de la issue
lifecycle: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
aliases:
  - CACH-XXXX
tags:
  - product-brain
  - issue
generated: false
work_type: bug | feature | chore | spike | doc
work_level: initiative | slice | task
issue_workflow: inbox | backlog | ready | in_progress | review | blocked | done | wont_fix
priority: p1
size: xs | s | m
area: frontend | data | backend | infra | docs | brain | security
components:
  - dashboard
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: null
theme: beta-trust | core-work-ux | finance-operations | portability-onboarding | pro-growth | internal-agent-ops | null
---

# CACH-XXXX — Titulo de la issue

## Objetivo

Que debe quedar conseguido.

## Alcance

Que esta incluido y que queda fuera.

## Criterios de aceptacion

- [ ] AC1: Criterio observable y verificable desde comportamiento de usuario, sistema o datos.
- [ ] AC2: Segundo criterio si hace falta separar otro resultado comprobable.

## Plan tecnico

Solo si aplica: obligatorio para `size: m`, datos/RLS/seguridad/infra, `finance`, `supabase`, `auth-onboarding` o cambios multi-componente. Mantener corto: contratos afectados, hooks/modulos esperados, migraciones, estados UX o riesgos de integracion. No copiar reglas globales ni cerrar una solucion innecesariamente.

## Escenarios SDD

Solo Nivel 2. Usar cuando haya riesgo o complejidad: `size: m`, datos/RLS/seguridad/infra, `finance`, `supabase`, `auth-onboarding`, `calendar`, cambios multi-componente, varios agentes/PRs o ambiguedad repetida.

- Cuando <situacion observable>, entonces <resultado esperado>.

## Contrato tecnico

Solo Nivel 2. Nombrar contratos, modulos, hooks, schemas, policies, scripts, estados UX o superficies afectadas. Mantenerlo como mapa de trabajo, no como implementacion cerrada.

## Riesgos y rollback

Solo Nivel 2 cuando haya datos, seguridad, infra, finanzas, Supabase o auth. Indicar riesgo principal y como revertir, desactivar o verificar que no rompe produccion.

## Validacion

Checks esperados al terminar. Deben mencionar los IDs `AC1`, `AC2`, etc. que cubren y ser especificos del dominio cuando toque datos, seguridad, infra, finanzas, Supabase, calendario o sistema visual.

Para Nivel 2, usar matriz ligera:

- AC1 -> check/evidencia concreta.
- AC2 -> check/evidencia concreta.

## Resultado

Pendiente hasta cerrar la issue.

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

Actualizada en ... / no aplica.
