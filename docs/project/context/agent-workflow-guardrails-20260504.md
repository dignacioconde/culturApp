---
id: PB-CTX-AGENT-WORKFLOW-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Guardrails workflow agentes 2026-05-04
tags:
  - product-brain
  - context
  - workflow
  - agents
---

# Guardrails workflow agentes — 2026-05-04

## Roles OpenCode

- Explorer: lee codigo, diagnostica y propone. No edita archivos.
- Worker: implementa una tarea concreta con ownership explicito de archivos o modulos.
- Reviewer: revisa el diff desde postura de code review, buscando bugs, regresiones, inconsistencias con `AGENTS.md` y pruebas faltantes.

Separar roles cuando la tarea tenga riesgo, varias areas afectadas o necesite revision independiente. Para tareas de agentes, no hacer investigacion manual previa por defecto; lanzar el flujo estipulado y dejar que diagnostiquen.

## AGENT_STATE.md

Los agentes solo deben anadir su senal o bloque en `.opencode/AGENT_STATE.md`. No deben reescribir el archivo completo.

Gotcha detectado el 2026-05-04: un agente sobrescribio el archivo al cerrar una issue, borrando la seccion completa `Estado por agente` y senales anteriores.

Forma correcta:

- Leer el archivo primero.
- Anadir solo la entrada nueva en `Señales activas`.
- Actualizar solo el bloque del agente correspondiente en `Estado por agente`.
- Revisar el diff despues de cada run que toque ese archivo.

## Bugs Visuales

Cuando se reporte un bug visual, incluir:

- ruta exacta;
- viewport o condicion de reproduccion;
- sintoma concreto;
- captura si existe;
- criterio visual de aceptacion.

Para calendarios, exigir evidencia de toolbar, cabecera y filas/semanas visibles.

## Relacionado Con

- [[../issues/CACH-B0010|CACH-B0010]]
- [[ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../knowledge/PB-ZK-20260504-rbc-height|PB-ZK-20260504-rbc-height]]
