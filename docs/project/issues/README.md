---
schema_version: 2
kind: index
id: PB-ISSUES
title: Issues
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - Issues
tags:
  - product-brain
  - issues
generated: false
---
# Issues

Backlog ejecutable en Markdown. Las issues usan prefijo `CACH`, por ejemplo [[CACH-0026]].

GitHub Issues se crean solo cuando una issue vaya a implementarse.

## Flujo

- Tablero operativo: [[../backlog/BACKLOG|Backlog]]
- Plantilla canonica: [[../templates/ISSUE_TEMPLATE|Issue Template]]
- Workflow completo: [[../process/WORKFLOW|Workflow]]

Workflow valido de issue: `inbox`, `backlog`, `ready`, `in_progress`, `review`, `blocked`, `done`, `wont_fix`.

Niveles validos: `initiative`, `slice`, `task`. Las iniciativas agrupan trabajo y no pasan a `ready`; una slice ready debe ser ejecutable leyendo la issue, su parent si existe y los source-touchpoints relevantes.
