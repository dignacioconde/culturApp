import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const authRedirectOrigin = (import.meta.env.VITE_APP_URL ?? 'https://culturapp-rho.vercel.app').replace(/\/$/, '')

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password, fullName, profession, betaInviteCode) => {
    const metadata = {
      full_name: fullName,
      profession,
    }
    const normalizedBetaInviteCode = betaInviteCode?.trim()

    if (normalizedBetaInviteCode) {
      metadata.beta_invite_code = normalizedBetaInviteCode
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${authRedirectOrigin}/login?confirmed=1`,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signIn, signUp, signOut }
}
