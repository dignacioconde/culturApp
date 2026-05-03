# Forms And Control Memory

## 2026-05-03 - Use Shared Custom Controls Instead Of Native Selectors

- Context: Mobile UX work in commit `fc99c25` replaced small native menus with shared controls in `src/components/ui/Input.jsx`.
- Durable memory: app pages should not introduce raw `<select>`, `input type="date"`, or `input type="datetime-local"` controls; use `Select`, `Input type="date"`, and `Input type="datetime-local"` from `Input.jsx`, or extend shared UI if a new selector type is needed.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`; commit `fc99c25`.

## 2026-05-03 - Event Datetime Defaults Are Part Of UX Contract

- Context: Calendar and form UX was standardized around a practical workday rather than midnight defaults.
- Durable memory: event start defaults should be `08:00`; end time should use the selected start time as reference when the user has not chosen another; UI should use 24h time and values compatible with Supabase (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`).
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; commits `48f8b89` and `fc99c25`.

## 2026-05-03 - Date Controls Must Support Manual Typing

- Context: Issue `#5` captured the user's preference to type dates manually while preserving current calendar preselection and mobile-friendly custom controls.
- Durable memory: shared date controls should allow manual `DD/MM/YYYY` entry, keep the visual picker available, and still emit database-compatible values (`YYYY-MM-DD`; datetime controls keep `YYYY-MM-DDTHH:mm`). Do not fall back to native browser date controls in app pages.
- Source: issue `#5`; commit `d56ed37`; `src/components/ui/Input.jsx`.

## 2026-05-03 - Events Are One-Day By Default

- Context: Issue `#7` clarified that the normal cultural event is a same-day occurrence, with multi-day events as an explicit exception.
- Durable memory: `EventForm` should default end datetime to the same date, one hour after start, and show a separate `Evento de varios días` option before asking for a different end date. Keep the 08:00 start default and calendar prefill behavior.
- Source: issue `#7`; commit `d56ed37`; `src/pages/Events/EventForm.jsx`.

## 2026-05-03 - Decimal Inputs Should Accept Comma And Dot

- Context: Issue `#11` found that IRPF values with decimals are real user inputs and native numeric controls can block comma decimals depending on browser/locale.
- Durable memory: for decimal finance percentages such as `tax_rate`, prefer text inputs with `inputMode="decimal"` plus `parseDecimal()` from `src/lib/formatters.js`, accepting both `15,5` and `15.5`; validate IRPF in the `0-100` range before saving.
- Source: issue `#11`; commit `ce89ea3`; `src/lib/formatters.js`; `src/pages/Settings/Settings.jsx`; income forms in event/project detail.
