---
name: cultura-frontend-review
description: Review or implement CulturaApp frontend changes with focus on React/Vite/Tailwind UI, forms, calendars, responsive behavior, accessibility, performance, and Spanish UX copy. Use for changes in src/pages, src/components, src/index.css, react-big-calendar layouts, custom Select/date/datetime controls, or visual regressions. Do not use for Supabase schema/RLS-only work except to check UI impact.
---

# Cultura Frontend Review

## Purpose

Keep CulturaApp usable for cultural freelancers across desktop and mobile while preserving project conventions, Spanish (Spain) copy, and the custom UI controls that avoid poor mobile native pickers.

## When to use this skill

- A task touches `src/pages/**`, `src/components/**`, `src/index.css`, routing, forms, modals, lists, dashboard, calendars, or responsive layout.
- A visual issue mentions `/calendar/events`, `/calendar/projects`, `react-big-calendar`, collapsed rows, toolbar/header visibility, mobile week view, or viewport-specific behavior.
- A change introduces or edits date, datetime, select, checkbox, color swatch, icon button, empty state, loading state, or validation UI.

## When not to use this skill

- The task only changes Supabase SQL, RLS, hooks, financial formulas, deploy, or docs with no UI behavior.
- The user asks for a security-only or data-model-only review.
- The request is a broad product strategy discussion without a concrete UI artifact to inspect.

## Inputs to inspect

- `AGENTS.md`, especially UI, selector, calendar, language, and formatter conventions.
- `src/App.jsx`, affected routes, and affected page/component files.
- `src/components/ui/Input.jsx`, `Button.jsx`, `Badge.jsx`, `Card.jsx`, `Modal.jsx`, and `Toast.jsx`.
- `src/pages/Calendar/CalendarEvents.jsx`, `CalendarProjects.jsx`, `CalendarView.jsx`, and `src/index.css` for calendar work.
- `src/lib/formatters.js` and `src/lib/constants.js`.
- `package.json` scripts for `npm run lint` and `npm run build`.

## Procedure

1. Identify the user workflow: dashboard scan, project management, event management, income/expense entry, settings, or calendar planning.
2. Verify the change follows existing component patterns before creating new UI primitives.
3. Check that pages do not call Supabase directly; data must flow through hooks.
4. Ensure UI copy stays in Spanish from Spain and uses tuteo where applicable.
5. Confirm dates, datetimes, hours, money, and ranges use shared formatters.
6. For app pages, reject native `<select>`, direct `input type="date"`, and direct `input type="datetime-local"`; use or extend shared wrappers.
7. For event forms, preserve `08:00` as normal start time, 24h time format, and end time behavior based on the selected start time.
8. For calendars, inspect height chains, `min-height`, flex parents, `height: 100%`, `min-h-0`, and `overflow-hidden`; React Big Calendar needs a real computable height.
9. Review mobile and desktop ergonomics: tap targets, label visibility, focus states, loading/error/empty states, table overflow, and action placement.
10. Review basic performance: avoid unnecessary recalculation in render-heavy lists/calendars, preserve memoization where already used, and do not create expensive derived maps repeatedly without need.
11. Verify with `npm run lint` and `npm run build` if code changed. For visual/calendar work, also request or perform browser verification with screenshots when tooling is available.

## Output format

For reviews, start with findings ordered by severity. Include file and line when possible, expected behavior, actual risk, and a concrete fix.

For implementation, return:

- Files changed.
- UX decisions made.
- Responsive/accessibility checks performed.
- Commands run.
- Remaining visual risks, especially for `/calendar/events` mobile week view.

## Severity / priority model

- CRITICAL: broken route, unusable primary workflow, invisible calendar grid, data loss through UI action, or inaccessible blocking modal/form.
- HIGH: direct Supabase call in component, reintroduced native pickers in app pages, wrong date/time handling, broken responsive layout on common mobile widths, or unhandled submit error.
- MEDIUM: weak loading/error/empty state, poor tap target, inconsistent copy, duplicated UI logic, performance issue likely to hurt normal use.
- LOW: polish, naming, spacing, non-blocking visual consistency.

## Quality bar

- Main workflows are clear on mobile and desktop.
- Calendars show toolbar, headers, rows/cells, and events in compact and desktop viewports.
- Forms are comfortable on touch screens and do not depend on tiny native pickers.
- UI strings remain Spanish (Spain).
- Visual choices respect the existing quiet, work-focused product style.
- Lint/build pass for code changes or the blocker is reported.

## Common mistakes to avoid

- Treating scroll horizontal as a final fix for mobile week view in `/calendar/events`; issue `#3` remains open unless UX is truly redesigned and verified.
- Changing `min-h-*` without checking the full height chain around React Big Calendar.
- Adding one-off selects or date pickers inside pages.
- Formatting money or dates inline instead of using shared formatters.
- Hiding important desktop actions just because mobile needs a compact layout.

## Safety notes

Do not read `.env.local` for frontend review. Do not call remote Supabase, Vercel, or production URLs unless the user explicitly asks and confirms any credential use. Do not import external UI code or assets without checking license and necessity.
