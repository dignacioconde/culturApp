---
id: CACH-B0020
title: Validar dominio de email transaccional y cambiar remitentes definitivos
type: chore
status: in-progress
cycle: beta-1
priority: p0
estimate: s
area: infra
release: RELEASE-0.1.0-beta.14
created_at: 2026-05-07
updated_at: 2026-05-08
due_at: 2026-05-08
aliases:
  - CACH-B0020
tags:
  - product-brain
  - issue
  - email
  - supabase
  - brevo
---

# CACH-B0020 — Validar dominio de email transaccional y cambiar remitentes definitivos

## Objetivo

Dejar un email/remitente definitivo real de Cachés operativo para emails transaccionales, eliminando el remitente personal temporal confirmado en Brevo antes de seguir invitando usuarios reales.

## Alcance

- Crear o activar un email/alias real para el remitente definitivo de Cachés.
- Validar en Brevo el dominio o remitente definitivo cuando exista como email real.
- Configurar los DNS requeridos por Brevo para SPF, DKIM y DMARC.
- Cambiar `EMAIL_FROM_ADDRESS` de la Edge Function `send-beta-invite` al remitente definitivo.
- Cambiar el `Sender email` de Supabase Auth SMTP al remitente definitivo.
- Verificar invitación beta y email de confirmación de cuenta con un smoke test real.

Queda fuera newsletter, campañas, CRM, automatizaciones y rediseño de plantillas.

Contexto operativo: ahora mismo el envío funciona porque el remitente temporal configurado es un email real y está confirmado/validado en Brevo. No cambiarlo al remitente definitivo de Cachés hasta que ese email/alias exista y Brevo lo marque como validado.

## Criterios de aceptacion

- [ ] El remitente definitivo existe como email o alias real.
- [ ] Brevo marca el dominio/remitente definitivo como validado.
- [ ] DNS de `updates.caches.es`/`caches.es` incluye los registros SPF, DKIM y DMARC requeridos.
- [ ] Edge Function `send-beta-invite` usa el remitente definitivo solo después de validarlo en Brevo.
- [ ] Supabase Auth SMTP usa el remitente definitivo como `Sender email` solo después de validarlo en Brevo.
- [ ] Una invitación enviada desde `/admin/invitaciones` llega a bandeja o aparece como entregada en logs de Brevo.
- [ ] Un registro nuevo recibe email de confirmación y puede confirmar la cuenta.
- [ ] No quedan emails personales como remitente operativo documentado ni configurado.

## Validacion

- Supabase MCP/CLI: comprobar secrets sin imprimir valores.
- Supabase MCP: revisar logs `edge-function` y `auth` sin exponer datos personales.
- Brevo: revisar estado de dominio/remitente y logs transaccionales.
- DNS: comprobar TXT/MX relevantes con `dig`.
- App: smoke test de invitación y confirmación.

## Prioridad operativa

Máxima prioridad operativa, pero separada del corte de código de beta 12.

Queda fuera de `RELEASE-0.1.0-beta.11`, `RELEASE-0.1.0-beta.12` y `RELEASE-0.1.0-beta.13`; pasa a `RELEASE-0.1.0-beta.14` por requerir pasos manuales de email, DNS, Brevo y Supabase SMTP.

## Resultado

En progreso en `RELEASE-0.1.0-beta.14`.
