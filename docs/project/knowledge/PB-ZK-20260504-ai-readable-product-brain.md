---
id: PB-ZK-20260504-AI-READABLE-PRODUCT-BRAIN
type: zk
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Product Brain legible por IA
tags:
  - product-brain
  - knowledge
  - agents
  - docs
---

# Product Brain legible por IA — 2026-05-04

## Idea

Un Product Brain útil para agentes necesita tres capas: una ruta mínima de lectura, IDs canónicos estables y validación automática.

## Aprendizaje

La estructura por carpetas (`context/`, `issues/`, `decisions/`, `knowledge/`) es buena para lectura humana e IA, pero se degrada rápido si los wikilinks usan formas cortas (`CACH-B001`) que no coinciden con filenames (`CACH-B0001.md`).

Los agentes tienden a declarar la tarea resuelta tras corregir una parte visible si no hay una comprobación ejecutable. `npm run pb:check` convierte esa consistencia en gate verificable.

## Reglas Prácticas

- Mantener `START_HERE.md` como ruta de entrada, no como documento exhaustivo.
- Usar siempre el ID completo del filename en wikilinks: `CACH-0026`, `CACH-B0001`.
- Ejecutar `npm run pb:check` antes de cerrar cambios en `docs/project/`.
- Si se añade un archivo a `issues/`, `decisions/`, `knowledge/` o `releases/`, actualizar su índice correspondiente.

## Relacionado Con

- [[../START_HERE|START_HERE]]
- [[../issues/CACH-B0010|CACH-B0010]]
- [[../decisions/ADR-0003-repo-native-product-brain|ADR-0003-repo-native-product-brain]]
