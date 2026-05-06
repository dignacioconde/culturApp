---
id: PB-PROMPT-CACH-0029
type: prompt
status: Historical
created: 2026-05-05
updated: 2026-05-06
load_policy: do_not_load_by_default
aliases:
  - CACH-0029 cerrar huecos B0016
  - Prompt CACH-0029
tags:
  - product-brain
  - prompt
  - testing
  - hardening
  - historical
---

# CACH-0029 — Cerrar huecos reales de CACH-B0016

Historical prompt:
- Preserves context from a past task execution.
- Do not load by default.
- Do not treat as current agent instructions.
- Use only when investigating CACH-0029, CACH-B0016 or an explicitly referenced past execution.

```markdown
# CACH-0029 — Cerrar huecos reales de CACH-B0016: integrar helpers en la app y endurecer tests

Eres Claude Code/Codex trabajando en el repo `culturApp` / Cachés.

## Objetivo

La PR `#59` / CACH-B0016 dejó bien montado el Product Brain y añadió helpers/tests puros, pero quedaron huecos reales:

1. `decimal.ts` existe, pero varios formularios siguen usando `type="number"` o `Number(...)`.
2. `datetime.ts` existe, pero `EventForm` sigue enviando `YYYY-MM-DDTHH:mm` local sin convertirlo a instante UTC.
3. `payment.ts` existe, pero `EventDetail` y `ProjectDetail` siguen alternando `is_paid` y `paid_date` manualmente.
4. Playwright smoke está `skip`.
5. pgTAP/RLS está como placeholder.
6. `inbox/README.md` no explica bien el nuevo `pb:capture`.

Tu trabajo es cerrar esos huecos sin reabrir la refundación completa del Product Brain.

## Respuesta inicial obligatoria

Antes de tocar archivos, responde en español:

1. **Issue**: CACH-0029 — Integrar helpers CACH-B0016 en flujos reales.
2. **Release**: usar la release activa que indiquen `CURRENT_RELEASE.md` y `CURRENT_PLAN.md`.
3. **Rama**: crea rama desde la rama de release activa si existe; si no, desde `main`.
4. **Ficheros previstos**.
5. **Riesgos**.
6. **Validación esperada**.
7. **Memoria**: confirmar que harás checkpoint pre-PR.

Luego ejecuta.

## Contexto obligatorio

Lee antes de editar:

- `AGENTS.md`
- `.memory/MEMORY.md`
- `docs/project/START_HERE.md`
- `docs/project/releases/CURRENT_RELEASE.md`
- `docs/project/plans/CURRENT_PLAN.md`
- `docs/project/backlog/BACKLOG.md`
- `docs/project/issues/CACH-B0016.md`
- `docs/project/issues/CACH-B0014.md`
- `docs/project/decisions/ADR-0009-id-policy.md`
- `docs/project/decisions/ADR-0011-timestamp-policy.md`
- `docs/project/decisions/ADR-0012-decimal-input-policy.md`
- `docs/project/decisions/ADR-0013-testing-strategy.md`

Si no existe issue `CACH-0029`, créala en `docs/project/issues/CACH-0029.md` con frontmatter nuevo sin prefijo `B`.

## Cambios a hacer

### 1. Decimales reales en UI

Actualizar formularios de ingresos/gastos para no depender de `type="number"`:

- `src/pages/Events/EventDetail.jsx`
- `src/pages/Projects/ProjectDetail.jsx`

Reglas:

- Importes: `type="text"`, `inputMode="decimal"`.
- Usar `parseDecimal()` para ingresos, gastos y retención IRPF.
- No usar `Number(expenseForm.amount)` para validar gastos.
- Aceptar `1.234,56`, `1234,56`, `1234.56`, `,5`, `-1,5` donde aplique.
- Mantener UI en español de España y tuteo.

### 2. Datetime real en eventos

Actualizar `EventForm` y/o el punto de submit para convertir correctamente:

- Input local `YYYY-MM-DDTHH:mm` -> `fromLocalInputValue(..., 'Europe/Madrid')` -> `toIsoUtc()`.
- Al editar evento existente, seguir usando `toDatetimeLocal()`.
- No mandar naive datetime local directo a Supabase.

Archivos probables:

- `src/pages/Events/EventForm.jsx`
- `src/pages/Calendar/CalendarEvents.jsx`
- hooks/callers que reciban payload de eventos, si aplica.

### 3. Coherencia `paid_date` <-> cobrado

Actualizar cobros para usar `payment.ts`:

- `markPaid()`
- `markUnpaid()`
- `isPaid()`

Reglas:

- No crear estados donde `is_paid=true` y `paid_date=null`.
- Si la BD todavía tiene `is_paid`, mantener compatibilidad enviando ambos campos coherentes.
- Si `paid_date` es `date` en el schema actual, documentar la limitación y no hacer migración destructiva salvo que ya existan migraciones claras.

### 4. Tests de integración mínima

Añadir/actualizar tests para cubrir los flujos reales, no sólo helpers:

- test de transformación de payload de evento local Madrid -> ISO UTC.
- test de payload de ingreso/gasto con coma decimal.
- test de toggle de cobro que deja `is_paid` y `paid_date` coherentes.

Si extraer helpers pequeños facilita testear sin montar componentes enormes, hazlo.

### 5. Playwright

Mejorar `e2e/smoke.spec.ts`:

- Si existe auth/seed viable, des-skippear y ejecutar humo real.
- Si no existe, mantener `.skip`, pero añadir `webServer` en `playwright.config.ts` y dejar TODO claro con issue link.
- No fingir cobertura e2e si no hay seed/auth.

### 6. pgTAP / test db

Mejorar `supabase/tests/payment_rls.test.sql`:

- Si hay migrations reales para tablas financieras, escribir pgTAP real.
- Si no las hay, mantener placeholder, pero abrir TODO en la issue CACH-0029 explicando que no hay migrations versionadas para testear RLS todavía.
- `npm run test:db` puede seguir skippeando si falta Supabase CLI, pero debe decirlo explícitamente.

### 7. Inbox

Actualizar `docs/project/inbox/README.md` para explicar:

- `npm run pb:capture -- "texto"`
- `npm run pb:capture -- --title "..." --tag beta,feedback "texto"`
- weekly review
- qué va a inbox y qué no.

## Validación obligatoria

Ejecuta:

```bash
npm run pb:check
npm run lint
npm run test
npm run build
npm run test:e2e
npm run test:db
```

Si algún comando queda skippeado, explícalo con motivo exacto.

## Cierre

Antes de PR:

1. Actualiza `docs/project/issues/CACH-0029.md` con resultado y validación.
2. Actualiza backlog/release/plan si cambia estado.
3. Haz checkpoint de memoria:
   - si hay memoria durable, actualiza `.memory/`;
   - si no, declara `Memoria: no aplica`.
4. Commit con formato:
   `fix(CACH-0029): integra helpers de decimal datetime y cobros`
5. Push.
6. PR en español con:
   - resumen;
   - qué huecos de CACH-B0016 se cerraron;
   - qué sigue skippeado y por qué;
   - validación;
   - sección `Memoria`.
```
