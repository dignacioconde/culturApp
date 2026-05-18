---
schema_version: 2
kind: process
id: PB-DOCUMENT-TYPES-REGISTRY
title: Document Types Registry
lifecycle: active
created: '2026-05-18'
updated: '2026-05-18'
aliases:
  - Document Types Registry
  - Registry documental
tags:
  - product-brain
  - process
  - schema
  - retrieval
generated: false
---
# Document Types Registry

Registro ligero de tipos documentales del Product Brain. Su objetivo es que humanos y agentes entiendan para qué sirve cada documento, cuándo se carga y cómo debe tratarse en una futura capa RAG sin acoplar `src/` al Brain.

## Campos de contexto

Los documentos pueden declarar estos campos opcionales:

```yaml
load_policy: default | profile_only | on_reference | do_not_load_by_default
index_policy: index | index_metadata_only | no_index
```

Los documentos `kind: context` pueden declarar además:

```yaml
context_type: current_state | architecture_context | constraint | product_context | design_context | technical_context | process_context
```

Si los campos no existen, se aplican las reglas por tipo de este registry y la política canónica de carga de contexto.

`pb:retrieve` usa estas reglas como filtro local determinista. No crea embeddings, chunks persistentes ni índices externos.

## Tipos documentales

| kind | Ubicación habitual | Propósito | Carga por defecto | Indexación recomendada |
|---|---|---|---|---|
| `issue` | `issues/` | Trabajo ejecutable o iniciativa trazable. | Solo issue activa/referenciada; excluir `issue_workflow: done` salvo referencia explícita. | `index` si no está cerrada; `index_metadata_only` si está done. |
| `decision` | `decisions/` | Decisiones duraderas de producto, arquitectura, datos, UX o proceso. | Cargar ADR aceptada si afecta la tarea; no cargar todas. | `index`, priorizando `decision_status: Accepted`. |
| `release` | `releases/` | Corte agrupado de entrega y verificación. | Solo release activa o referenciada; excluir `release_phase: released` por defecto. | `index_metadata_only` si está released; `index` si está active/draft. |
| `release_status` | `releases/CURRENT_RELEASE.md` | Estado de release activa. | Cargar solo si la tarea afecta release o planificación. | `index_metadata_only`. |
| `plan` | `plans/` | Foco operativo y planificación viva. | Cargar solo para planificación, release o roadmap. | `index_metadata_only` para current plan; `no_index` para planes históricos si aparecen. |
| `knowledge` | `knowledge/` | Aprendizaje reutilizable, investigación curada y gotchas. | Cargar por perfil o referencia, no completo. | `index`. |
| `context` | `context/` | Contexto estable o semiestable del producto/proyecto. | Cargar por perfil según `context_type`. | `index` o `index_metadata_only` según estabilidad. |
| `process` | `process/` | Workflow, políticas, definición de ready/done y governance. | Cargar cuando la tarea toque proceso, Product Brain o agentes. | `index_metadata_only`, excepto docs canónicos. |
| `prompt` | `prompts/` | Prompts reutilizables o históricos. | No cargar por defecto; prompts históricos quedan excluidos. | `no_index` si histórico; `index_metadata_only` si activo. |
| `feedback` | `feedback/` | Señales cualitativas de beta o usuarios. | No cargar por defecto; usar en triage/research. | `index_metadata_only` sin datos personales. |
| `inbox` | `inbox/` | Capturas pendientes de curar. | No cargar por defecto; solo curaduría. | `index_metadata_only` o `no_index` si histórico. |
| `index` | `indexes/`, `README.md` | Navegación y orientación. | Leer primero cuando corresponda. | `index_metadata_only`. |
| `digest` | `DIGEST.md` | Resumen generado de estado. | Útil para orientación; no editar manualmente. | `index_metadata_only`. |
| `template` | `templates/`, `releases/RELEASE_TEMPLATE.md` | Plantillas para crear documentos. | Solo al crear documentos de ese tipo. | `no_index`. |
| `exploration` | `explorations/` | Investigación puntual o auditoría exploratoria. | No cargar por defecto si `historical`. | `index_metadata_only` solo para research. |

## Reglas de exclusión por defecto

- `lifecycle: deprecated`, `historical` o `archived` queda fuera del contexto por defecto.
- `kind: prompt` con `lifecycle: historical` queda fuera del contexto por defecto.
- `kind: issue` con `issue_workflow: done` no se usa como instrucción viva; solo como evidencia o trazabilidad si se cita.
- `kind: release` con `release_phase: released` no se carga salvo tareas de release, auditoría, changelog, investigación histórica o referencia explícita.
- Las plantillas no son fuente de verdad de producto; se usan para crear documentos nuevos.
- Los documentos generados (`generated: true`) se regeneran con scripts y no se editan a mano.

## Relacionado

- [[frontmatter-schema]]
- [[WORKFLOW]]
- `docs/agent-context-policy.md`
