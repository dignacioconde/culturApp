import { useState } from 'react'
import { AlertCircle, CalendarX, Check, Copy, Inbox, LoaderCircle, Mail, RotateCw, ShieldCheck, Ticket, XCircle } from 'lucide-react'
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
  if (invite.revoked_at) return { label: 'Revocada', className: 'bg-danger-soft text-danger', icon: XCircle }
  if (invite.expires_at && new Date(invite.expires_at) <= new Date()) return { label: 'Caducada', className: 'bg-warning-soft text-warning', icon: CalendarX }
  if (invite.redeemed_count >= invite.max_redemptions) return { label: 'Consumida', className: 'bg-surface-muted text-text-secondary', icon: Check }
  return { label: 'Activa', className: 'bg-success-soft text-success', icon: ShieldCheck }
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

function AdminNotice({ tone = 'danger', children }) {
  const styles = {
    danger: 'border-danger-soft bg-danger-soft text-danger',
    success: 'border-success-soft bg-success-soft text-success',
    warning: 'border-warning-soft bg-warning-soft text-warning',
  }

  return (
    <div className={`flex items-start gap-2 rounded-2xl border px-3 py-2 text-sm ${styles[tone] ?? styles.danger}`}>
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}

function InviteListState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-semibold text-text-primary">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm leading-6 text-text-secondary">{description}</p>}
    </div>
  )
}

