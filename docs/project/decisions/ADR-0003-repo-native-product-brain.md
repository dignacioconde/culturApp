---
id: ADR-0003
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0003
tags:
  - product-brain
  - adr
  - workflow
---

# ADR-0003 — Product Brain repo-native y GitHub solo para implementacion

## Context

Cachés necesita un cerebro de producto navegable en Obsidian, pero tambien versionado junto al codigo para que Codex, Claude Code y agentes OpenCode compartan contexto.

GitHub Issues siguen siendo utiles para trabajo implementable, pero no para capturar cada idea o decision incipiente.

## Decision

El Product Brain vive en `docs/project/` y se sincroniza manualmente con el vault de Obsidian en iCloud. Las issues Markdown con prefijo `CACH` son backlog de producto. GitHub Issues se crean solo cuando una entrada vaya a implementarse con rama, agentes, PR, merge y verificacion.

`.memory/` queda separado: guarda preferencias, reglas de trabajo y gotchas duraderos para agentes; no sustituye al Product Brain ni al backlog.

## Consequences

- Las ideas pueden madurar en el repo antes de convertirse en trabajo de GitHub.
- El estado operativo de PRs/commits no se duplica en memoria.
- Antes de curar o capturar hay que revisar `pb:status` para no pisar el vault.
- El Product Brain debe tener indices y decisiones suficientes para navegar, no solo una bandeja de notas.

## Alternatives Considered

- Usar solo GitHub Issues: demasiado operativo para ideas y contexto de producto.
- Usar solo Obsidian fuera del repo: comodo para escritura humana, pero invisible para agentes sin sync.
- Usar `.memory/` como backlog: mezcla preferencias de agentes con producto y se vuelve dificil de auditar.

## Related

- [[../START_HERE]]
- [[../issues/CACH-026]]
- [[../issues/CACH-028]]
- [[../issues/CACH-B010]]
