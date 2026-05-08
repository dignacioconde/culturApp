import { useState } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await onConfirm?.()
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (!submitting) onCancel?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <div className="flex flex-col gap-5">
        {description && (
          <p className="break-words text-sm leading-6 text-[var(--color-ink-muted)]">{description}</p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={submitting}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Eliminando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
