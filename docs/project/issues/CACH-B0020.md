---
schema_version: 2
kind: issue
id: CACH-B0020
title: Validar dominio de email transaccional y cambiar remitentes definitivos
lifecycle: active
created: '2026-05-07'
updated: '2026-05-09'
aliases:
  - CACH-B0020
tags:
  - product-brain
  - issue
  - email
  - supabase
  - brevo
generated: false
work_type: chore
work_level: task
issue_workflow: in_progress
priority: p0
size: s
area: infra
components:
  - infra-deploy
  - email
  - supabase
parent: null
related: []
depends_on: []
blocked_by: []
adr: []
release: RELEASE-0.1.0-beta.14
theme: beta-trust
due_at: '2026-05-08'
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

- [x] El remitente definitivo existe como email o alias real.
- [x] Brevo marca el dominio/remitente definitivo como validado.
- [x] DNS de `updates.caches.es`/`caches.es` incluye los registros SPF, DKIM y DMARC requeridos.
- [x] Edge Function `send-beta-invite` usa el remitente definitivo solo después de validarlo en Brevo.
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

## Desarrollo

- Rama: `release/0.1.0-beta.14`
- PR: pendiente
- Estado actual: release branch creada y alineada con `main`; pendiente de pasos manuales de email, DNS, Brevo y Supabase SMTP.

## Notas de progreso

- 2026-05-09: inicio operativo de beta 14. La rama `release/0.1.0-beta.14` queda preparada para ejecutar la validacion de email transaccional definitivo.
- 2026-05-09: `caches.es` queda registrado en Hostinger. Se crea el buzon real `contacto@caches.es` y el alias `no-reply@caches.es` apuntando a `contacto@caches.es`.
- 2026-05-09: `caches.es` queda anadido en Brevo para autenticacion manual por DNS. Se anaden en Hostinger los registros de codigo Brevo TXT, DKIM 1, DKIM 2 y DMARC indicados por Brevo.
- 2026-05-09: se detecta DMARC duplicado y se corrige dejando un unico registro `_dmarc` con `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`. SPF revisado: solo existe un registro SPF.
- 2026-05-09: `dig` confirma codigo Brevo TXT, SPF unico de Hostinger, DKIM 1, DKIM 2 y DMARC. Brevo marca `caches.es` como autenticado.
- 2026-05-09: se actualizan secrets de Supabase Edge Function para usar `no-reply@caches.es` como `EMAIL_FROM_ADDRESS`, `Cachés` como `EMAIL_FROM_NAME` y `contacto@caches.es` como `EMAIL_REPLY_TO`. Se despliega `send-beta-invite`, que queda activa en version 10.

## Cambios de alcance y decisiones


## Bloqueos

- Pendiente cambiar `Sender email` de Supabase Auth SMTP al remitente definitivo en Dashboard.
- Pendiente smoke test real de invitacion beta y confirmacion de cuenta.

## Validación ejecutada

Validado por `dig`:

```bash
dig TXT caches.es
dig CNAME brevo1._domainkey.caches.es
dig CNAME brevo2._domainkey.caches.es
dig TXT _dmarc.caches.es
```

Supabase Edge Function:

- Secrets de remitente actualizados sin imprimir valores sensibles.
- `send-beta-invite` desplegada en el proyecto `mkidexrkhjhrsjnjmugw`.
- MCP/CLI confirma funcion activa en version 10.

Pendiente completar validacion funcional con invitacion beta y confirmacion de cuenta.

## Memoria

No aplica por ahora.
