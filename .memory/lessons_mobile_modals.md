---
name: Mobile modal handling lessons
description: Scroll lock, viewport management, and touch interactions learned from recent modal iterations
type: feedback
---

## Scroll Lock Requires Counter Pattern

**Rule:** When blocking scroll with modals, use a counter-based context (not boolean) to handle multiple simultaneous modals.

**Why:** Modal stacking is common (filters → confirm → loading states). Without a counter, closing one modal would unlock scroll globally even if another modal remains open.

**How to apply:** Central ScrollLockProvider with lock/unlock methods that increment/decrement a counter. Only unblock when count reaches 0. Implementation in [useScrollLock.jsx](src/hooks/useScrollLock.jsx).

Implementation pattern:
- Store position before lock: `const scrollY = window.scrollY`
- Apply lock: `overflow: hidden`, `position: fixed`, `top: -${scrollY}px`
- Restore on unlock: `window.scrollTo(0, scrollY)`

## Touch Actions in Mobile Modals

**Rule:** Block pinch-zoom during modal interactions with CSS `touch-action: none` on root or viewport meta.

**Why:** Mobile users accidentally zoom while interacting with modal content or keyboard, breaking the UX. Browser default pinch-zoom behavior interferes with modal overlays.

**How to apply:** Add to [src/index.css](src/index.css) root or on modal container itself. CSS is simpler than JS event handlers.

## Mobile Viewport Height Strategy

**Rule:** Use dynamic viewport units (dvh) for mobile modals, not fixed pixel heights. Iterate on max-height after keyboard appears.

**Why:** Mobile keyboards change available viewport. Fixed heights cause modal to overflow keyboard space. Need responsive testing on actual devices or browser devtools with keyboard simulation.

**How to apply:** Start with `max-height: 70-80dvh` on mobile, adjust based on content + keyboard space. Viewport math: `max-height: 100dvh - keyboard-height - padding`.

## Mobile Detail Page Patterns (2026-05-05)

From the EventDetail/ProjectDetail UX session:

**Bottom bar fija:** Fix a 4-button action bar (Cobro, Gasto, Editar, Eliminar) at the bottom of detail pages. Use `pb-20` padding on the container to prevent content being cut by the bar. Feels like a native app.

**Quick modals:** Default concept = entity name (event or project). Only minimum fields (amount + paid toggle, or amount + category). Full income/expense modals remain available but hidden behind quick-add in mobile.

**Minimal mobile lists:** Show only concept + amount per row on mobile. Full table (with extra columns) only on desktop.

**Pattern reuse:** Bottom bar + minimal lists + quick modals is the canonical mobile detail pattern. Replicate for any new detail page.

## Mobile Bottom Navigation Pattern (2026-05-10)

Global mobile navigation uses a compact bottom bar for primary routes; do not add a duplicate drawer/sidebar on mobile unless there is a concrete secondary-navigation need. Keep labels short enough for 320 px, preserve at least 44 px touch targets, and make the active state visible through structure (not color only).

Do not stack the global bottom nav over contextual bottom action bars on EventDetail/ProjectDetail. Hide global nav on those detail routes, and offset fixed mobile panels/toasts above the nav when both can appear.

## Mobile Scroll Budget For Guidance Panels (2026-05-13)

Onboarding, checklists, empty states, and guidance panels must be compact by default on mobile. If the content teaches more than one concept, provide a close/skip action, collapse secondary details, and keep a single clear next action visible without forcing a long vertical scroll.

Use expanded lists for desktop or explicit user intent, not as the default mobile shape. This is especially important for first-session UI, where a blocking tutorial can feel restrictive.

## Modal UX Requires Iteration

**Rule:** Mobile modal UX (scroll, zoom, keyboard, animations) needs multiple deploy cycles to refine. Plan for 3-5 commits minimum for "polished" modals.

**Why:** Each platform (iOS, Android, desktop browser devtools) behaves differently. Edge cases only surface after real-world testing.

**How to apply:** Test on actual devices or use browser responsive mode with keyboard simulation. Each OS's keyboard behavior is different.
