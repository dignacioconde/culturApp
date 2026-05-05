---
id: PB-BACKLOG-TRIAGE
type: backlog
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Triage backlog
tags:
  - product-brain
  - backlog
  - triage
---

# Triage

Mesa de decision para convertir ideas en trabajo ejecutable o archivarlas.

## Preguntas de triage

1. Que problema concreto resuelve?
2. Para que tipo de usuario o flujo importa?
3. Pertenece a la release activa?
4. Necesita ADR, spike o investigacion previa?
5. Puede partirse en una issue con criterios de aceptacion claros?
6. Que riesgo introduce si se implementa ahora?

## Destinos posibles

| Destino | Cuando usarlo |
|---|---|
| Issue `CACH-*` | Trabajo implementable con acceptance criteria. |
| ADR | Decision importante de arquitectura, datos, UX o workflow. |
| Knowledge | Investigacion o aprendizaje reutilizable. |
| Context | Estado estable del producto/proyecto. |
| Ideas | Posibilidad interesante pero inmadura. |
| Archived | Duplicada, descartada o fuera de foco. |

## Pendiente de decision

| Entrada | Tipo probable | Decision pendiente |
|---|---|---|
| Pendiente | Pendiente | No hay entrada activa en triage. |

## Definition of Ready

Una issue puede pasar a `Ready for development` cuando:

- tiene objetivo claro;
- tiene release asignada o se declara fuera de release;
- define incluido y fuera de alcance;
- tiene criterios de aceptacion verificables;
- tiene rama sugerida;
- no bloquea por dudas criticas;
- tiene dependencias identificadas.

## Relacionado

- [[BACKLOG]]
- [[../process/DEVELOPMENT_WORKFLOW|Development Workflow]]
