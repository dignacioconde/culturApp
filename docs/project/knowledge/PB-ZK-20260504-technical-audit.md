---
id: PB-ZK-20260504-TECH-AUDIT
type: zk
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Auditoría técnica repo 2026-05-04
tags:
  - product-brain
  - knowledge
  - technical-audit
---

# Auditoría técnica repo — 2026-05-04

## Resumen

Barrido técnico de app React/Vite/Supabase, scripts de Product Brain, skills, docs y workflow.

Verificación ejecutada:

- `npm run lint`: OK.
- `npm run build`: OK. Vite avisa de chunk JS > 500 kB.
- `npm run pb:status`: repo y vault sincronizados antes de la auditoría.

## Hallazgos Prioritarios

1. **Eventos y zona horaria**: `EventForm` envía strings `YYYY-MM-DDTHH:mm` directamente a columnas `timestamptz`. Si Postgres/Supabase los interpreta en UTC, un evento elegido a las 08:00 en España puede volver como 10:00 en CEST. Riesgo alto para agenda.
2. **Ingresos marcados como cobrados desde modal**: al crear/editar ingreso con `Ya está cobrado`, se guarda `is_paid` pero no `paid_date`. El dashboard usa `paid_date ?? expected_date`, así que un cobro real sin fecha prevista puede desaparecer del flujo de caja.
3. **Importes con coma decimal**: ingresos usan `parseDecimal`, pero los inputs de importe son `type="number"`; gastos validan con `Number()`. En contexto español, `12,50` puede bloquearse o fallar.
4. **Tooling Product Brain**: `pb:capture` genera IDs no-issue con precisión de minuto. Dos capturas del mismo tipo en el mismo minuto pueden colisionar y sobrescribir.
5. **Cobros vencidos**: dashboard solo muestra pendientes con `expected_date >= today`; los vencidos desaparecen del panel de cobros pendientes.

## Contexto Útil

- La app respeta la regla de no llamar a Supabase desde páginas: las llamadas viven en hooks.
- `/work` existe como agrupador inicial, pero no resuelve aún la duplicidad producto/evento del backlog.
- `dist/`, `.opencode/node_modules` y `.opencode/runs` no están versionados.
- `.claude/skills` apunta mediante symlinks a `.agents/skills`.

## Relacionado Con

- [[../context/data-finance-model-20260504]]
- [[../context/ux-mobile-guardrails-20260504]]
- [[../issues/CACH-B002]]
- [[../issues/CACH-B003]]
- [[../issues/CACH-B007]]
- [[../issues/CACH-B010]]
