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
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del proyecto *"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Concierto de primavera"
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
      <div className="grid grid-cols-2 gap-3">
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
          value={form.end_date}
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
        placeholder="Información adicional sobre el proyecto..."
      />

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar proyecto'}
        </Button>
      </div>
    </form>
  )
}
