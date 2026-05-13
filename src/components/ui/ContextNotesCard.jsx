import { useState } from 'react'
import { Edit } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Textarea } from './Input'

export function ContextNotesCard({
  title = 'Notas',
  notes = '',
  emptyText = 'Aún no hay notas.',
  placeholder = 'Añade detalles útiles para este trabajo...',
  onSave,
  savingLabel = 'Guardando...',
}) {
  const currentNotes = notes ?? ''
  const hasNotes = currentNotes.trim().length > 0
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentNotes)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEditing = () => {
    setDraft(currentNotes)
    setError('')
    setEditing(true)
  }

  const cancelEditing = () => {
    setDraft(currentNotes)
    setError('')
    setEditing(false)
  }

  const saveNotes = async (nextNotes = draft) => {
    setSaving(true)
    setError('')
    try {
      const { error: saveError } = await onSave(nextNotes.trim())
      if (saveError) {
        setError('No hemos podido guardar la nota. Revisa la conexión y vuelve a intentarlo.')
        return
      }
      setEditing(false)
    } catch {
      setError('No hemos podido guardar la nota. Revisa la conexión y vuelve a intentarlo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            <p className="mt-1 text-xs text-text-secondary">Apuntes privados para preparar y recordar detalles.</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg border border-border-subtle bg-surface-page px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              <Edit size={14} />
              {hasNotes ? 'Editar' : 'Añadir'}
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-3">
            <Textarea
              label="Nota"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={placeholder}
              className="min-h-32"
              disabled={saving}
            />
            {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={() => saveNotes('')} disabled={saving || !hasNotes} className="justify-center">
                Limpiar nota
              </Button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={cancelEditing} disabled={saving} className="justify-center">
                  Cancelar
                </Button>
                <Button type="button" onClick={() => saveNotes()} disabled={saving} className="justify-center">
                  {saving ? savingLabel : 'Guardar nota'}
                </Button>
              </div>
            </div>
          </div>
        ) : hasNotes ? (
          <div className="rounded-lg border border-border-subtle bg-surface-muted px-3 py-3">
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-text-primary">{currentNotes}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border-subtle bg-surface-muted px-3 py-4 text-sm text-text-secondary">
            {emptyText}
          </div>
        )}
      </div>
    </Card>
  )
}
