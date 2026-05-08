---
id: CACH-B0020
title: Validar dominio de email transaccional y cambiar remitentes definitivos
type: chore
status: blocked
cycle: beta-1
priority: p0
estimate: s
area: infra
release: RELEASE-0.1.0-beta.11
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

## Bloqueo operativo

Verificación del **8 de mayo de 2026**:

- `caches.es` y `updates.caches.es` no tienen DNS público delegado/resoluble para `NS`, `MX`, `TXT` ni los selectores DKIM esperados por Brevo.
- Supabase Edge Function `send-beta-invite` está activa y con secrets requeridos presentes, sin imprimir valores.
- La auditoría `beta_invite_email_deliveries` muestra envíos recientes `sent` con `provider_message_id`, pero corresponden al estado temporal anterior y no validan el remitente definitivo de Cachés.
- Mientras el dominio/remitente definitivo no exista y Brevo no lo marque como validado, no se debe cambiar `EMAIL_FROM_ADDRESS` ni el `Sender email` de Supabase Auth SMTP.

Siguiente desbloqueo externo: registrar/delegar el dominio o escoger un dominio real ya operativo, crear el email/alias definitivo, añadir en DNS los registros que entregue Brevo y esperar validación pública.

## Prioridad operativa

Máxima prioridad para el **8 de mayo de 2026**.

## Resultado

Bloqueada por falta de dominio/remitente definitivo real y DNS público validable. No se cierra la beta ni se sustituyen remitentes hasta completar el desbloqueo externo y repetir el smoke test real.
