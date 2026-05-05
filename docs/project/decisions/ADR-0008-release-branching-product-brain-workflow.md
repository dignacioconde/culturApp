---
id: ADR-0008
type: decision
status: Accepted
created: 2026-05-05
updated: 2026-05-05
aliases:
  - ADR-0008
tags:
  - product-brain
  - adr
  - workflow
  - releases
---

# ADR-0008 — Release branching gobernado por Product Brain

## Estado

Accepted

## Contexto

Cachés ya usa Product Brain repo-native como fuente de verdad. El flujo anterior mezclaba memoria de agentes, GitHub Issues, ramas directas desde `main` y documentos de release sin una capa operativa unificada.

Para que el proyecto deje de ser una suma de tareas sueltas, cada cambio debe poder trazarse desde una issue Markdown hasta release, rama, commit, validacion y resultado.

## Decision

Adoptar release branching gobernado por Product Brain:

- `docs/project/issues/` contiene las issues canonicas `CACH-*`.
- `docs/project/backlog/` muestra el pipeline operativo sin duplicar la issue.
- `docs/project/releases/CURRENT_RELEASE.md` declara release y rama activa.
- Cada release activa tiene rama `release/<version>` derivada del ID de release, por ejemplo `RELEASE-0.1.0-beta.1` -> `release/0.1.0-beta.1`.
- Las versiones `0.1`, `0.2`, etc. representan ciclos de producto u organizativos; los cortes `0.1.0-beta.N` son iteraciones mergeables a `main`; `0.1.0` consolida el ciclo y su changelog.
- Las ramas `feature/`, `fix/`, `docs/` y `chore/` salen de la release activa si pertenecen a ella.
- Los commits usan `<type>(CACH-XXXX): <summary>`.
- Las releases se cierran desde Product Brain antes de mergear a `main`.

## Consecuencias

Positivas:

- Product Brain responde por que existe cada cambio y donde se valida.
- `main` se mantiene estable.
- Los agentes tienen un contrato claro antes de implementar.
- Las release notes nacen de issues y no de memoria.
- El changelog final de ciclo puede construirse sumando cortes `beta.N`.

Costes:

- Hay que mantener `CURRENT_RELEASE.md` y `BACKLOG.md` al mover trabajo.
- La siguiente tarea real debe crear o usar la rama de release antes de tocar codigo.
- Hay que evitar meter demasiadas issues en un solo corte `beta.N`; si el ciclo continua, abrir el siguiente corte.
- GitHub Issues dejan de ser fuente principal y pasan a ser soporte tecnico cuando haya PR/CI.

## Alternativas consideradas

- Seguir con ramas directas desde `main`: mas rapido a corto plazo, peor trazabilidad.
- Usar solo GitHub Issues como backlog: contradice ADR-0003 y saca contexto del repo.
- GitFlow completo: demasiado pesado para el tamano actual del proyecto.

## Fecha

2026-05-05

## Relacionado con

- [[../issues/CACH-B0015]]
- [[../releases/CURRENT_RELEASE]]
- [[../process/DEVELOPMENT_WORKFLOW]]
- [[../process/BRANCHING_STRATEGY]]
