import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type InviteRow = {
  id: string
  code?: string
  label: string | null
  max_redemptions: number
  redeemed_count: number
  expires_at: string | null
  revoked_at: string | null
  created_at: string | null
  updated_at: string | null
}

type InviteResponse = Omit<InviteRow, 'code'>

type Payload = {
  recipientEmail?: unknown
  recipientName?: unknown
  label?: unknown
  maxRedemptions?: unknown
  expiresAt?: unknown
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function parsePayload(rawPayload: Payload) {
  const recipientEmail = cleanString(rawPayload.recipientEmail, 254).toLowerCase()
  const recipientName = cleanString(rawPayload.recipientName, 120)
  const label = cleanString(rawPayload.label, 120)
  const maxRedemptions = Number(rawPayload.maxRedemptions ?? 1)
  const expiresAt = typeof rawPayload.expiresAt === 'string' && rawPayload.expiresAt.trim()
    ? rawPayload.expiresAt.trim()
    : null

  if (!recipientEmail || !emailPattern.test(recipientEmail)) {
    return { error: 'Introduce un email válido.' }
  }

  if (Array.isArray(rawPayload.recipientEmail)) {
    return { error: 'Solo puedes enviar una invitación por email cada vez.' }
  }

  if (!Number.isInteger(maxRedemptions) || maxRedemptions < 1 || maxRedemptions > 100) {
    return { error: 'Los usos máximos deben estar entre 1 y 100.' }
  }

  if (expiresAt) {
    const expiresDate = new Date(expiresAt)
    if (Number.isNaN(expiresDate.getTime()) || expiresDate <= new Date()) {
      return { error: 'Elige una fecha de caducidad futura.' }
    }
  }

  return {
    data: {
      recipientEmail,
      recipientName: recipientName || null,
      label: label || null,
      maxRedemptions,
      expiresAt,
    },
  }
}

function stripCode(invite: InviteRow): InviteResponse {
  const { code: _code, ...safeInvite } = invite
  return safeInvite
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeProviderText(value: unknown) {
  if (typeof value !== 'string') return null
  return value.replace(/[\r\n]+/g, ' ').slice(0, 180)
}

async function readBrevoError(response: Response) {
  const body = await response.json().catch(() => null)
  return {
    code: sanitizeProviderText(body?.code) ?? `brevo_http_${response.status}`,
    message: sanitizeProviderText(body?.message) ?? 'Brevo no ha aceptado el envío.',
  }
}

function buildEmail(inviteUrl: string) {
  const safeInviteUrl = escapeHtml(inviteUrl)
  const htmlContent = `
    <p>Hola,</p>
    <p>Te han invitado a probar Cachés, una herramienta para organizar trabajos, eventos, cobros y gastos de forma clara.</p>
    <p><a href="${safeInviteUrl}">Crear mi cuenta</a></p>
    <p>Si el botón no funciona, copia y pega este enlace en el navegador:</p>
    <p>${safeInviteUrl}</p>
    <p>Este enlace puede caducar o tener usos limitados.</p>
    <p>Un abrazo,<br />Cachés</p>
  `.trim()

  const textContent = [
    'Hola,',
    '',
    'Te han invitado a probar Cachés, una herramienta para organizar trabajos, eventos, cobros y gastos de forma clara.',
    '',
    `Crear mi cuenta: ${inviteUrl}`,
    '',
    'Este enlace puede caducar o tener usos limitados.',
    '',
    'Un abrazo,',
    'Cachés',
  ].join('\n')

  return { htmlContent, textContent }
}

function inviteCreateError(error: { message?: string; code?: string } | null) {
  if (error?.message?.includes('admin_required')) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'admin_required',
      message: 'No tienes permisos para enviar invitaciones.',
    }, 403)
  }

  return jsonResponse({
    ok: false,
    partial: false,
    error: 'invite_create_failed',
    message: 'No hemos podido crear la invitación.',
  }, 400)
}

