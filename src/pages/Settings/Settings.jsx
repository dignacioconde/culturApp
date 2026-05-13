import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { parseDecimal } from '../../lib/formatters'
import { USAGE_CONSENT_DESCRIPTION, USAGE_CONSENT_VERSION } from '../../lib/constants'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const { profile, loading, error: profileError, updateProfile } = useProfile(user?.id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const taxRate = parseDecimal(formData.get('tax_rate'))
    if (taxRate === null || taxRate < 0 || taxRate > 100) {
      setError('La retención IRPF debe estar entre 0 y 100.')
      return
    }
    setSaving(true)
    const usageConsent = formData.get('usage_consent') === 'on'
    const usageConsentChanged = usageConsent !== Boolean(profile?.usage_consent)
    const consentTimestamp = usageConsentChanged
      ? (usageConsent ? new Date().toISOString() : null)
      : (profile?.usage_consent_at ?? null)
    const { error: updateError } = await updateProfile({
      full_name: formData.get('full_name').trim(),
      profession: formData.get('profession').trim(),
      tax_rate: taxRate,
      usage_consent: usageConsent,
      usage_consent_at: consentTimestamp,
      usage_consent_version: usageConsent ? USAGE_CONSENT_VERSION : null,
    })
    setSaving(false)
    if (updateError) { addToast('Error al guardar los ajustes.', 'error'); return }
    addToast('Ajustes guardados correctamente.')
  }

  return (
    <PageWrapper title="Ajustes">
      <div className="max-w-3xl flex flex-col gap-6">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="font-display text-lg font-semibold leading-tight text-text-primary">Perfil profesional</h2>
            <p className="mt-1 text-sm text-text-secondary">Estos datos se usan para personalizar tu cuenta y tus ingresos por defecto.</p>
          </div>
          {loading ? (
            <p className="text-sm text-text-secondary">Cargando...</p>
          ) : profileError ? (
            <p className="rounded-2xl bg-danger-soft px-3 py-2 text-sm text-danger">No hemos podido cargar tu perfil.</p>
          ) : (
            <form key={profile?.id ?? user?.id} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  name="full_name"
                  defaultValue={profile?.full_name ?? ''}
                  onChange={() => setError('')}
                  placeholder="Ana García"
                  autoComplete="name"
                />
                <Input
                  label="Profesión"
                  name="profession"
                  defaultValue={profile?.profession ?? ''}
                  onChange={() => setError('')}
                  placeholder="Música, fotógrafa, actriz..."
                  autoComplete="organization-title"
                />
              </div>
              <div className="max-w-xs">
                <Input
                  label="Retención IRPF habitual (%)"
                  type="text"
                  inputMode="decimal"
                  name="tax_rate"
                  defaultValue={profile?.tax_rate ?? 15}
                  onChange={() => setError('')}
                />
              </div>
              <p className="text-xs text-text-secondary">
                Este porcentaje se usará como valor por defecto al registrar nuevos ingresos.
              </p>
              <label className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-4 text-sm text-text-primary">
                <input
                  type="checkbox"
                  name="usage_consent"
                  aria-label="Ayudar a mejorar la beta"
                  defaultChecked={Boolean(profile?.usage_consent)}
                  onChange={() => setError('')}
                  className="mt-1 h-5 w-5 rounded border-border-subtle accent-[var(--accent-primary)]"
                />
                <span>
                  <span className="block font-medium">Ayudar a mejorar la beta</span>
                  <span className="mt-1 block text-text-secondary">
                    {USAGE_CONSENT_DESCRIPTION}
                  </span>
                </span>
              </label>
              {error && <p className="rounded-2xl bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="justify-center">
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold leading-tight text-text-primary">Cuenta</h2>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/data"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-sm font-medium leading-none text-text-primary shadow-sm transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
              >
                Tus datos
              </Link>
              <Button variant="secondary" onClick={signOut} className="justify-center">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </Card>
        {profile?.role === 'admin' && (
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-1 font-display text-lg font-semibold leading-tight text-text-primary">Administración beta</h2>
                <p className="text-sm text-text-secondary">Crea y revoca códigos de invitación para nuevas altas.</p>
              </div>
              <Link
                to="/admin/invitaciones"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-sm font-medium leading-none text-text-primary shadow-sm transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
              >
                Gestionar invitaciones
              </Link>
            </div>
          </Card>
        )}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold leading-tight text-text-primary">Primeros pasos</h2>
              <p className="text-sm text-text-secondary">Puedes volver a revisar el tutorial de proyectos, eventos, cobros y app móvil.</p>
            </div>
            <Link
              to="/onboarding"
              state={{ from: '/settings' }}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-sm font-medium leading-none text-text-primary shadow-sm transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              Ver tutorial
            </Link>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold leading-tight text-text-primary">Novedades de la beta</h2>
              <p className="text-sm text-text-secondary">Consulta las mejoras recientes en formato corto y sin notas técnicas.</p>
            </div>
            <Link
              to="/novedades"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-sm font-medium leading-none text-text-primary shadow-sm transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              Ver novedades
            </Link>
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
