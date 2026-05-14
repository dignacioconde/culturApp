# Calendar Memory

## 2026-05-03 - React Big Calendar Needs Real Internal Height

- Context: Responsive calendar debugging found that React Big Calendar could render toolbar/header while month rows collapsed.
- Durable memory: avoid relying on `height: 100%` inside parents that only provide `min-height`, `flex-1`, `min-h-0`, or `overflow-hidden`; verify computed heights for `.rbc-calendar`, `.rbc-month-view`, and `.rbc-month-row`, and visually confirm month rows render.
- Source: commits `9f6e1c` and `2efe2b6`; `AGENTS.md`; `TECHDOC.md`; `.opencode/AGENT_STATE.md`.

## 2026-05-03 - Event Calendar Week View Mobile Is Still A Product Decision

- Context: Current implementation uses horizontal scroll to avoid crushing the week grid on mobile.
- Durable memory: issue `#3` is closed and the current horizontal-scroll week view is accepted for now. If mobile week UX is reprioritized, open a new issue and evaluate agenda, 3-day view, carousel by day, selected-day week, or mobile fallback to day/agenda with a real mobile viewport screenshot.
- Source: `AGENTS.md`; `README.md`; `TECHDOC.md`; `.opencode/README.md`.

## 2026-05-14 - Calendar Sync V1 Is Events-Only And Subscription-Based

- Context: Beta 24 reframed calendar work around clearer separated calendars plus private `.ics/webcal` subscription links.
- Durable memory: keep Agenda and Plan anual separated. Agenda sync v1 exports only events, read-only, Cachés to external calendar, via revocable private feed tokens stored only as hashes. Do not include projects, notes, finances, tax data, contractor-sensitive fields, or `user_id` in the feed.
- Provider UX: Apple can use a `webcal://` open action plus copy fallback; Google needs add-by-URL from a desktop browser; Outlook subscription refresh can take more than 24 hours. OAuth/write/import remains out of scope until a separate issue.
- Source: `CACH-B0007`, `CACH-0092`, `CACH-0093`, `RELEASE-0.1.0-beta.24`; Google/Apple/Microsoft support docs checked on 2026-05-14.
