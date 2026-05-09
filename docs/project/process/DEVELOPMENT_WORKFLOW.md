---
schema_version: 2
kind: process
id: PB-PROCESS-DEVELOPMENT-WORKFLOW
title: Development Workflow
lifecycle: deprecated
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Development Workflow
  - Flujo de desarrollo
tags:
  - product-brain
  - process
  - development
generated: false
---
# Development Workflow

Este documento queda como stub historico. El flujo operativo canonico vive en [[WORKFLOW]].

Usa [[WORKFLOW]] para:

- tarea pequena directa a PR contra `main`;
- release multi-issue con rama `release/*`;
- validaciones bloqueantes y no bloqueantes;
- Obsidian sync;
- criterios para crear issues CACH y ADRs.

Estados v2:

- Issues: `issue_workflow: inbox | backlog | ready | in_progress | review | blocked | done | wont_fix`.
- Releases: `release_phase: draft | active | released | deprecated | archived`.

No usar estados legacy como `Ready for Release` o `Released` para issues.