export default function AdminInvites() {
  const { invites, loading, error, refetch, createInvite, createAndSendInvite, revokeInvite } = useBetaInvites()
  const { toasts, addToast, removeToast } = useToast()
  const [form, setForm] = useState({
    recipientEmail: '',
    recipientName: '',
    label: '',
    maxRedemptions: '1',
    expiresAt: '',
  })
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [revokingId, setRevokingId] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [createdCodeMode, setCreatedCodeMode] = useState('')
  const [formError, setFormError] = useState('')
  const [lastSentEmail, setLastSentEmail] = useState('')

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
    setFormError('')
    setLastSentEmail('')
  }

  const resetForm = () => {
    setForm({ recipientEmail: '', recipientName: '', label: '', maxRedemptions: '1', expiresAt: '' })
  }

  const validateInviteFields = ({ requireEmail = false } = {}) => {
    const maxRedemptions = Number(form.maxRedemptions)
    if (requireEmail && !form.recipientEmail.trim()) {
      setFormError('Introduce el email de la persona invitada.')
      return null
    }
    if (!Number.isInteger(maxRedemptions) || maxRedemptions < 1 || maxRedemptions > 100) {
      setFormError('Los usos máximos deben estar entre 1 y 100.')
      return null
    }
    return maxRedemptions
  }

  const handleCreateOnly = async () => {
    setCreatedCode('')
    setCreatedCodeMode('')
    setLastSentEmail('')
    setFormError('')
    const maxRedemptions = validateInviteFields()
    if (!maxRedemptions) return

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
    setCreatedCodeMode('created')
    resetForm()
    addToast('Invitación creada.')
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setCreatedCode('')
    setCreatedCodeMode('')
    setLastSentEmail('')
    setFormError('')
    const maxRedemptions = validateInviteFields({ requireEmail: true })
    if (!maxRedemptions) return

    setSending(true)
    const { data, error, message, partial } = await createAndSendInvite({
      recipientEmail: form.recipientEmail,
      recipientName: form.recipientName,
      label: form.label,
      maxRedemptions,
      expiresAt: endOfDayIso(form.expiresAt),
    })
    setSending(false)

    if (partial && data?.invite?.code) {
      setCreatedCode(data.invite.code)
      setCreatedCodeMode('partial')
      setFormError(message)
      addToast('Invitación creada, pero no enviada.', 'error')
      return
    }

    if (error) {
      setFormError(message)
      return
    }

    setLastSentEmail(form.recipientEmail.trim())
    resetForm()
    addToast('Invitación enviada.')
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
        <Card className="overflow-hidden">
          <div className="border-b border-border-subtle bg-surface-muted px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-primary">
                <Ticket size={20} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-text-primary">Crear invitación</h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Puedes enviarla por email o crear solo el código. El código plano se muestra una sola vez.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <Input
                label="Email del destinatario"
                type="email"
                name="recipientEmail"
                value={form.recipientEmail}
                onChange={handleChange}
                placeholder="persona@example.com"
                autoComplete="email"
              />
              <Input
                label="Nombre"
                name="recipientName"
                value={form.recipientName}
                onChange={handleChange}
                placeholder="Ana"
              />
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
              {formError && <AdminNotice>{formError}</AdminNotice>}
              {lastSentEmail && (
                <AdminNotice tone="success">
                  Invitación enviada a {lastSentEmail}.
                </AdminNotice>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" disabled={sending || saving} className="justify-center">
                  {sending ? <LoaderCircle size={16} className="motion-safe:animate-spin" /> : <Mail size={16} />}
                  {sending ? 'Enviando...' : 'Crear y enviar'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={saving || sending}
                  onClick={handleCreateOnly}
                  className="justify-center"
                >
                  {saving && <LoaderCircle size={16} className="motion-safe:animate-spin" />}
                  {saving ? 'Creando...' : 'Crear solo código'}
                </Button>
              </div>
            </form>

            {createdCode && (
              <div className={`mt-5 rounded-2xl border p-4 ${
                createdCodeMode === 'partial'
                  ? 'border-warning-soft bg-warning-soft'
                  : 'border-success-soft bg-success-soft'
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  createdCodeMode === 'partial' ? 'text-warning' : 'text-success'
                }`}>
                  {createdCodeMode === 'partial' ? 'Envío pendiente' : 'Código creado'}
                </p>
                {createdCodeMode === 'partial' && (
                  <p className="mt-2 text-sm leading-6 text-warning">
                    Copia el código y envíalo manualmente. Si no vas a usarlo, puedes revocarlo desde la lista.
                  </p>
                )}
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <code className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-border-subtle bg-surface-card px-3 py-2 font-mono text-sm font-semibold text-text-primary">
                    {createdCode}
                  </code>
                  <Button type="button" variant="secondary" onClick={handleCopy} className="justify-center">
                    <Copy size={16} />
                    Copiar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border-subtle bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Códigos generados</h2>
              <p className="mt-1 text-sm text-text-secondary">No se muestran códigos planos ni hashes.</p>
            </div>
            <Button type="button" variant="secondary" onClick={refetch} disabled={loading} className="justify-center">
              <RotateCw size={16} className={loading ? 'motion-safe:animate-spin' : ''} />
              Actualizar
            </Button>
          </div>

          {error && <div className="m-5"><AdminNotice>{error}</AdminNotice></div>}

          {loading ? (
            <InviteListState icon={LoaderCircle} title="Cargando invitaciones..." />
          ) : invites.length === 0 ? (
            <InviteListState
              icon={Inbox}
              title="Todavía no hay invitaciones creadas."
              description="Cuando crees códigos para la beta, aparecerán aquí con su estado y uso."
            />
          ) : (
            <div className="divide-y divide-border-subtle">
              {invites.map((invite) => {
                const canRevoke = !invite.revoked_at && invite.redeemed_count < invite.max_redemptions
                return (
                  <article key={invite.id} className="grid gap-4 p-5 transition-colors hover:bg-surface-muted/70 xl:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-text-primary">
                          {invite.label || 'Sin etiqueta'}
                        </h3>
                        <InviteStatus invite={invite} />
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl bg-surface-muted px-3 py-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide">Usos</dt>
                          <dd className="mt-1 font-medium text-text-primary">{invite.redeemed_count}/{invite.max_redemptions}</dd>
                        </div>
                        <div className="rounded-xl bg-surface-muted px-3 py-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide">Caducidad</dt>
                          <dd className="mt-1 font-medium text-text-primary">{formatDatetime(invite.expires_at)}</dd>
                        </div>
                        <div className="rounded-xl bg-surface-muted px-3 py-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide">Último uso</dt>
                          <dd className="mt-1 font-medium text-text-primary">{formatDatetime(invite.last_redeemed_at)}</dd>
                        </div>
                        <div className="rounded-xl bg-surface-muted px-3 py-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide">Creada</dt>
                          <dd className="mt-1 font-medium text-text-primary">{formatDatetime(invite.created_at)}</dd>
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
                        {revokingId === invite.id && <LoaderCircle size={16} className="motion-safe:animate-spin" />}
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
