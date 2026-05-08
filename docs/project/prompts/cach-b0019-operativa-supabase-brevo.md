---
schema_version: 2
kind: prompt
id: PB-PROMPT-CACH-B0019
title: Operativa Supabase/Brevo desde agente
lifecycle: active
created: '2026-05-07'
updated: '2026-05-08'
aliases:
  - Prompt CACH-B0019 operativa Supabase Brevo
tags:
  - product-brain
  - prompt
  - supabase
  - brevo
  - operations
generated: false
---
# CACH-B0019 — Operativa Supabase/Brevo desde agente

Usa este prompt cuando un agente tenga que terminar o verificar la operativa de emails transaccionales de Cachés sin volver a pasar comandos manuales al usuario.

```markdown
Actúa como agente senior de CulturaApp para cerrar la operativa Supabase/Brevo de CACH-B0019.

## Objetivo

Dejar operativa la ejecución desde agente de comandos Supabase necesarios para Edge Functions, secrets, logs y verificación de emails transaccionales.

## Contexto

- Proyecto Supabase: `mkidexrkhjhrsjnjmugw`.
- Edge Function: `send-beta-invite`.
- Proveedor de invitaciones: Brevo API HTTP.
- Proveedor de confirmaciones Auth: Brevo SMTP en Supabase Dashboard.
- `BREVO_API_KEY` debe ser API key v3 (`xkeysib-...`), no SMTP key.
- SMTP login/key de Brevo solo va en `Authentication > Email > SMTP Settings`.
- Remitente temporal usado: email personal validado en Brevo.
- Remitente objetivo: pendiente de crear/activar como email o alias real de Cachés, validar en Brevo y proteger con SPF/DKIM/DMARC.
- Gotcha: el `Sender email` de Supabase Auth SMTP debe coincidir con un remitente confirmado/validado en Brevo; si está mal, Auth puede registrar `user_confirmation_requested` sin que el usuario reciba el email.

## Restricciones

- No imprimir tokens, API keys, SMTP keys, JWTs ni service role.
- No pedir al usuario que pegue secretos en chat.
- No usar service role en frontend.
- No tocar producción destructivamente.
- Si `SUPABASE_ACCESS_TOKEN` está seteado pero inválido en la sesión, usar `env -u SUPABASE_ACCESS_TOKEN npx supabase ...` o pedir que se configure un token válido fuera del chat.

## Pasos del agente

1. Comprobar contexto local:
   - `pwd`
   - `git status --short --branch`
   - `npx supabase --version`

2. Comprobar acceso Supabase sin imprimir secretos:
   - `env -u SUPABASE_ACCESS_TOKEN npx supabase functions list --project-ref mkidexrkhjhrsjnjmugw`
   - Si falla por auth, indicar al usuario que cree Personal Access Token `sbp_...` en Supabase Account Tokens y haga login local sin compartirlo.

3. Verificar secrets:
   - `EMAIL_PROVIDER`
   - `BREVO_API_KEY`
   - `APP_URL`
   - `EMAIL_FROM_ADDRESS`
   - `EMAIL_FROM_NAME`
   - `EMAIL_REPLY_TO`

4. Si hay cambios en `supabase/functions/send-beta-invite/index.ts`, desplegar:
   - `env -u SUPABASE_ACCESS_TOKEN npx supabase functions deploy send-beta-invite --project-ref mkidexrkhjhrsjnjmugw`

5. Leer auditoría de envíos desde SQL Editor/MCP/CLI:
   ```sql
   select
     status,
     provider_message_id,
     error_code,
     error_message,
     created_at
   from public.beta_invite_email_deliveries
   order by created_at desc
   limit 5;
   ```

6. Diagnóstico rápido:
   - `unauthorized / Key not found`: `BREVO_API_KEY` no es API key v3 válida.
   - `sender ... is not valid`: remitente no validado en Brevo.
   - `sent`: Edge Function y Brevo API aceptaron el envío; revisar logs transaccionales de Brevo para entrega.
   - `user_confirmation_requested` en Auth sin email recibido: revisar primero `Sender email` SMTP de Supabase Auth, validación del remitente en Brevo, supresiones/bounces y DNS SPF/DKIM/DMARC.

7. Verificación funcional:
   - Crear invitación desde `/admin/invitaciones`.
   - Confirmar que llega email de invitación.
   - Registrar usuario desde `/register?invite=...`.
   - Confirmar que Supabase Auth envía email de confirmación por Brevo SMTP.
   - Confirmar redirección a `/login?confirmed=1` e inicio de sesión.

## Resultado esperado

Responder con:
- Estado de Edge Function.
- Estado de secrets, sin valores.
- Últimos eventos de auditoría, sin emails completos.
- Resultado del smoke test.
- Pendientes: crear/activar email o alias real de Cachés, validarlo en Brevo, cambiar `EMAIL_FROM_ADDRESS` y `Sender email` SMTP al remitente definitivo, SPF/DKIM/DMARC y revalidar.
```
