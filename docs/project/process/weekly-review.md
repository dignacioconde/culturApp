---
id: PB-WEEKLY-REVIEW
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Weekly Review
tags:
  - product-brain
  - process
  - review
---

# Weekly Review

Checklist de 15-20 minutos para que el Product Brain no se convierta en decorado.

## Inbox

- Revisar `docs/project/inbox/`.
- Convertir cada captura en issue, knowledge, ADR, contexto o descartarla.
- Si tarda menos de 2 minutos, resolverlo en el momento.

## Backlog

- Confirmar que `BACKLOG.md` refleja estado real.
- Partir cualquier issue que no quepa en una sesion pequena.
- Mover `blocked` y `wontfix` a notas, no a columnas nuevas.

## Release

- Revisar `CURRENT_RELEASE.md`.
- Confirmar que cada issue con release aparece en el `## Scope`.
- Cerrar releases pequenas; evitar ramas largas.

## Validacion

- Ejecutar `npm run pb:check`.
- Ejecutar `npm run pb:index` si se han movido issues, ADRs, knowledge o releases.
