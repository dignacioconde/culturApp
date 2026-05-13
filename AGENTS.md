# AGENTS.md — Cachés

Contrato corto de entrada para agentes. No es memoria completa ni documentación exhaustiva.

Regla base: lee índices primero, carga detalle solo cuando sea relevante y no cargues histórico por defecto. La política canónica de carga de contexto vive en `docs/agent-context-policy.md`.

## Fuentes Canónicas

- Producto, planificación, issues, releases y decisiones: `docs/project/START_HERE.md`.
- Política de carga de contexto: `docs/agent-context-policy.md`.
- Memoria durable versionada: `.memory/MEMORY.md`.
- Setup, SQL inicial y bootstrap Supabase: `README.md`.
- Estado técnico, inventario y decisiones de arquitectura resumidas: `TECHDOC.md`.
- Workflow de agentes OpenCode: `.opencode/README.md`.
- Workflow Product Brain: `docs/project/process/WORKFLOW.md`.

Estas rutas son referencias bajo demanda. No las leas todas en cada tarea.

## Producto

Cachés es una herramienta web para profesionales culturales freelance: músicos, actores, fotógrafos, diseñadores, gestores culturales y pequeños equipos.

Problema: necesitan visibilidad clara de proyectos, eventos, agenda, ingresos previstos/reales y costes sin depender de Excel o papel.

Modelo funcional:
- Proyecto: agrupador con rango de fechas; aparece en calendario de proyectos.
- Evento: ocurrencia con fecha y hora exactas; puede existir sin proyecto; aparece en calendario de eventos.
- Ingresos y gastos: pueden vincularse a proyecto o evento. Dashboard y detalles agregan ambos niveles cuando corresponde.

Stack principal: React 19, Vite 8, Tailwind v4, React Router 7, React Big Calendar, Day.js, Supabase JS y Vercel.

## Contexto Mínimo

Para cualquier tarea:
- Lee este archivo.
- Lee `.memory/MEMORY.md` y solo la memoria relevante.
- Sigue `docs/agent-context-policy.md`.

Para tareas pequeñas de implementación:
- Lee `docs/project/START_HERE.md`.
- Lee la issue `CACH-*` relacionada si existe.
- No leas `CURRENT_RELEASE`, `CURRENT_PLAN` ni `BACKLOG` salvo que la tarea pertenezca a una release activa, afecte planificación o cambie alcance de producto.

Para cambios visuales/responsive:
- Incluye ruta, viewport, síntoma y criterio visual.
- Si toca calendarios, verifica que toolbar, cabeceras, filas/celdas y eventos siguen visibles.

## Reglas Críticas

Datos y seguridad:
- No llamar a Supabase directamente desde componentes. Usa hooks en `src/hooks`.
- RLS es obligatorio en datos por usuario. No usar service role en cliente.
- Operaciones directas de Supabase remoto: usar Supabase MCP acotado al proyecto o SQL Editor como fallback; mostrar SQL exacto y pedir confirmación antes de mutar producción. Ver `docs/project/process/supabase-db-access.md`.
- `user_id` debe venir del usuario autenticado, no de input editable.
- `profiles.tax_rate` es la fuente de IRPF habitual; usar `useProfile`.
- Error 409 al crear proyecto/evento suele indicar perfil faltante; ver `.memory/projects/settings.md`.

Finanzas:
- `incomes` y `expenses` se vinculan a proyecto o evento.
- Dashboard agrega ingresos/gastos de eventos y proyectos directos.
- Cobro bruto/hora usa solo ingresos cobrados con `event_id`, antes de IRPF, dividido entre horas de eventos con `end_datetime`.
- No mezclar ingresos directos de proyecto en el numerador de €/h.

Frontend y UX:
- UI en español de España y con tuteo.
- Usar `src/lib/formatters.js` para moneda, fechas, horas y rangos.
- No usar `<select>`, `input type="date"` ni `input type="datetime-local"` directamente en páginas; usar los controles compartidos de `src/components/ui/Input.jsx`.
- Eventos: hora inicial habitual `08:00`; formato 24h; fin por defecto basado en inicio.
- Mantener targets táctiles razonables en selectores, checkboxes y swatches.

