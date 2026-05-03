# Dashboard Finance Memory

## 2026-05-03 - Cobro Bruto Por Hora Has A Narrow Definition

- Context: Dashboard finance review found and fixed a bug where the hourly-rate KPI did not filter by selected month.
- Durable memory: `cobro bruto/hora` uses only paid incomes linked to events (`event_id`), before IRPF, divided by hours from those events with `end_datetime`; direct project incomes are excluded and event hours must match the selected month window.
- Source: commits `48f8b89` and `9f6e1c`; `AGENTS.md`; `TECHDOC.md`; `.opencode/AGENT_STATE.md`.

## 2026-05-03 - Dashboard Aggregates Both Event And Direct Project Finance

- Context: The project model supports incomes/expenses linked to either events or projects, and dashboard KPIs intentionally combine both levels except for hourly rate.
- Durable memory: when changing dashboard finance totals, include event-level and direct project-level incomes/expenses; only the hourly-rate KPI has the special event-only rule.
- Source: `AGENTS.md`; `TECHDOC.md`; `src/pages/Dashboard/Dashboard.jsx`.
