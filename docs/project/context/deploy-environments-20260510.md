---
schema_version: 2
kind: context
id: PB-CTX-DEPLOY-ENVIRONMENTS-20260510
title: Estrategia de dominio y entornos
lifecycle: active
created: '2026-05-10'
updated: '2026-05-10'
aliases:
  - Dominio app y multientorno
  - Estrategia deploy entornos
tags:
  - product-brain
  - context
  - deploy
  - supabase
  - vercel
generated: false
---
# Estrategia de dominio y entornos

## Dominio canonico

El dominio publico canonico de la app es `https://app.caches.es`.

`https://culturapp-rho.vercel.app` queda como alias temporal heredado para continuidad, smoke y rollback, pero no debe usarse como URL principal en comunicacion, invitaciones o configuracion nueva.

## Vercel

- Proyecto: `dignaciocondes-projects/culturapp`.
- Dominio de proyecto: `app.caches.es`.
- DNS en Hostinger: crear `CNAME app -> cname.vercel-dns.com`.
- Mantener `vercel.json` con rewrite catch-all hacia `/` para que las rutas SPA protegidas sigan funcionando al recargar.
- `VITE_APP_URL` debe apuntar a `https://app.caches.es` en produccion.
- Preview y desarrollo pueden usar tambien `https://app.caches.es` como redirect auth canonico para evitar confirmaciones hacia previews protegidas o `localhost`.

## Supabase

La beta mantiene un unico proyecto Supabase por ahora: `mkidexrkhjhrsjnjmugw`.

Motivo: separar staging en un segundo proyecto exige duplicar Auth, SMTP Brevo, Edge Functions, secrets, migraciones y datos de prueba. Antes de abrir una beta mas amplia, se debe crear una issue especifica para staging persistente si el volumen de pruebas o los cambios de schema lo justifican.

Configuracion esperada:

- Edge Function `send-beta-invite`: secret `APP_URL=https://app.caches.es`.
- Auth URL Configuration:
  - Site URL: `https://app.caches.es`.
  - Redirect URLs: `https://app.caches.es/**`, `https://culturapp-rho.vercel.app/**` como compatibilidad temporal y `http://localhost:5173/**` solo para pruebas locales deliberadas.
- Plantilla `Confirm signup`: debe respetar `{{ .RedirectTo }}` cuando la app envia `emailRedirectTo`.

## Reglas de uso

- Produccion/beta real: usar `https://app.caches.es`.
- Local: usar `.env.local` con `VITE_APP_URL=https://app.caches.es`.
- Solo permitir redirects locales con `VITE_ALLOW_LOCAL_AUTH_REDIRECT=true` cuando se este probando Auth conscientemente.
- No crear un segundo proyecto Supabase ni migrar datos sin plan especifico.
