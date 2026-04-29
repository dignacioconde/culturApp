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

<!-- Nuevas senales encima de esta linea. -->

## Estado por agente

### cultura-frontend

- Estado: done
- Ownership actual: -
- Depende de: `schema_changed`, `api_changed`
- Ultima actualizacion: revision metricas cobro/hora corregida

### cultura-data

- Estado: idle
- Ownership actual: -
- Publica cuando cambien: schema SQL, hooks de datos, shape de datos, filtros Supabase
- Ultima actualizacion: -

### cultura-testing

- Estado: done
- Ownership actual: -
- Depende de: `schema_changed`, `api_changed`, `ui_changed`, `needs_review`
- Ultima actualizacion: revisar metricas financieras

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

<!-- Nuevos eventos encima de esta linea. -->

- 2026-04-29 18:50 CET - cultura-frontend - done - Metrica cobro bruto/hora ajustada: solo ingresos cobrados vinculados a eventos / horas de esos eventos.
- 2026-04-29 18:45 CET - cultura-testing - done - Revision metricas cobro/hora: veredicto con problemas, 3 riesgos (ProjectDetail infla tasa, Dashboard desfase, UX "-_" frecuente).
- 2026-04-29 18:30 CET - cultura-frontend - needs_review - Revision metricas cobro bruto/hora: 6 hallazgos, 2 riesgos altos (ProjectDetail mezcla ingresos, Dashboard desfase temporal).