Calendarios:
- `react-big-calendar` necesita altura real calculable. No confiar en `height: 100%` dentro de padres con solo `min-height`, `flex-1`, `min-h-0` u `overflow-hidden`.
- La vista semana móvil con scroll horizontal está aceptada por ahora; mejoras mayores requieren issue nueva con criterio UX y captura.
- Calendario de eventos es compartible; calendario de proyectos es interno.

Memoria y documentación:
- `.memory/` es memoria versionada del proyecto. Guarda preferencias, decisiones duraderas y gotchas reutilizables.
- No guardar histórico operativo, logs, ramas, listas de commits, secretos ni datos sensibles en memoria.
- Al cerrar una tarea, pasar siempre el learning loop: detectar si hay aprendizaje durable, actualizar memoria/docs/proceso cuando aplique o declarar `Memoria: no aplica`.
- Si surge memoria durable, actualizar `.memory/` o declarar `Memoria: no aplica` cuando corresponda.
- Todo contenido persistente debe estar en español o inglés limpio.

Issues y Product Brain:
- Product Brain es fuente de verdad de producto; GitHub es soporte operativo.
- Al crear una issue durante triage/backlog/CACH, crear primero issue Markdown en `docs/project/issues/` salvo que el usuario pida GitHub Issue o ejecución inmediata lo requiera.
- Issues nuevas: `schema_version: 2`, `kind: issue`, `issue_workflow: inbox`, `size: xs|s|m`, componentes concretos y criterios verificables; si parece `size: l`, partir en slices.

PR, release y verificación:
- Antes de abrir PR: revisar issue/contexto, diff y commits contra base; actualizar memoria durable o declarar `Memoria: no aplica`.
- La PR debe incluir sección `Memoria`.
- Si el cambio debe verse en producción, preview no basta: merge a `main`, verificar alias de producción y limpiar rama.
- Si toca código de app: ejecutar `npm run lint` y `npm run build` cuando aplique.
- Si toca `docs/project/`: ejecutar `npm run pb:check`.

## Agentes y Routing

- No usar subagentes para cambios triviales.
- UI, rutas, formularios, calendarios y responsive: `@cultura-frontend`; añadir UX desktop/mobile si el criterio visual importa.
- Datos, hooks, Supabase, RLS o cálculos financieros: `@cultura-data`.
- Docs, instrucciones, memoria o Product Brain: `@cultura-docs`.
- Auth, RLS, secretos, privacidad o exposición de datos: `@cultura-security`.
- Revisión técnica mediana/grande: `@cultura-review`.
- Verificación post-implementación con código/producto/config: `verification-agent`.

Cuando el usuario pida OpenCode agents, usa el flujo estipulado en `.opencode/README.md`; no hagas una investigación manual amplia salvo bloqueo real.

Si el usuario pide `caveman`, `menos tokens` o respuesta breve, aplica salida concisa solo donde sea seguro; no comprimas seguridad/RLS, finanzas, SQL, migraciones, reviews con evidencia ni verificaciones exactas.

## Comandos Esenciales

```bash
npm run dev
npm run lint
npm run build
npm run agents:plan -- "tarea"
npm run agents:run -- "tarea"
npm run agents:verify -- "contexto"
npm run pb:check
npm run verify:pr -- --base origin/main
npm run pb:guard
```

## Detalle Bajo Demanda

- Schema SQL y RLS completos: `README.md`.
- Inventario técnico y estado implementado: `TECHDOC.md`.
- Memoria/gotchas por área: `.memory/MEMORY.md`.
- Skills portables: `docs/agent-skills-strategy.md`.
- Protocolo de memoria: `docs/agent-memory.md`.
- Workflow fino de ramas, releases, issues y agentes: `docs/project/process/WORKFLOW.md` y `.opencode/README.md`.
