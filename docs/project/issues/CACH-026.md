---
id: CACH-026
type: issue
status: Done
priority: High
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
github: https://github.com/dignacioconde/culturApp/issues/26
aliases:
  - CACH-026
tags:
  - product-brain
  - issue
---

# CACH-026 — Setup inicial Product Brain

## Problema

Crear Product Brain repo-native en `docs/project/` con sync manual al vault Obsidian de iCloud.

## Solución

- Estructura Obsidian-friendly: inbox, context, knowledge, issues, decisions, releases, plans, indexes, templates, prompts
- Scripts npm: pb:init, pb:status, pb:pull, pb:push
- Prefijo CACH para issues markdown
- Sync manual con aviso ante conflictos, sin borrar automáticamente en v1
- START_HERE.md con frontmatter y wikilinks

## Criterios De Aceptación

- [x] Crear `docs/project/`.
- [x] Añadir scripts npm de Product Brain.
- [x] Mantener `.memory/` separado.
- [x] Crear PR operativa enlazada a GitHub Issue.

## Notas De Implementación

La primera implementación se completó en la PR #27 y generó una corrección posterior en [[CACH-028]] para ajustar la ruta real del vault iCloud y versionar la estructura completa.

## Véase también

- [[START_HERE|Product Brain]]
- [[CACH-028]]
