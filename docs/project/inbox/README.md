---
id: PB-INBOX
type: index
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Inbox
tags:
  - product-brain
  - inbox
---

# Inbox

Capturas rápidas pendientes de curar. Desde móvil, si la idea está verde, entra aquí antes de convertirse en ZK, issue, ADR o contexto estable.

## Captura rapida

Crear una nota simple:

```bash
npm run pb:capture -- "texto de la idea o feedback"
```

Crear una nota con titulo y tags:

```bash
npm run pb:capture -- --title "Feedback beta cobros" --tag beta,feedback "La usuaria no entiende si el cache esta cobrado"
```

El comando crea un Markdown en `docs/project/inbox/` con timestamp de segundos y slug. Si coinciden dos capturas en el mismo segundo, anade sufijo incremental para no pisar archivos.

## Que entra aqui

- Ideas verdes sin problema ni usuario claro.
- Feedback cualitativo sin clasificar.
- Notas rapidas desde movil o durante una sesion.
- Preguntas que necesitan triage antes de ser backlog.

## Que no entra aqui

- Issues listas para implementar: crear `docs/project/issues/CACH-XXXX.md`.
- Decisiones duraderas: crear ADR.
- Contexto estable del producto: mover a `context/` o `knowledge/`.
- Historial operativo de una tarea actual: actualizar la issue relacionada.

## Weekly review

No usar como backlog permanente. En modo `PB ironman`, revisar, clasificar y mover.

1. Revisar capturas recientes.
2. Clasificar cada una como `issue`, `ZK`, `ADR`, `contexto`, `duplicado`, `rechazado` o dejarla en inbox con motivo.
3. Enlazar la pieza resultante y borrar o archivar la captura solo cuando el contenido quede curado.
