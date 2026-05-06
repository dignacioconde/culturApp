# Dashboard Finance Memory

## 2026-05-03 - Cobro Bruto Por Hora Has A Narrow Definition

- Context: Dashboard finance review found and fixed a bug where the hourly-rate KPI did not filter by selected month.
- Durable memory: `cobro bruto/hora` uses only paid incomes linked to events (`event_id`), before IRPF, divided by hours from those events with `end_datetime`; direct project incomes are excluded and event hours must match the selected month window.
- Source: commits `48f8b89` and `9f6e1c`; `AGENTS.md`; `TECHDOC.md`; `.opencode/AGENT_STATE.md`.

## 2026-05-03 - Dashboard Aggregates Both Event And Direct Project Finance

- Context: The project model supports incomes/expenses linked to either events or projects, and dashboard KPIs intentionally combine both levels except for hourly rate.
- Durable memory: when changing dashboard finance totals, include event-level and direct project-level incomes/expenses; only the hourly-rate KPI has the special event-only rule.
- Source: `AGENTS.md`; `TECHDOC.md`; `src/pages/Dashboard/Dashboard.jsx`.

## 2026-05-06 - Dashboard Finance Summary Prioritizes Actionable Receivables

- Context: the previous desktop KPI row mixed expected income, collected income, expenses, hourly rate, and net profit in a way that was hard to act on.
- Durable memory: `Caja del mes` includes incomes planned for the selected month plus unpaid overdue incomes from previous months; future/unexpired planned incomes from other months must not be carried forward. `A cobrar` must equal `Cobrado del plan` + `Pendiente` + `Vencido`.
- Durable memory: do not project debt carryover into future months. Previous-month debt is carried into the selected month only when the selected month is the real current month.
- Durable memory: dashboard `Próximos cobros` follows the selected month plan; do not use an extra day-window selector there.
- Durable memory: cash actually received by `paid_date` is useful secondary context, but it must not replace the monthly plan KPIs.
- Durable memory: project-level dashboard accounting includes direct project incomes plus incomes from child events; child events with a project must not be duplicated as separate financial works.
- Schema caveat: with the current `expenses` table, CulturaApp can show registered expenses, but cannot truthfully detect overdue outgoing payments because expenses do not have `is_paid`, `paid_date`, or `due_date`.
