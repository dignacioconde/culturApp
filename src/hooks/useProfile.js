import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

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
      .select('id, full_name, profession, tax_rate')
      .eq('id', userId)
      .single()

    if (error) setError(error)
    else setProfile(data)
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
      .select()
      .single()

    if (error) setError(error)
    if (!error && data) setProfile(data)
    return { data, error }
  }

  return { profile, data: profile, loading, error, updateProfile, refetch: fetchProfile }
}
