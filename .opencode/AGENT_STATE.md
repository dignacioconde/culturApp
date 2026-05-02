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

- [verified] cultura-review -> cultura-frontend: Revisión responsividad calendarios: BLOQUEO resuelto. min-h-[620px] → min-h-[350px] sm:min-h-[450px] en CalendarEvents y CalendarProjects. Filtro URL ?project= implementado en EventList. Build OK, lint OK.
Archivos: CalendarEvents.jsx:109, CalendarProjects.jsx:102, EventList.jsx.
- [info] cultura-docs -> all: Metodo operativo consolidado para problemas nuevos: issue GitHub -> agentes -> fix verificado -> commit -> push -> comentario en issue con resumen/commit/verificaciones -> cerrar issue.
Archivos: AGENTS.md, CLAUDE.md, .opencode/README.md, .opencode/AGENT_STATE.md.
- [info] cultura-docs -> all: Leccion consolidada: bugs visuales/responsive deben incluir ruta, viewport, captura/sintoma exacto y criterio de aceptacion visual. En react-big-calendar verificar alturas computadas y que se ven las filas del mes; lint/build no bastan.
Archivos: AGENTS.md, CLAUDE.md, TECHDOC.md, .opencode/README.md.
- [verified] cultura-review -> cultura-data: Settings.jsx ahora usa useProfile (no Supabase directo). KPI cobro/hora filtra por mes seleccionado + solo ingresos cobrados event_id. Hook nuevo useProfile.js funciona.
Archivos: useProfile.js, Settings.jsx, Dashboard.jsx:86-107.
- [bloqueo] cultura-security -> cultura-data: KPI cobro bruto/hora CRITICO - no filtra por mes seleccionado. Dashboard.jsx:91-94 toma TODOS los eventos con ingresos cobrados, no solo los del mes. Calculo incorrecto. requiere fix urgente.
- [info] dispatcher -> workers: Iniciando investigacion paralela. 4 problemas identificados (1 critico calendarios, 1 alto Settings directa Supabase, 1 medio filtro URL, 1 medio KPI horas/mes). Invocando cultura-testing workers.
Archivos: CalendarEvents.jsx:109, CalendarProjects.jsx:102, Settings.jsx:20-55, Dashboard.jsx:91-93, EventList.jsx:1-65.

- [verified] cultura-frontend -> all: Fix responsividad calendarios completado. min-h-[350px] sm:min-h-[450px] OK. EventList filtro URL ?project= implementado.
- [verified] cultura-data -> all: useProfile.js creado, Settings ahora usa hook, KPI cobro/hora corregido: filtra horas por mes seleccionado + solo ingresos cobrados event_id.

## Estado por agente

### worker-data-settings-dashboard

- Estado: done
- Ownership actual: src/hooks/useProfile.js, src/pages/Settings/Settings.jsx, src/pages/Dashboard/Dashboard.jsx
- Ultima actualizacion: useProfile.js creado (CRUD Profile), Settings.jsx refactorizado (usa hook), KPI cobro bruto/hora corregido (filtra por mes seleccionado y solo ingresos cobrados event_id). lint OK, build OK.

### cultura-explorer

- Estado: done
- Ownership actual: -
- Ultima actualizacion: Issues pendientes identificadas - 1 BLOQUEO, build OK, metricas resueltas

### cultura-frontend

- Estado: done
- Ownership actual: -
- Depende de: -
- Ultima actualizacion: Fix responsividad calendarios: min-h-[620px] reemplazado por valores responsive en CalendarEvents y CalendarProjects. Filtro URL ?project= implementado en EventList con useSearchParams y clearFilters. Build OK, lint OK (1 error preexistente en Settings.jsx).

### cultura-data

- Estado: idle
- Ownership actual: -
- Publica cuando cambien: schema SQL, hooks de datos, shape de datos, filtros Supabase
- Ultima actualizacion: -

### cultura-testing

- Estado: done
- Ownership actual: -
- Depende de: `schema_changed`, `api_changed`, `ui_changed`, `needs_review`
- Ultima actualizacion: revision responsividad calendarios: BLOQUEO confirmado

### cultura-review

- Estado: done
- Ownership actual: -
- Depende de: `needs_review`, cambios grandes, cierre pre-merge
- Ultima actualizacion: Analisis paralelo completado - 5 hallazgos (1 critico, 1 alto, 1 medio, 2 bajos/info). Issues priorizadas entregadas.

### cultura-security

- Estado: done
- Ownership actual: -
- Depende de: auth, RLS, secretos, cambios de deploy, consultas Supabase
- Ultima actualizacion: Analisis completado - 4 hallazgos (1 critico, 2 altos, 1 medio). Resumen: settings_direct_supabase_confirmado, calendario_min_h_confirmado, evento_filter_url_falta, dashboard_kpi_mes_no_filtrado.

### cultura-release

