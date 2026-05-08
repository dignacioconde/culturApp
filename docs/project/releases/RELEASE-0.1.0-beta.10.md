---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.10
title: Emails transaccionales beta
lifecycle: active
created: '2026-05-07'
updated: '2026-05-08'
aliases:
  - RELEASE-0.1.0-beta.10
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: released
release_current: false
release_branch: main
release_tag: v0.1.0-beta.10
release_pr: null
---
# RELEASE-0.1.0-beta.10 — Emails transaccionales beta

## Estado

Released

## Rama de release

`main`

## Tag

`v0.1.0-beta.10`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.10` es un corte técnico corto para activar emails transaccionales de invitación y preparar confirmación de email.

## Objetivo de la release

Permitir enviar invitaciones beta por email desde el panel admin y preparar la confirmación de email de Supabase Auth con Brevo.

## Alcance funcional

- Envío de invitaciones beta por Supabase Edge Function y Brevo API.
- Auditoría interna de intentos de envío sin guardar códigos planos.
- UI admin con modos `Crear solo código` y `Crear y enviar`.
- Registro preparado para confirmación de email.
- Login con mensaje de email confirmado y error claro para email no confirmado.
- Documentación operativa de Brevo API, Brevo SMTP y Supabase Auth.

## Áreas implicadas

- Data: auditoría de entregas de invitaciones.
- Security/privacy: secretos solo server-side, RLS y ausencia de service role en cliente.
- Frontend: panel admin, registro y login.
- Operaciones: Brevo API, Brevo SMTP y despliegue de Edge Function.

## Scope

- [[../issues/CACH-B0019|CACH-B0019]] — Emails transaccionales beta con Brevo.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0019|CACH-B0019]] | Emails transaccionales beta con Brevo | Released | `main` |

## Fuera de alcance

- Newsletters, campañas, contactos, audiencias, automatizaciones, CRM y webhooks.
- Reservas pendientes de invitación hasta confirmar email.
- Cambio automático de Supabase Auth desde código; la activación de SMTP/confirmación es manual en Dashboard.

## Riesgos

- Brevo rechaza remitentes no validados; temporalmente se usa un email personal validado hasta autenticar `updates.caches.es`.
- La confirmación de email de Supabase Auth depende del `Sender email` configurado manualmente en SMTP; si ese remitente no está confirmado/validado en Brevo, el registro puede solicitar confirmación pero el usuario no recibe el correo.
- La invitación se consume al crear `auth.users`, antes de confirmar email, por el trigger actual.
- El entorno de agentes necesita un token Supabase válido para poder operar CLI/MCP desde Codex.

## Decisiones relacionadas

- [[../decisions/ADR-0002-beta-trust-before-pro|ADR-0002]]

## Checklist de entrada

- [x] Release creada
- [x] Issue asociada
- [x] Alcance definido
- [x] Criterios de validación definidos

## Checklist de desarrollo

- [x] Issue cerrada
- [x] Cambios integrados en `main`
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilización

- [x] Build correcto
- [x] Tests/checks correctos (`npm run lint`, `npm run test`, `npm run build`, `npm run pb:check`, `git diff --check`)
- [x] Revisión funcional de invitación enviada con Brevo
- [x] Revisión de documentación
- [x] Migración aplicada en Supabase remoto
- [x] Edge Function desplegada en Supabase remoto

## Checklist de salida

- [x] Release preparada para subir a `main`
- [x] Tag `v0.1.0-beta.10` creado desde `main`
- [x] Producción verificada si aplica
- [x] Release notes actualizadas
- [x] Issue marcada como `Released`
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Siguiente release vacía creada

## Release notes

### Añadido

- Edge Function `send-beta-invite` para crear invitación y enviarla por Brevo API.
- Tabla `beta_invite_email_deliveries` y RPC de auditoría admin-only.
- Modo `Crear y enviar` en `/admin/invitaciones`.
- Mensajes de confirmación de email en registro y login.
- Prompt operativo para completar acceso Supabase/CLI desde agentes.

### Cambiado

- El panel admin conserva `Crear solo código` y añade envío opcional por email.
- `signUp` incluye `emailRedirectTo` hacia `/login?confirmed=1`.
- La documentación separa Brevo API key v3 de Brevo SMTP key.
- La documentación operativa avisa de que el remitente SMTP de Supabase Auth debe ser un remitente validado en Brevo.

### Corregido

- El registro muestra errores más concretos para invitación inválida, email registrado, SMTP fallido o email no confirmado.

### Eliminado

- No se añade backend propio ni SDK pesado de Brevo.

### Técnico

- Validado localmente: `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check`, `npm run test:db` (skip esperado por falta de Supabase CLI local) y `git diff --check`.
- Producción verificada en Vercel para el commit `49ad6fd`.

## Resultado final

Release técnica subida a producción el 2026-05-07. Queda como deuda operativa crear o activar un remitente real de Cachés, validarlo en Brevo, cambiar el remitente temporal personal de Supabase Auth/Edge Function al remitente definitivo y configurar SPF/DKIM/DMARC.
