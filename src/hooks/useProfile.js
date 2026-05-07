import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const PROFILE_FIELDS = [
  'id',
  'full_name',
  'profession',
  'tax_rate',
  'onboarding_completed',
  'onboarding_completed_at',
  'usage_consent',
  'usage_consent_at',
  'usage_consent_version',
  'beta_invite_id',
  'role',
].join(', ')

const BASE_PROFILE_FIELDS = [
  'id',
  'full_name',
  'profession',
  'tax_rate',
].join(', ')

function withProfileDefaults(profile) {
  if (!profile) return profile
  return {
    onboarding_completed: true,
    onboarding_completed_at: null,
    usage_consent: false,
    usage_consent_at: null,
    usage_consent_version: null,
    beta_invite_id: null,
    role: 'user',
    ...profile,
  }
}

function isMissingProfileColumnError(error) {
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`
  return error?.code === '42703' || /column .* does not exist/i.test(message)
}

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', userId)
      .single()

    if (error && isMissingProfileColumnError(error)) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('profiles')
        .select(BASE_PROFILE_FIELDS)
        .eq('id', userId)
        .single()

      if (fallbackError) setError(fallbackError)
      else setProfile(withProfileDefaults(fallbackData))
      setLoading(false)
      return
    }

    if (error) setError(error)
    else setProfile(withProfileDefaults(data))
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    queueMicrotask(fetchProfile)
  }, [userId, fetchProfile])

  const updateProfile = async (profileData) => {
    setError(null)
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select(PROFILE_FIELDS)
      .single()

    if (error) setError(error)
    if (!error && data) setProfile(withProfileDefaults(data))
    return { data, error }
  }

  return { profile, data: profile, loading, error, updateProfile, refetch: fetchProfile }
}
