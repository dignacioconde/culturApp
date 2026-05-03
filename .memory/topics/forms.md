# Forms And Control Memory

## 2026-05-03 - Use Shared Custom Controls Instead Of Native Selectors

- Context: Mobile UX work in commit `fc99c25` replaced small native menus with shared controls in `src/components/ui/Input.jsx`.
- Durable memory: app pages should not introduce raw `<select>`, `input type="date"`, or `input type="datetime-local"` controls; use `Select`, `Input type="date"`, and `Input type="datetime-local"` from `Input.jsx`, or extend shared UI if a new selector type is needed.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`; commit `fc99c25`.

## 2026-05-03 - Event Datetime Defaults Are Part Of UX Contract

- Context: Calendar and form UX was standardized around a practical workday rather than midnight defaults.
- Durable memory: event start defaults should be `08:00`; end time should use the selected start time as reference when the user has not chosen another; UI should use 24h time and values compatible with Supabase (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`).
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; commits `48f8b89` and `fc99c25`.
