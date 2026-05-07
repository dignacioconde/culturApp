import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function normalizeInvite(invite) {
  return {
    id: invite.id,
    label: invite.label ?? '',
    max_redemptions: invite.max_redemptions ?? 1,
    redeemed_count: invite.redeemed_count ?? 0,
    redemption_count: invite.redemption_count ?? invite.redeemed_count ?? 0,
    expires_at: invite.expires_at ?? null,
    revoked_at: invite.revoked_at ?? null,
    created_at: invite.created_at ?? null,
    updated_at: invite.updated_at ?? null,
    last_redeemed_at: invite.last_redeemed_at ?? null,
    code: invite.code,
  }
}

function logAdminRpcError(operation, error) {
  if (!error) return
  console.error(`[beta-invites:${operation}]`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  })
}

function genericAdminError(error) {
  if (!error) return ''
  if (error.message?.includes('admin_required')) {
    return 'No tienes permisos para gestionar invitaciones.'
  }
  if (error.code === 'PGRST202' || error.code === 'PGRST203') {
    return 'La conexión con las funciones de invitaciones no está actualizada. Recarga el esquema de Supabase y vuelve a intentarlo.'
  }
  if (error.message?.includes('gen_random_bytes') || error.message?.includes('digest')) {
    return 'La función de invitaciones necesita el hotfix de pgcrypto antes de crear códigos.'
  }
  return 'No hemos podido gestionar las invitaciones. Vuelve a intentarlo.'
}

function genericSendInviteError(error, responseData) {
  if (responseData?.message) return responseData.message
  if (error?.message?.includes('FunctionsHttpError')) {
    return 'No hemos podido enviar la invitación. Vuelve a intentarlo.'
  }
  return 'No hemos podido enviar la invitación. Vuelve a intentarlo.'
}

async function readFunctionErrorData(error) {
  if (!error?.context?.json) return null
  try {
    return await error.context.json()
  } catch {
    return null
  }
}

export function useBetaInvites() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.rpc('list_beta_invites')
    if (error) {
      logAdminRpcError('list', error)
      setError(genericAdminError(error))
      setInvites([])
    } else {
      setInvites((data ?? []).map(normalizeInvite))
    }
    setLoading(false)
    return { data, error }
  }, [])

  useEffect(() => {
    queueMicrotask(refetch)
  }, [refetch])

  const createInvite = async ({ label, maxRedemptions, expiresAt }) => {
    setError('')
    const params = {
      invite_label: label?.trim() || null,
      invite_max_redemptions: maxRedemptions,
      invite_expires_at: expiresAt || null,
    }
    const { data, error } = await supabase.rpc('create_beta_invite', params)
    if (error) {
      logAdminRpcError('create', error)
      const message = genericAdminError(error)
      setError(message)
      return { data: null, error, message }
    }
    const rawCreated = data?.[0] ?? data
    if (!rawCreated?.code) {
      const message = 'La invitación se ha creado, pero la respuesta no incluía el código.'
      setError(message)
      logAdminRpcError('create:contract', { message, details: data })
      return { data: null, error: new Error(message), message }
    }
    const created = normalizeInvite(rawCreated)
    await refetch()
    return { data: created, error: null, message: '' }
  }

  const createAndSendInvite = async ({ recipientEmail, recipientName, label, maxRedemptions, expiresAt }) => {
    setError('')
    const { data, error } = await supabase.functions.invoke('send-beta-invite', {
      body: {
        recipientEmail: recipientEmail?.trim(),
        recipientName: recipientName?.trim() || null,
        label: label?.trim() || null,
        maxRedemptions,
        expiresAt: expiresAt || null,
      },
    })
    const responseData = data ?? await readFunctionErrorData(error)

    if (responseData?.ok) {
      await refetch()
      return {
        data: {
          invite: normalizeInvite(responseData.invite),
          email: responseData.email,
        },
        error: null,
        message: '',
        partial: false,
      }
    }

    if (responseData?.partial && responseData.invite?.code) {
      await refetch()
      return {
        data: {
          invite: normalizeInvite(responseData.invite),
          email: responseData.email ?? null,
        },
        error: new Error(responseData.error ?? 'email_send_failed'),
        message: responseData.message ?? 'La invitación se ha creado, pero no hemos podido enviar el email.',
        partial: true,
      }
    }

    if (error) {
      logAdminRpcError('send', error)
    }
    const message = genericSendInviteError(error, responseData)
    setError(message)
    return {
      data: null,
      error: error ?? new Error(responseData?.error ?? 'email_send_failed'),
      message,
      partial: false,
    }
  }

  const revokeInvite = async (inviteId) => {
    setError('')
    const { data, error } = await supabase.rpc('revoke_beta_invite', { target_invite_id: inviteId })
    if (error) {
      logAdminRpcError('revoke', error)
      const message = genericAdminError(error)
      setError(message)
      return { data: null, error, message }
    }
    await refetch()
    return { data: data?.[0] ?? data, error: null, message: '' }
  }

  return { invites, loading, error, refetch, createInvite, createAndSendInvite, revokeInvite }
}
