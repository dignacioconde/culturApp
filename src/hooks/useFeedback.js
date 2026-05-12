import { useCallback, useState } from 'react'
import { submitFeedback as insertFeedback } from '../lib/feedback'

export function useFeedback(userId) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submitFeedback = useCallback(async ({ message, area, consentGiven }) => {
    const trimmedMessage = message.trim()

    if (!userId) {
      const authError = new Error('Necesitas iniciar sesión para enviar feedback.')
      setError(authError)
      return { error: authError }
    }

    if (!trimmedMessage) {
      const validationError = new Error('Escribe al menos una frase.')
      setError(validationError)
      return { error: validationError }
    }

    if (!consentGiven) {
      const consentError = new Error('Necesitamos tu consentimiento para guardar el feedback.')
      setError(consentError)
      return { error: consentError }
    }

    setSubmitting(true)
    setError(null)

    try {
      await insertFeedback({
        message: trimmedMessage,
        area: area || null,
        source: 'widget',
        userId,
        consent_given: true,
      })
      return { error: null }
    } catch (nextError) {
      setError(nextError)
      return { error: nextError }
    } finally {
      setSubmitting(false)
    }
  }, [userId])

  return { submitFeedback, submitting, error }
}
