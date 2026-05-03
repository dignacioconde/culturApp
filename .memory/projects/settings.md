# Settings And Profile Memory

## 2026-05-03 - Settings Must Use `useProfile`

- Context: A review found `Settings.jsx` calling Supabase directly; commit `9f6e1c` introduced `src/hooks/useProfile.js` and refactored settings.
- Durable memory: components should not call Supabase directly. Profile reads/writes belong in `useProfile`, with `Settings.jsx` consuming the hook.
- Source: commit `9f6e1c`; `AGENTS.md`; `.opencode/AGENT_STATE.md`; `src/hooks/useProfile.js`.

## 2026-05-03 - 409 On Create Usually Means Missing Profile Row

- Context: Docs preserve a known Supabase gotcha where the auth trigger previously failed without explicit `public.profiles`.
- Durable memory: if project/event creation returns 409, check whether the authenticated user lacks a row in `profiles`; the documented repair is inserting missing profile ids from `auth.users` after ensuring `handle_new_user` inserts into `public.profiles`.
- Source: `AGENTS.md`; Supabase initialization docs in `README.md`.
