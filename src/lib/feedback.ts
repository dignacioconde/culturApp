import { supabase } from '../supabaseClient'

export type FeedbackSource = 'widget' | 'email' | 'telegram' | 'other'
export type FeedbackSeverity = 'low' | 'medium' | 'high'

export type FeedbackPayload = {
  message: string
  consent_given: boolean
  source?: FeedbackSource
  severity?: FeedbackSeverity
  area?: string
  user_agent?: string
  user_id?: string | null
}

export async function submitFeedback(payload: FeedbackPayload) {
  const { error } = await supabase
    .from('feedback')
    .insert({
      source: payload.source ?? 'widget',
      severity: payload.severity ?? null,
      area: payload.area ?? null,
      message: payload.message,
      user_agent: payload.user_agent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : null),
      user_id: payload.user_id ?? null,
      consent_given: payload.consent_given,
    })

  if (error) throw error
  return { ok: true }
}
