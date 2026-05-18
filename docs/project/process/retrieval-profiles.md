---
schema_version: 2
kind: process
id: PB-RETRIEVAL-PROFILES
title: Retrieval profiles
lifecycle: active
created: '2026-05-18'
updated: '2026-05-18'
aliases:
  - Retrieval profiles
  - Perfiles de retrieval
tags:
  - product-brain
  - process
  - retrieval
generated: false
---
# Retrieval profiles

`pb:retrieve` es retrieval local y determinista para orientar agentes sin convertir Product Brain en una arquitectura RAG pesada. No genera chunks persistentes, embeddings, vector DB ni llamadas externas.

## Uso

```bash
npm run pb:retrieve -- --profile planning --query "calendario"
npm run pb:retrieve -- --profile implementation --issue CACH-0095 --json
```

La salida devuelve documentos candidatos con `rel`, `id`, `title`, `kind`, `score` y `reason`. El score solo ordena contexto probable; no sustituye `pb:orient`, la issue ejecutable ni las reglas de carga de `docs/agent-context-policy.md`.

## Perfiles

| Perfil | Uso | Tipos preferidos |
|---|---|---|
| `planning` | Triage, scope y roadmap ligero. | `digest`, `index`, `issue`, `plan`, `decision`, `process`, `context`, `knowledge` |
| `implementation` | Preparar una tarea ejecutable. | `issue`, `decision`, `process`, `context`, `knowledge`, `index` |
| `review` | Revisar una issue, diff o cierre. | `issue`, `process`, `decision`, `context`, `knowledge`, `index` |
| `docs` | Curar Product Brain, prompts o memoria documental. | `process`, `decision`, `knowledge`, `context`, `index`, `digest`, `prompt` |
| `release` | Orientar cortes, scope y cierre de release. | `release_status`, `release`, `issue`, `process`, `decision`, `index`, `digest` |

## Exclusiones por defecto

- Excluir `lifecycle: historical`, `deprecated` o `archived` salvo referencia explícita desde la issue solicitada.
- Excluir `issue_workflow: done` o `wont_fix` salvo referencia explícita.
- Excluir releases con `release_phase: released`, `deprecated` o `archived` salvo referencia explícita.
- Excluir `load_policy: do_not_load_by_default` y `load_policy: on_reference` si no hay referencia explícita.
- Excluir siempre `index_policy: no_index`.
- Tratar `index_policy: index_metadata_only` como metadata buscable, no como contenido completo.
- No cargar prompts históricos como instrucciones actuales.

## Relacionado

- [[frontmatter-schema]]
- [[document-types-registry]]
- [[WORKFLOW]]
