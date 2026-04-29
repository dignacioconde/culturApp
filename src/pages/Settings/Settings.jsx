import { useState, useEffect } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../supabaseClient'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const [form, setForm] = useState({ full_name: '', profession: '', tax_rate: 15 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('full_name, profession, tax_rate')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError('No hemos podido cargar tu perfil.')
          setLoading(false)
          return
        }
        if (data) setForm({ full_name: data.full_name ?? '', profession: data.profession ?? '', tax_rate: data.tax_rate ?? 15 })
        setLoading(false)
      })
  }, [user])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Number(form.tax_rate) < 0 || Number(form.tax_rate) > 100) {
      setError('La retención IRPF debe estar entre 0 y 100.')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim(),
        profession: form.profession.trim(),
        tax_rate: Number(form.tax_rate),
      })
      .eq('id', user.id)
    setSaving(false)
    if (error) { addToast('Error al guardar los ajustes.', 'error'); return }
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
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Ana García"
                  autoComplete="name"
                />
                <Input
                  label="Profesión"
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  placeholder="Música, fotógrafa, actriz..."
                  autoComplete="organization-title"
                />
              </div>
              <div className="max-w-xs">
                <Input
                  label="Retención IRPF habitual (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  name="tax_rate"
                  value={form.tax_rate}
                  onChange={handleChange}
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
