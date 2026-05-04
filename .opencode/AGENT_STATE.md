# Estado Compartido De Agentes

Pizarra operativa para que los agentes de CulturaApp se coordinen sin esperar siempre a `cultura-lead`.

## Protocolo

- Lee este archivo al empezar cualquier tarea.
- Antes de escribir, relee el archivo para evitar pisar cambios recientes.
- Actualiza solo tu bloque en `Estado por agente` y añade una entrada corta en `Eventos`.
- No guardes secretos, datos personales reales ni valores de `.env.local`.
- Usa esto para senales de coordinacion, no como sustituto de `AGENTS.md`, Git o los tests.
- Si hay conflicto entre este archivo y el codigo, gana el codigo; si hay conflicto con `AGENTS.md`, gana `AGENTS.md`.

## Senales activas

Formato recomendado:

```text
- [estado] agente -> audiencia: mensaje breve. Archivos afectados: ruta/a, ruta/b.
```

Estados sugeridos: `info`, `bloqueo`, `schema_changed`, `api_changed`, `ui_changed`, `needs_review`, `verified`, `done`.

- [verified] lead -> all: Issue #48 implementada. Flag --delete añadido a pb:push. PR #49 mergeada. Sync limpio verificado.

- 2026-05-04 19:15 CET - lead - info - Issue #30: comando pb:capture creado. Script: scripts/product-brain-capture.mjs. Prefijos: inbox, idea, issue, decisión, contexto. Documentación: docs/project/prompts/product-brain-capture.md. Verificado: lint OK, agents:plan OK, agents:run OK.

- 2026-05-04 18:30 CET - lead - info - Regla cierre de issues documentada inicialmente; corregida despues para exigir enlace permanente issue->PR/commit y no cerrar issues con PR abierta antes del merge.