async function logDelivery(
  supabase: ReturnType<typeof createClient>,
  params: {
    inviteId: string
    recipientEmail: string
    recipientName: string | null
    providerMessageId: string | null
    status: 'sent' | 'failed'
    errorCode?: string | null
    errorMessage?: string | null
  },
) {
  const { error } = await supabase.rpc('log_beta_invite_email_delivery', {
    delivery_invite_id: params.inviteId,
    delivery_recipient_email: params.recipientEmail,
    delivery_recipient_name: params.recipientName,
    delivery_provider: 'brevo',
    delivery_provider_message_id: params.providerMessageId,
    delivery_status: params.status,
    delivery_error_code: params.errorCode ?? null,
    delivery_error_message: params.errorMessage ?? null,
  })

  if (error) {
    console.error('[send-beta-invite:audit]', {
      code: error.code,
      message: error.message,
    })
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'method_not_allowed',
      message: 'Método no permitido.',
    }, 405)
  }

  const authorization = req.headers.get('Authorization')
  if (!authorization) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'unauthorized',
      message: 'Necesitas iniciar sesión para enviar invitaciones.',
    }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const emailProvider = Deno.env.get('EMAIL_PROVIDER') ?? 'brevo'
  const brevoApiKey = Deno.env.get('BREVO_API_KEY')
  const appUrl = Deno.env.get('APP_URL') ?? 'https://culturapp-rho.vercel.app'
  const fromAddress = Deno.env.get('EMAIL_FROM_ADDRESS')
  const fromName = Deno.env.get('EMAIL_FROM_NAME') ?? 'Cachés'
  const replyTo = Deno.env.get('EMAIL_REPLY_TO')

  if (!supabaseUrl || !supabaseAnonKey || emailProvider !== 'brevo') {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'configuration_error',
      message: 'El envío por email no está configurado.',
    }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authorization },
    },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'unauthorized',
      message: 'Necesitas iniciar sesión para enviar invitaciones.',
    }, 401)
  }

  let payload: Payload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'invalid_payload',
      message: 'Revisa los datos de la invitación.',
    }, 400)
  }

  const parsedPayload = parsePayload(payload)
  if ('error' in parsedPayload) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'invalid_payload',
      message: parsedPayload.error,
    }, 400)
  }

  if (!brevoApiKey || !fromAddress || !replyTo) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'configuration_error',
      message: 'El envío por email no está configurado.',
    }, 500)
  }

  const { recipientEmail, recipientName, label, maxRedemptions, expiresAt } = parsedPayload.data
  const { data: inviteData, error: createError } = await supabase.rpc('create_beta_invite', {
    invite_label: label,
    invite_max_redemptions: maxRedemptions,
    invite_expires_at: expiresAt,
  })

  if (createError) {
    console.error('[send-beta-invite:create]', {
      code: createError.code,
      message: createError.message,
    })
    return inviteCreateError(createError)
  }

  const invite = (Array.isArray(inviteData) ? inviteData[0] : inviteData) as InviteRow | null
  if (!invite?.id || !invite.code) {
    return jsonResponse({
      ok: false,
      partial: false,
      error: 'invite_create_failed',
      message: 'La invitación se ha creado, pero la respuesta no incluía el código.',
    }, 500)
  }

  const inviteUrl = `${appUrl.replace(/\/$/, '')}/register?invite=${encodeURIComponent(invite.code)}`
  const { htmlContent, textContent } = buildEmail(inviteUrl)
  const brevoPayload = {
    sender: {
      email: fromAddress,
      name: fromName,
    },
    to: [
      {
        email: recipientEmail,
        ...(recipientName ? { name: recipientName } : {}),
      },
    ],
    subject: 'Tu invitación a Cachés',
    htmlContent,
    textContent,
    replyTo: {
      email: replyTo,
    },
  }

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    })

    if (!brevoResponse.ok) {
      const providerError = await readBrevoError(brevoResponse)
      console.error('[send-beta-invite:brevo]', {
        status: brevoResponse.status,
        code: providerError.code,
        message: providerError.message,
      })
      await logDelivery(supabase, {
        inviteId: invite.id,
        recipientEmail,
        recipientName,
        providerMessageId: null,
        status: 'failed',
        errorCode: providerError.code,
        errorMessage: providerError.message,
      })

      return jsonResponse({
        ok: false,
        partial: true,
        error: 'email_send_failed',
        message: 'La invitación se ha creado, pero no hemos podido enviar el email.',
        invite: {
          ...stripCode(invite),
          code: invite.code,
        },
      })
    }

    const brevoData = await brevoResponse.json().catch(() => ({}))
    const providerMessageId = typeof brevoData.messageId === 'string' ? brevoData.messageId : null
    await logDelivery(supabase, {
      inviteId: invite.id,
      recipientEmail,
      recipientName,
      providerMessageId,
      status: 'sent',
    })

    return jsonResponse({
      ok: true,
      invite: stripCode(invite),
      email: {
        status: 'sent',
        provider: 'brevo',
        provider_message_id: providerMessageId,
      },
    })
  } catch {
    await logDelivery(supabase, {
      inviteId: invite.id,
      recipientEmail,
      recipientName,
      providerMessageId: null,
      status: 'failed',
      errorCode: 'brevo_request_failed',
      errorMessage: 'No se ha podido contactar con Brevo.',
    })

    return jsonResponse({
      ok: false,
      partial: true,
      error: 'email_send_failed',
      message: 'La invitación se ha creado, pero no hemos podido enviar el email.',
      invite: {
        ...stripCode(invite),
        code: invite.code,
      },
    })
  }
})
