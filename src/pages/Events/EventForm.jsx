import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { EVENT_STATUSES, EVENT_CATEGORIES, DEFAULT_PROJECT_COLORS } from '../../lib/constants'
import { toDatetimeLocal } from '../../lib/formatters'

const EMPTY_FORM = {
  name: '',
  client: '',
  category: 'otros',
  status: 'draft',
  project_id: '',
  start_datetime: '',
  end_datetime: '',
  color: DEFAULT_PROJECT_COLORS[0],
  notes: '',
}

export function EventForm({ initialData, projects = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialData,
    start_datetime: toDatetimeLocal(initialData?.start_datetime),
    end_datetime: toDatetimeLocal(initialData?.end_datetime),
    project_id: initialData?.project_id ?? '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      project_id: form.project_id || null,
      end_datetime: form.end_datetime || null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del evento *"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Concierto en el Auditorio"
        required
      />
      <Input
        label="Cliente / Contratante"
        name="client"
        value={form.client}
        onChange={handleChange}
        placeholder="Ayuntamiento de Madrid"
      />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Categoría" name="category" value={form.category} onChange={handleChange}>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <Select label="Estado" name="status" value={form.status} onChange={handleChange}>
          {EVENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      <Select label="Proyecto (opcional)" name="project_id" value={form.project_id} onChange={handleChange}>
        <option value="">Sin proyecto</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Inicio *"
          type="datetime-local"
          name="start_datetime"
          value={form.start_datetime}
          onChange={handleChange}
          required
        />
        <Input
          label="Fin"
          type="datetime-local"
          name="end_datetime"
          value={form.end_datetime}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Color en calendario</label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_PROJECT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color }))}
              className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
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
        placeholder="Información adicional..."
      />

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar evento'}
        </Button>
      </div>
    </form>
  )
}
