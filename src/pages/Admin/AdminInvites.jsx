import { useState } from 'react'
import { CalendarX, Check, Copy, RotateCw, ShieldCheck, Ticket, XCircle } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ToastContainer, useToast } from '../../components/ui/Toast'
import { useBetaInvites } from '../../hooks/useBetaInvites'
import { formatDatetime } from '../../lib/formatters'

function endOfDayIso(dateValue) {
  if (!dateValue) return null
  return new Date(`${dateValue}T23:59:59`).toISOString()
}

function getInviteState(invite) {
  if (invite.revoked_at) return { label: 'Revocada', className: 'bg-red-50 text-red-700', icon: XCircle }
  if (invite.expires_at && new Date(invite.expires_at) <= new Date()) return { label: 'Caducada', className: 'bg-amber-50 text-amber-700', icon: CalendarX }
  if (invite.redeemed_count >= invite.max_redemptions) return { label: 'Consumida', className: 'bg-gray-100 text-gray-600', icon: Check }
  return { label: 'Activa', className: 'bg-green-50 text-green-700', icon: ShieldCheck }
}

function InviteStatus({ invite }) {
  const state = getInviteState(invite)
  const Icon = state.icon
  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ${state.className}`}>
      <Icon size={14} />
      {state.label}
    </span>
  )
}

export default function AdminInvites() {
  const { invites, loading, error, refetch, createInvite, revokeInvite } = useBetaInvites()
  const { toasts, addToast, removeToast } = useToast()
  const [form, setForm] = useState({ label: '', maxRedemptions: '1', expiresAt: '' })
  const [saving, setSaving] = useState(false)
  const [revokingId, setRevokingId] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
    setFormError('')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreatedCode('')
    const maxRedemptions = Number(form.maxRedemptions)
    if (!Number.isInteger(maxRedemptions) || maxRedemptions < 1 || maxRedemptions > 100) {
      setFormError('Los usos máximos deben estar entre 1 y 100.')
      return
    }

    setSaving(true)
    const { data, error, message } = await createInvite({
      label: form.label,
      maxRedemptions,
      expiresAt: endOfDayIso(form.expiresAt),
    })
    setSaving(false)

    if (error) {
      setFormError(message)
      return
    }

    setCreatedCode(data.code)
    setForm({ label: '', maxRedemptions: '1', expiresAt: '' })
    addToast('Invitación creada.')
  }

  const handleCopy = async () => {
    if (!createdCode) return
    try {
      await navigator.clipboard.writeText(createdCode)
      addToast('Código copiado.')
    } catch {
      addToast('No hemos podido copiar el código.', 'error')
    }
  }

  const handleRevoke = async (invite) => {
    setRevokingId(invite.id)
    const { error, message } = await revokeInvite(invite.id)
    setRevokingId('')
    if (error) {
      addToast(message, 'error')
      return
    }
    addToast('Invitación revocada.')
  }

  return (
    <PageWrapper title="Invitaciones beta">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="p-5">
          <div className="mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-red-light)] text-[var(--color-red)]">
              <Ticket size={20} />
            </div>
            <h2 className="mt-3 text-base font-semibold text-[var(--color-ink)]">Crear código</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              El código se muestra una sola vez. Después solo queda guardado el hash.
            </p>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input
              label="Etiqueta"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Beta 9 - fotógrafas"
            />
            <Input
              label="Usos máximos"
              type="number"
              min="1"
              max="100"
              name="maxRedemptions"
              value={form.maxRedemptions}
              onChange={handleChange}
              required
            />
            <Input
              label="Caduca el"
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
            />
            {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
            <Button type="submit" disabled={saving} className="justify-center">
              {saving ? 'Creando...' : 'Crear invitación'}
            </Button>
          </form>

          {createdCode && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-green-700">Código creado</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[var(--color-ink)]">
                  {createdCode}
                </code>
                <Button type="button" variant="secondary" onClick={handleCopy} className="justify-center">
                  <Copy size={16} />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--color-paper-mid)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-ink)]">Códigos generados</h2>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">No se muestran códigos planos ni hashes.</p>
            </div>
            <Button type="button" variant="secondary" onClick={refetch} disabled={loading} className="justify-center">
              <RotateCw size={16} />
              Actualizar
            </Button>
          </div>

          {error && <p className="m-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          {loading ? (
            <p className="p-5 text-sm text-[var(--color-ink-muted)]">Cargando invitaciones...</p>
          ) : invites.length === 0 ? (
            <p className="p-5 text-sm text-[var(--color-ink-muted)]">Todavía no hay invitaciones creadas.</p>
          ) : (
            <div className="divide-y divide-[var(--color-paper-mid)]">
              {invites.map((invite) => {
                const canRevoke = !invite.revoked_at && invite.redeemed_count < invite.max_redemptions
                return (
                  <article key={invite.id} className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-[var(--color-ink)]">
                          {invite.label || 'Sin etiqueta'}
                        </h3>
                        <InviteStatus invite={invite} />
                      </div>
                      <dl className="mt-3 grid gap-3 text-sm text-[var(--color-ink-muted)] sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide">Usos</dt>
                          <dd className="mt-1 text-[var(--color-ink)]">{invite.redeemed_count}/{invite.max_redemptions}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide">Caducidad</dt>
                          <dd className="mt-1 text-[var(--color-ink)]">{formatDatetime(invite.expires_at)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide">Último uso</dt>
                          <dd className="mt-1 text-[var(--color-ink)]">{formatDatetime(invite.last_redeemed_at)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide">Creada</dt>
                          <dd className="mt-1 text-[var(--color-ink)]">{formatDatetime(invite.created_at)}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex items-start justify-end">
                      <Button
                        type="button"
                        variant="danger"
                        disabled={!canRevoke || revokingId === invite.id}
                        onClick={() => handleRevoke(invite)}
                        className="w-full justify-center sm:w-auto"
                      >
                        {revokingId === invite.id ? 'Revocando...' : 'Revocar'}
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
