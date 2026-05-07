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

function genericAdminError(error) {
  if (!error) return ''
  if (error.message?.includes('admin_required')) {
    return 'No tienes permisos para gestionar invitaciones.'
  }
  return 'No hemos podido gestionar las invitaciones. Vuelve a intentarlo.'
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
      const message = genericAdminError(error)
      setError(message)
      return { data: null, error, message }
    }
    const created = normalizeInvite(data?.[0] ?? data)
    await refetch()
    return { data: created, error: null, message: '' }
  }

  const revokeInvite = async (inviteId) => {
    setError('')
    const { data, error } = await supabase.rpc('revoke_beta_invite', { target_invite_id: inviteId })
    if (error) {
      const message = genericAdminError(error)
      setError(message)
      return { data: null, error, message }
    }
    await refetch()
    return { data: data?.[0] ?? data, error: null, message: '' }
  }

  return { invites, loading, error, refetch, createInvite, revokeInvite }
}
