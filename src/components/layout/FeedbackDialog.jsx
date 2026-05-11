import { useId, useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Select, Textarea } from '../ui/Input'
import { useFeedback } from '../../hooks/useFeedback'

const feedbackAreaOptions = [
  { value: '', label: 'General' },
  { value: 'trabajos', label: 'Trabajos' },
  { value: 'agenda', label: 'Agenda' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'ajustes', label: 'Ajustes' },
  { value: 'datos', label: 'Datos' },
]

export function FeedbackDialog({ isOpen, onClose, userId, onSubmitted }) {
  const consentId = useId()
  const consentErrorId = `${consentId}-error`
  const [message, setMessage] = useState('')
  const [area, setArea] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [consentError, setConsentError] = useState('')
  const [formError, setFormError] = useState('')
  const { submitFeedback, submitting } = useFeedback(userId)

  const resetForm = () => {
    setMessage('')
    setArea('')
    setConsentGiven(false)
    setMessageError('')
    setConsentError('')
    setFormError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedMessage = message.trim()
    const nextMessageError = trimmedMessage ? '' : 'Escribe al menos una frase.'
    const nextConsentError = consentGiven ? '' : 'Acepta el consentimiento para enviar el feedback.'

    setMessageError(nextMessageError)
    setConsentError(nextConsentError)
    setFormError('')

    if (nextMessageError || nextConsentError) return

    const { error } = await submitFeedback({
      message: trimmedMessage,
      area,
      consentGiven,
    })

    if (error) {
      setFormError('No hemos podido enviar el feedback. Vuelve a intentarlo.')
      return
    }

    onSubmitted?.()
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cuéntanos qué mejorar">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Select label="Área" name="area" value={area} onChange={(event) => setArea(event.target.value)}>
          {feedbackAreaOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>

        <Textarea
          label="Tu comentario *"
          name="message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setMessageError('')
            setFormError('')
          }}
          maxLength={4000}
          rows={5}
          required
          error={messageError}
          placeholder="Qué te ha frenado, qué echas en falta o qué deberíamos pulir."
          className="min-h-36"
        />

        <label className="flex items-start gap-3 rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4 text-sm text-[var(--color-ink)]">
          <input
            id={consentId}
            type="checkbox"
            checked={consentGiven}
            onChange={(event) => {
              setConsentGiven(event.target.checked)
              setConsentError('')
              setFormError('')
            }}
            aria-describedby={consentError ? consentErrorId : undefined}
            className="mt-1 h-5 w-5 shrink-0 rounded border-[var(--color-paper-mid)] accent-[var(--color-red)]"
          />
          <span className="min-w-0">
            <span className="block font-medium">Acepto enviar este comentario para mejorar la beta.</span>
            <span className="mt-1 block text-[var(--color-ink-muted)]">No incluyas datos sensibles de clientes.</span>
            {consentError && <span id={consentErrorId} className="mt-2 block text-xs font-medium text-red-600">{consentError}</span>}
          </span>
        </label>

        {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting} className="justify-center">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="justify-center">
            {submitting ? 'Enviando...' : 'Enviar feedback'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
