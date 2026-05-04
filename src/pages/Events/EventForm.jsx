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

const getDefaultEndDatetime = (startDatetime, multiDay = false) => {
  if (!startDatetime) return ''

  const [date, time = '08:00'] = startDatetime.split('T')
  const [hours = 8, minutes = 0] = time.split(':').map(Number)
  const endDate = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
  endDate.setHours(endDate.getHours() + 1)
  if (multiDay) {
    endDate.setDate(endDate.getDate() + 1)
  }

  const localEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
  if (!multiDay && localEndDate !== date) {
    return `${date}T23:59`
  }

  const year = endDate.getFullYear()
  const month = String(endDate.getMonth() + 1).padStart(2, '0')
  const day = String(endDate.getDate()).padStart(2, '0')
  const endHours = String(endDate.getHours()).padStart(2, '0')
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0')
  const endDatePart = multiDay ? `${year}-${month}-${day}` : date

  return `${endDatePart}T${endHours}:${endMinutes}`
}

export function EventForm({ initialData, projects = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialData,
    name: initialData?.name ?? '',
    client: initialData?.client ?? '',
    start_datetime: toDatetimeLocal(initialData?.start_datetime),
    end_datetime: toDatetimeLocal(initialData?.end_datetime),
    project_id: initialData?.project_id ?? '',
    notes: initialData?.notes ?? '',
  })
  const [error, setError] = useState('')
  const [isMultiDay, setIsMultiDay] = useState(() => {
    if (!initialData?.end_datetime) return false
    const startDate = initialData.start_datetime?.split('T')[0]
    const endDate = initialData.end_datetime?.split('T')[0]
    return startDate !== endDate
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const updated = { ...prev, [name]: value }

      if (name === 'start_datetime' && !isMultiDay && value) {
        updated.end_datetime = getDefaultEndDatetime(value)
      }

      return updated
    })
    setError('')
  }

  const handleMultiDayChange = (checked) => {
    setIsMultiDay(checked)
    if (!form.start_datetime) return

    if (!checked) {
      setForm((prev) => ({
        ...prev,
        end_datetime: getDefaultEndDatetime(form.start_datetime),
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        end_datetime: getDefaultEndDatetime(form.start_datetime, true),
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Pon un nombre para identificar el evento.')
      return
    }
    if (!form.start_datetime) {
      setError('Indica la fecha y hora de inicio.')
      return
    }
    if (form.end_datetime && form.end_datetime < form.start_datetime) {
      setError('La fecha de fin no puede ser anterior al inicio.')
      return
    }
    const payload = {
      ...form,
      name: form.name.trim(),
      client: form.client.trim(),
      project_id: form.project_id || null,
      end_datetime: form.end_datetime || null,
      notes: form.notes.trim(),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Información básica</h3>
          <p className="text-sm text-gray-600 mt-1">Nombre, cliente y clasificación para encontrarlo rápido.</p>
        </div>
        <Input
          label="Nombre del evento *"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Concierto en el Auditorio"
          required
        />
        <Input
          label="Cliente o contratante"
          name="client"
          value={form.client}
          onChange={handleChange}
          placeholder="Ayuntamiento de Madrid"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      </section>

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Planificación</h3>
          <p className="text-sm text-gray-600 mt-1">El calendario de eventos usa fecha y hora exactas.</p>
        </div>

        <Select label="Proyecto relacionado" name="project_id" value={form.project_id} onChange={handleChange}>
          <option value="">Sin proyecto</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Inicio *"
            type="datetime-local"
            name="start_datetime"
            value={form.start_datetime}
            onChange={handleChange}
            defaultTime="08:00"
            required
          />
          {isMultiDay && (
            <Input
              label="Fin"
              type="datetime-local"
              name="end_datetime"
              value={form.end_datetime}
              onChange={handleChange}
              defaultTime={form.start_datetime?.slice(11, 16) || '08:00'}
            />
          )}
        </div>
        <label htmlFor="is_multi_day" className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            id="is_multi_day"
            checked={isMultiDay}
            onChange={(e) => handleMultiDayChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
          />
          <span>Evento de varios días</span>
        </label>
      </section>

      <section className="flex flex-col gap-4 border-t border-gray-100 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notas y calendario</h3>
          <p className="text-sm text-gray-600 mt-1">El color ayuda a distinguirlo en las vistas de calendario.</p>
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
                className={`h-10 w-10 rounded-full transition-transform ${form.color === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-500' : 'hover:scale-105'}`}
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
          placeholder="Necesidades técnicas, contacto en sala, condiciones acordadas..."
        />
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="justify-center">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="justify-center">
          {loading ? 'Guardando...' : 'Guardar evento'}
        </Button>
      </div>
    </form>
  )
}