- Estado: idle
- Ownership actual: -
- Depende de: build verificado, variables de entorno, checklist Supabase/Vercel
- Ultima actualizacion: -

### cultura-docs

- Estado: done
- Ownership actual: -
- Depende de: cambios de arquitectura, scripts, agentes, SQL o flujo de deploy
- Ultima actualizacion: Consolidado metodo operativo para problemas nuevos: issue -> agentes -> fix verificado -> commit -> push -> comentario -> cierre.

## Eventos

Formato:

```text
- YYYY-MM-DD HH:mm CET - agente - estado - mensaje.
```

- 2026-05-02 14:45 CEST - cultura-docs - done - Documentado flujo estandar ante problemas nuevos: abrir/localizar issue, ejecutar agentes, verificar fix, comitear, comentar issue con commit/verificaciones y cerrar como completada.
- 2026-05-02 14:50 CEST - cultura-docs - done - Ajustado flujo estandar: tras commit, hacer push antes de comentar y cerrar la issue.
- 2026-05-02 14:35 CEST - cultura-docs - done - Documentada leccion de bugs visuales: agentes necesitan reproduccion visual concreta; para react-big-calendar verificar alturas internas y filas del mes visibles, no solo lint/build.
- 2026-05-02 14:15 CEST - cultura-review - done - Code review final: 4 cambios verificados. Calendarios: heights 350/450px (verificar breakpoints 320-1280px). EventList: filtro URL OK. useProfile.js: hook correcto. Settings: sin Supabase directo. Dashboard KPI: filtra por mes + ingresos cobrados event_id. Veredicto: OK, ejecutar lint/build antes de merge.
- 2026-05-02 14:00 CEST - cultura-frontend - done - Fix responsividad calendarios: min-h-[620px] reemplazado por altura responsive (350/450px). Implementado filtro URL ?project= en EventList con useSearchParams. Build OK, lint OK.
- 2026-05-02 13:00 CEST - cultura-security - done - Analisis seguridad: 4 hallazgos. (1 CRITICO: KPI cobro bruto/hora no filtra por mes seleccionado - linea 91-94 Dashboard.jsx usa todos los eventos con ingresos cobrados, no solo los del mes). (2 ALTOS: Settings.jsx lineas 20-33 y 48-55 llamadas directas a Supabase, violando norma hook; min-h-[620px] confirmado en CalendarEvents.jsx:109 y CalendarProjects.jsx:102). (1 MEDIO: EventList.jsx sin filtro ?project= en URL).
- 2026-05-02 12:45 CEST - cultura-review - done - Code review: 5 hallazgos (1 critico calendarios, 1 alto Settings.jsx directa Supabase, 1 medio filtro URL, 1 bajo confirmacion borrado, 1 info Vercel). Build OK, lint OK, sin XSS.
- 2026-05-02 12:30 CEST - cultura-explorer - info - Explorer: 1 BLOQUEO activo (min-h-[620px] en 3 archivos rompe <1024px). Metricas OK. Build OK. Propuesta: cultura-frontend ownership fix.
- 2026-05-02 11:57 CEST - cultura-testing - done - Revision responsividad calendarios: causa critica confirmada en min-h-[620px], con riesgos de overflow/altura en 320, 375 y 640 px.
- 2026-05-02 11:57 CEST - cultura-frontend - done - Revision responsividad calendarios: 9 hallazgos, 2 altos por altura fija en CalendarEvents y CalendarProjects.
- 2026-04-30 00:30 CEST - cultura-testing - done - Selector dias cobros pendientes: UX/alcance OK, lint OK, build OK, sin regresiones.
- 2026-04-30 00:24 CEST - cultura-frontend - done - Selector dias cobros pendientes: 7/14/30/60/90 dias en Dashboard.
<!-- Nuevos eventos encima de esta linea. -->

- 2026-05-02 13:30 CEST - worker-data-settings-dashboard - done - Tareas completadas: 1) useProfile.js creado (CRUD Profile), Settings.jsx refactorizado (usa hook, elimina llamadas Supabase directas). 2) KPI cobro bruto/hora corregido en Dashboard.jsx: filtra ingresos cobrados con event_id por mes seleccionado, filtra horas de eventos del mes (start<=endOfMonth && end>=startOfMonth). lint OK, build OK.
- 2026-04-29 18:50 CET - cultura-frontend - done - Metrica cobro bruto/hora ajustada: solo ingresos cobrados vinculados a eventos / horas de esos eventos.
- 2026-04-29 18:45 CET - cultura-testing - done - Revision metricas cobro/hora: veredicto con problemas, 3 riesgos (ProjectDetail infla tasa, Dashboard desfase, UX "-_" frecuente).
- 2026-04-29 18:30 CET - cultura-frontend - needs_review - Revision metricas cobro bruto/hora: 6 hallazgos, 2 riesgos altos (ProjectDetail mezcla ingresos, Dashboard desfase temporal).
