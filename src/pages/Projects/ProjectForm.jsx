import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { PROJECT_STATUSES, PROJECT_CATEGORIES, DEFAULT_PROJECT_COLORS } from '../../lib/constants'

const EMPTY_FORM = {
  name: '',
  client: '',
  category: 'otros',
  status: 'draft',
  start_date: '',
  end_date: '',
  color: DEFAULT_PROJECT_COLORS[0],
  notes: '',
}

export function ProjectForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialData,
    name: initialData?.name ?? '',
    client: initialData?.client ?? '',
    end_date: initialData?.end_date ?? '',
    notes: initialData?.notes ?? '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Pon un nombre para identificar el proyecto.')
      return
    }
    if (!form.start_date) {
      setError('Indica la fecha de inicio del proyecto.')
      return
    }
    if (form.end_date && form.end_date < form.start_date) {
      setError('La fecha de fin no puede ser anterior a la de inicio.')
      return
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      client: form.client.trim(),
      end_date: form.end_date || null,
      notes: form.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Información básica</h3>
          <p className="text-xs text-gray-500 mt-1">Datos generales del contenedor del trabajo.</p>
        </div>
        <Input
          label="Nombre del proyecto *"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Concierto de primavera"
          required
        />
        <Input
          label="Cliente o contratante"
          name="client"
          value={form.client}
          onChange={handleChange}
          placeholder="Ayuntamiento de Madrid"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Categoría" name="category" value={form.category} onChange={handleChange}>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
          <Select label="Estado" name="status" value={form.status} onChange={handleChange}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Calendario</h3>
          <p className="text-xs text-gray-500 mt-1">Rango visible en el calendario interno de proyectos.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha de inicio *"
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          <Input
            label="Fecha de fin"
            type="date"
            name="end_date"
            value={form.end_date ?? ''}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notas y color</h3>
          <p className="text-xs text-gray-500 mt-1">El color identifica el proyecto y sus rangos en calendario.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Color en calendario</label>
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Usar color ${color}`}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                className={`w-8 h-8 rounded-full transition-transform ${form.color === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-500' : 'hover:scale-105'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Textarea
          label="Notas"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Alcance, condiciones acordadas, producción pendiente..."
        />
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="justify-center">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="justify-center">
          {loading ? 'Guardando...' : 'Guardar proyecto'}
        </Button>
      </div>
    </form>
  )
}
