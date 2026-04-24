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

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('full_name, profession, tax_rate')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setForm({ full_name: data.full_name ?? '', profession: data.profession ?? '', tax_rate: data.tax_rate ?? 15 })
        setLoading(false)
      })
  }, [user])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, profession: form.profession, tax_rate: Number(form.tax_rate) })
      .eq('id', user.id)
    setSaving(false)
    if (error) { addToast('Error al guardar los ajustes.', 'error'); return }
    addToast('Ajustes guardados correctamente.')
  }

  return (
    <PageWrapper title="Ajustes">
      <div className="max-w-md flex flex-col gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Perfil</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Nombre completo"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Ana García"
              />
              <Input
                label="Profesión"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Músico, Fotógrafo, Actor..."
              />
              <Input
                label="Retención IRPF habitual (%)"
                type="number"
                min="0"
                max="100"
                name="tax_rate"
                value={form.tax_rate}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400">
                Este porcentaje se usará como valor por defecto al registrar nuevos ingresos.
              </p>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Cuenta</h2>
          <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
          <Button variant="secondary" onClick={signOut}>
            Cerrar sesión
          </Button>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
