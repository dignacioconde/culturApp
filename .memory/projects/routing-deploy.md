# Routing, PWA y deploy

Cargar solo para rutas SPA, dominio, Vercel, PWA o publicación.

## Fuentes canónicas

- Setup y entornos: `README.md` y `TECHDOC.md`.
- Configuración SPA: `vercel.json`.
- PWA: `public/manifest.webmanifest` y `public/sw.js`.
- Criterios de release: Product Brain y `docs/project/process/WORKFLOW.md`.

## Gotchas duraderos

- Mantener el catch-all de `vercel.json` hacia `/`; React Router debe resolver rutas profundas como `/dashboard`, `/events`, `/projects`, `/settings` y calendarios al refrescar.
- **deploy.canonical_domain:** la app, `VITE_APP_URL`, confirmaciones Auth, invitaciones y smoke usan `https://app.caches.es`; `https://culturapp-rho.vercel.app` queda como alias temporal. _(fuente: README.md; verificado: 2026-09-22)_
- La presencia de configuración o una preview no prueba producción. Cuando el cambio deba publicarse, verificar el alias canónico después del merge a `main`.
- El manifest debe mantener scope `/` para navegación instalada dentro de la SPA.
- El service worker puede cachear solo shell y assets estáticos same-origin. No cachear Auth, Supabase, Edge Functions ni datos de usuario sin una issue offline con privacidad y resolución de conflictos.
- Un `401` en una URL protegida de preview no demuestra fallo de routing; comprobar el dominio público antes de diagnosticar la app.
