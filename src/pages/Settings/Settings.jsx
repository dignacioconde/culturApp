import { useState } from 'react'
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
    const { error: updateError } = await updateProfile({
      full_name: formData.get('full_name').trim(),
      profession: formData.get('profession').trim(),
      tax_rate: taxRate,
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
            <Button variant="secondary" onClick={signOut} className="justify-center">
              Cerrar sesión
            </Button>
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
