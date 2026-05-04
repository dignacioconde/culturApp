# Calendar Memory

## 2026-05-03 - React Big Calendar Needs Real Internal Height

- Context: Responsive calendar debugging found that React Big Calendar could render toolbar/header while month rows collapsed.
- Durable memory: avoid relying on `height: 100%` inside parents that only provide `min-height`, `flex-1`, `min-h-0`, or `overflow-hidden`; verify computed heights for `.rbc-calendar`, `.rbc-month-view`, and `.rbc-month-row`, and visually confirm month rows render.
- Source: commits `9f6e1c` and `2efe2b6`; `AGENTS.md`; `TECHDOC.md`; `.opencode/AGENT_STATE.md`.

## 2026-05-03 - Event Calendar Week View Mobile Is Still A Product Decision

- Context: Current implementation uses horizontal scroll to avoid crushing the week grid on mobile.
- Durable memory: issue `#3` is closed and the current horizontal-scroll week view is accepted for now. If mobile week UX is reprioritized, open a new issue and evaluate agenda, 3-day view, carousel by day, selected-day week, or mobile fallback to day/agenda with a real mobile viewport screenshot.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`.
