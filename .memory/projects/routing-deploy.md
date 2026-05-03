# Routing And Deploy Memory

## 2026-05-03 - Vercel Needs SPA Fallback For Protected Routes

- Context: Issue `#4` was a P0: refreshing protected React Router routes returned `404 Not Found` in production-style routing.
- Durable memory: keep `vercel.json` with a catch-all rewrite to `/` so Vercel serves the Vite SPA entry and React Router handles `/dashboard`, `/events`, `/projects`, `/calendar/events`, `/calendar/projects`, `/settings`, `/work`, and future app routes. Do not remove this when touching deploy config unless replacing it with an equivalent SPA fallback.
- Source: issue `#4`; commit `d56ed37`; `vercel.json`.

## 2026-05-03 - Deploy Config Exists But Production Deploy Is Still Pending

- Context: The SPA fallback was added before the project was marked deployed in the docs.
- Durable memory: `vercel.json` being present does not mean the Vercel deployment is complete. Keep "Deploy en Vercel" as a pending release task until a real deployment is created and verified.
- Source: `AGENTS.md`; commit `d56ed37`; project status docs.
