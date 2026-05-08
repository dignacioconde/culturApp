---
id: CACH-B0019
title: Emails transaccionales beta con Brevo
type: feature
status: done
cycle: beta-1
release: RELEASE-0.1.0-beta.10
priority: p1
estimate: m
area: backend
created_at: 2026-05-07
updated_at: 2026-05-07
aliases:
  - CACH-B0019
tags:
  - product-brain
  - issue
  - beta
  - email
  - auth
  - security
---

# CACH-B0019 — Emails transaccionales beta con Brevo

## Objetivo

Enviar invitaciones beta por email desde el panel admin y preparar la confirmación de email de Supabase Auth usando Brevo como proveedor transaccional.

## Alcance

- Añadir Edge Function `send-beta-invite` para crear invitación y enviarla por Brevo API.
- Mantener el flujo existente de crear solo código.
- Auditar intentos de envío sin guardar códigos planos.
- Ajustar registro y login para confirmación de email.
- Documentar la configuración manual de Brevo SMTP en Supabase Auth.

Quedan fuera newsletters, contactos, audiencias, automatizaciones, CRM, webhooks y reservas pendientes de invitaciones hasta confirmar email.

## Criterios de aceptacion

- [x] Admin puede crear solo código desde `/admin/invitaciones`.
- [x] Admin puede crear y enviar invitación por email desde `/admin/invitaciones`.
- [x] Brevo se llama solo desde Supabase Edge Function.
- [x] La API key de Brevo no aparece en React/Vite.
- [x] El código plano solo se devuelve en creación manual o fallo parcial.
- [x] Hay auditoría de intentos de envío con RLS activado.
- [x] Registro muestra aviso para confirmar email.
- [x] Login muestra mensaje tras confirmar email y error claro si el email no está confirmado.
- [x] La configuración manual de Supabase Auth SMTP queda documentada.

## Validacion

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run pb:check`
- `npm run test:db` si el entorno DB está disponible.

## Resultado

Implementado y asociado a [[../releases/RELEASE-0.1.0-beta.10|RELEASE-0.1.0-beta.10]]. La migración y la Edge Function quedaron desplegadas manualmente en Supabase; el envío funciona usando un remitente personal validado temporalmente. Queda pendiente validar el remitente definitivo `hola@updates.caches.es` antes de producción estable.
