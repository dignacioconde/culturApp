# Email Operations Memory

## 2026-05-07 - Supabase Auth Confirmation Sender Must Be Validated In Brevo

- Context: A confirmation email delivery issue was traced to manual Supabase Auth SMTP sender configuration, not to a Supabase outage or app-side invitation code.
- Durable memory: if Auth logs show `user_confirmation_requested` but the user does not receive the confirmation email, check Supabase Auth SMTP `Sender email`, Brevo sender/domain validation, Brevo transactional logs and SPF/DKIM/DMARC before assuming an app bug.
- Current caveat: a personal confirmed/validated sender is used temporarily because Brevo rejects or does not deliver from unconfirmed/non-real senders. Do not switch to a definitive Cachés sender until the email/alias exists and Brevo confirms the domain/remitente.
- Privacy note: do not store the personal sender address, SMTP credentials or Brevo keys in memory, docs, issues or prompts.

## 2026-05-09 - Definitive Caches Sender

- `caches.es` is the definitive email domain for Cachés.
- `contacto@caches.es` is the real human mailbox and reply-to address.
- `no-reply@caches.es` is the transactional sender alias for beta invites and Auth SMTP once configured.
- Brevo domain authentication for `caches.es` was validated before switching the Edge Function sender. Supabase Auth SMTP still must be checked separately in the Dashboard because SMTP keys are not stored in repo or chat.
