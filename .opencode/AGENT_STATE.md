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

- [verified] lead -> all: Rediseño paper/tinta #43 mergeado. Build OK. PR #44 cerrada.
- [verified] lead -> all: Issue #48 implementada. Flag --delete añadido a pb:push. PR #49 mergeada. Sync limpio verificado.

## Estado por agente

### cultura-data

- Estado: idle
- Ownership actual: -
- Publica cuando cambien: schema SQL, hooks de datos, shape de datos, filtros Supabase
- Ultima actualizacion: -

### cultura-frontend

- Estado: idle
- Ownership actual: -
- Depende de: `ui_changed`, cambios responsive, formularios, calendarios
- Ultima actualizacion: -

### cultura-ux-desktop

- Estado: idle
- Ownership actual: -
- Depende de: `ui_changed`, cambios de layout amplio, tablas, dashboard, ProjectDetail, calendarios desktop
- Ultima actualizacion: -

### cultura-ux-mobile

- Estado: idle
- Ownership actual: -
- Depende de: `ui_changed`, cambios responsive, formularios moviles, navegacion tactil, calendarios en viewport pequeno
- Ultima actualizacion: -

### cultura-testing

- Estado: idle
- Ownership actual: -
- Depende de: `schema_changed`, `api_changed`, `ui_changed`, `needs_review`
- Ultima actualizacion: -

### cultura-review

- Estado: idle
- Ownership actual: -
- Depende de: `needs_review`, cambios grandes, cierre pre-merge
- Ultima actualizacion: -

### cultura-security

- Estado: idle
- Ownership actual: -
- Depende de: auth, RLS, secretos, cambios de deploy, consultas Supabase
- Ultima actualizacion: -

### cultura-release

- Estado: idle
- Ownership actual: -
- Depende de: build verificado, variables de entorno, checklist Supabase/Vercel
- Ultima actualizacion: -

### cultura-docs

- Estado: idle
- Ownership actual: -
- Depende de: cambios de arquitectura, scripts, agentes, SQL o flujo de deploy
- Ultima actualizacion: -

## Eventos

Formato:

```text
- YYYY-MM-DD HH:mm CET - agente - estado - mensaje.
```

- 2026-05-05 10:00 CET - lead - verified - Issue #53: RELEASE-0.1-beta GitHub Release + Milestone creados. RELEASE-0.1-beta.md actualizado con sync workflow. PR #54 mergeada. Rama borrada.

- 2026-05-04 19:15 CET - lead - info - Issue #30: comando pb:capture creado. Script: scripts/product-brain-capture.mjs. Prefijos: inbox, idea, issue, decisión, contexto. Documentación: docs/project/prompts/product-brain-capture.md. Verificado: lint OK, agents:plan OK, agents:run OK.

- 2026-05-04 18:30 CET - lead - info - Regla cierre de issues documentada inicialmente; corregida despues para exigir enlace permanente issue->PR/commit y no cerrar issues con PR abierta antes del merge.
