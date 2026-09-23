# Operativa de email

## Gotchas duraderos

- Si Supabase registra `user_confirmation_requested` pero el correo no llega, revisar remitente SMTP, validación de dominio/remitente en Brevo, logs transaccionales y SPF/DKIM/DMARC antes de culpar a la app.
- **email.transactional_domain:** `caches.es`; `no-reply@caches.es` envía y `contacto@caches.es` recibe respuestas. _(fuente: docs/project/issues/CACH-B0020.md; verificado: 2026-09-22)_
- Si la confirmación redirige mal, revisar `src/lib/authRedirect.js` y la configuración URL/template de Supabase Auth.
- Nunca guardar direcciones personales, credenciales SMTP ni claves de Brevo en memoria o documentación.
