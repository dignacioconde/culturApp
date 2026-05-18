---
schema_version: 2
kind: process
id: PB-FRONTMATTER-SCHEMA
title: Frontmatter schema
lifecycle: active
created: '2026-05-05'
updated: '2026-05-18'
aliases:
  - Frontmatter schema
tags:
  - product-brain
  - process
  - schema
generated: false
---
# Frontmatter schema

## Campos comunes

Todos los documentos no-template del Product Brain usan estos campos base:

```yaml
schema_version: 2
kind: issue | decision | release | plan | knowledge | context | process | prompt | feedback | inbox | index | digest | template | exploration
id: ID-CANONICO
title: Titulo claro
lifecycle: active | draft | historical | deprecated | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
aliases: []
tags: []
generated: false
```

Campos opcionales preparados para orientación de agentes y futura indexación RAG local:

```yaml
load_policy: default | profile_only | on_reference | do_not_load_by_default
index_policy: index | index_metadata_only | no_index
```

Reglas:

- `load_policy` indica cuándo puede cargarse el documento como contexto de agente.
- `index_policy` indica si una futura capa de retrieval debería indexar contenido completo, solo metadata o nada.
- En Fase 1 ambos campos son opcionales para evitar migración masiva de documentos existentes.
- Si faltan, se aplican las reglas por tipo de [[document-types-registry]] y `docs/agent-context-policy.md`.

## Context

Los documentos `kind: context` pueden añadir:

```yaml
context_type: current_state | architecture_context | constraint | product_context | design_context | technical_context | process_context
```

Reglas:

- `context_type` es opcional en Fase 1.
- Sirve para orientar perfiles de retrieval sin convertir `context/` en un cajón ambiguo.
- No sustituye a `kind`; solo subclasifica documentos de contexto.

## Issues

```yaml
schema_version: 2
kind: issue
id: CACH-0017
title: Titulo claro
lifecycle: active
created: 2026-05-05
updated: 2026-05-08
aliases:
  - CACH-0017
tags:
  - product-brain
  - issue
generated: false
work_type: bug | feature | chore | spike | doc
work_level: initiative | slice | task
issue_workflow: inbox | backlog | ready | in_progress | review | blocked | done | wont_fix
priority: p0 | p1 | p2 | p3
size: xs | s | m
area: frontend | data | backend | infra | docs | brain | security
components:
  - dashboard
parent: CACH-B0002 | null
related: []
depends_on: []
blocked_by: []
adr: []
release: RELEASE-0.1.0-beta.2 | null
theme: beta-trust | core-work-ux | finance-operations | portability-onboarding | pro-growth | internal-agent-ops | null
```

## Reglas

- `release` debe ser `null` o coincidir con un archivo de `docs/project/releases/`.
- Si una issue tiene `release`, debe aparecer en el `## Scope` de esa release.
- Si una release lista una issue en `## Scope`, la issue debe apuntar a esa release.
- `work_level: initiative` nunca pasa a `ready`; se parte en `slice`.
- `size` solo permite `xs`, `s` o `m`; si parece grande, se divide.
- `parent` expresa jerarquia y debe apuntar a una initiative existente; `related` queda para relaciones laterales.
- No usar `type/status` top-level en Product Brain v2.
- Excluir `issue_workflow: done` del contexto por defecto salvo referencia explícita, auditoría o trazabilidad.
- Excluir `release_phase: released`, prompts históricos y documentos `deprecated`, `historical` o `archived` del contexto por defecto salvo investigación explícita.

## Relacionado

- [[../decisions/ADR-0010-frontmatter-schema|ADR-0010]]
- [[document-types-registry]]
