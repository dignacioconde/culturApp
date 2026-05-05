---
id: PB-PROCESS-AGENT-WORKFLOW
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Agent Workflow
  - Workflow de agentes
tags:
  - product-brain
  - process
  - agents
---

# Agent Workflow

Contrato operativo para Codex, Claude Code y agentes OpenCode.

## Antes de implementar

Leer, como minimo:

- [[../START_HERE|Product Brain]]
- [[../releases/CURRENT_RELEASE|Current Release]]
- [[../plans/CURRENT_PLAN|Current Plan]]
- [[../backlog/BACKLOG|Backlog]]
- issue `CACH-*` relacionada;
- ADRs o contexto enlazados desde la issue.

Si la tarea toca arquitectura, datos, release branching, estilos globales o workflow, revisar tambien [[../indexes/decisions.index|Decisions Index]].

## Respuesta inicial obligatoria

```md
## Contexto leido

- Release activa:
- Rama esperada:
- Issue relacionada:
- Estado actual:
- Riesgos detectados:

## Propuesta de trabajo

- Rama a usar:
- Archivos que se tocaran:
- Plan de implementacion:
- Validacion:
```

## Reglas criticas

- Ningun agente debe implementar una feature grande sin issue Markdown y sin release activa.
- Product Brain manda sobre GitHub Issues para producto, backlog y releases.
- GitHub se usa para PRs, checks, commits, milestones o trazabilidad tecnica cuando toque implementar.
- No se trabaja directamente sobre `main`.
- Si una feature pertenece a una release, su rama sale de la rama de release.
- Todo commit debe poder trazarse a una issue `CACH-*` o justificar que es hotfix/chore.
- Si aparece una decision importante, crear ADR antes de cerrar la issue.

## Durante la tarea

1. Confirmar rama esperada segun [[BRANCHING_STRATEGY]].
2. Implementar alcance cerrado.
3. Mantener commits pequenos y trazables segun [[COMMIT_CONVENTION]].
4. Ejecutar validacion relevante.
5. Actualizar issue con resultado, commits y validacion.
6. Actualizar release notes si aplica.
7. Actualizar backlog si cambia estado.
8. Ejecutar `npm run pb:check` si toca `docs/project/`.

## Al cerrar una issue

La issue debe incluir:

- estado final;
- resumen de resultado;
- commits relacionados;
- rama o PR relacionada;
- validacion ejecutada;
- deuda o seguimiento si existe.

## Al cerrar una release

El agente debe revisar:

- release notes;
- checklist de salida;
- issues incluidas;
- Current Release;
- Current Plan;
- estado actual de producto;
- branch cleanup.

## Bloqueos

Parar y reportar si:

- no hay release activa para una feature grande;
- no existe issue Markdown;
- la rama actual contradice la release activa;
- `pb:status` muestra conflicto con vault;
- hay cambios locales no relacionados que podrian pisarse;
- la validacion necesaria no puede ejecutarse.

## Relacionado

- [[DEVELOPMENT_WORKFLOW]]
- [[BRANCHING_STRATEGY]]
- [[RELEASE_PROCESS]]
- [[../context/agent-workflow-guardrails-20260504|Guardrails workflow agentes]]
