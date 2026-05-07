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
      usage_consent_version: usageConsent ? 'beta-8' : profile?.usage_consent_version,
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
            <h2 className="text-sm font-semibold text-gray-900">Perfil profesional</h2>
            <p className="text-sm text-gray-500 mt-1">Estos datos se usan para personalizar tu cuenta y tus ingresos por defecto.</p>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : profileError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">No hemos podido cargar tu perfil.</p>
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
              <p className="text-xs text-gray-400">
                Este porcentaje se usará como valor por defecto al registrar nuevos ingresos.
              </p>
              <label className="flex items-start gap-3 rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4 text-sm text-[var(--color-ink)]">
                <input
                  type="checkbox"
                  name="usage_consent"
                  defaultChecked={Boolean(profile?.usage_consent)}
                  onChange={() => setError('')}
                  className="mt-1 h-5 w-5 rounded border-[var(--color-paper-mid)] accent-[var(--color-red)]"
                />
                <span>
                  <span className="block font-medium">Ayudar a mejorar la beta</span>
                  <span className="mt-1 block text-[var(--color-ink-muted)]">
                    Guardamos tu preferencia de consentimiento en el perfil. En beta 8 no se activa analítica real ni se envían eventos de uso.
                  </span>
                </span>
              </label>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
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
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Cuenta</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/data"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium leading-none text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-paper-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2"
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
                <h2 className="text-sm font-semibold text-gray-900 mb-1">Administración beta</h2>
                <p className="text-sm text-gray-500">Crea y revoca códigos de invitación para nuevas altas.</p>
              </div>
              <Link
                to="/admin/invitaciones"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium leading-none text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-paper-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2"
              >
                Gestionar invitaciones
              </Link>
            </div>
          </Card>
        )}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Primeros pasos</h2>
              <p className="text-sm text-gray-500">Puedes volver a revisar el resumen inicial de proyectos, eventos y cobros.</p>
            </div>
            <Link
              to="/onboarding"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium leading-none text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-paper-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2"
            >
              Ver onboarding
            </Link>
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
