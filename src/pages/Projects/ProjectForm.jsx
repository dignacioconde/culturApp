import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { ContractorSelector, NEW_CONTRACTOR_VALUE } from '../../components/contractors/ContractorSelector'
import { PROJECT_STATUSES, PROJECT_CATEGORIES, DEFAULT_PROJECT_COLORS } from '../../lib/constants'

const EMPTY_FORM = {
  name: '',
  client: '',
  contractor_id: '',
  new_contractor_name: '',
  category: 'otros',
  status: 'draft',
  start_date: '',
  end_date: '',
  color: DEFAULT_PROJECT_COLORS[0],
  notes: '',
}

export function ProjectForm({ initialData, contractors = [], onCreateContractor, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialData,
    name: initialData?.name ?? '',
    client: initialData?.client ?? '',
    contractor_id: initialData?.contractor_id ?? '',
    new_contractor_name: '',
    end_date: initialData?.end_date ?? '',
    notes: initialData?.notes ?? '',
  })
  const [error, setError] = useState('')
  const [submittingContractor, setSubmittingContractor] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
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

    let contractorId = form.contractor_id || null
    if (form.contractor_id === NEW_CONTRACTOR_VALUE) {
      if (!form.new_contractor_name.trim()) {
        setError('Pon un nombre para el contratante.')
        return
      }
      if (!onCreateContractor) {
        setError('No se ha podido crear el contratante.')
        return
      }
      setSubmittingContractor(true)
      const { data, error } = await onCreateContractor(form.new_contractor_name)
      setSubmittingContractor(false)
      if (error || !data?.id) {
        setError('No se ha podido crear el contratante.')
        return
      }
      contractorId = data.id
    }

    const payload = { ...form }
    delete payload.new_contractor_name
    await onSubmit({
      ...payload,
      name: form.name.trim(),
      client: form.client.trim() || null,
      contractor_id: contractorId,
      end_date: form.end_date || null,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <section className="flex flex-col gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-text-primary">Información básica</h3>
          <p className="hidden sm:block text-sm text-text-secondary mt-1">Datos generales del contenedor del trabajo.</p>
        </div>
        <Input
          label="Nombre del proyecto *"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Concierto de primavera"
          required
        />
        <ContractorSelector
          contractors={contractors}
          value={form.contractor_id}
          newName={form.new_contractor_name}
          clientValue={form.client}
          onChange={handleChange}
          onNewNameChange={handleChange}
          onClientChange={handleChange}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <section className="flex flex-col gap-3 border-t border-border-subtle pt-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-text-primary">Calendario</h3>
          <p className="hidden sm:block text-sm text-text-secondary mt-1">Rango visible en el calendario interno de proyectos.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <section className="flex flex-col gap-3 border-t border-border-subtle pt-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-text-primary">Notas y color</h3>
          <p className="hidden sm:block text-sm text-text-secondary mt-1">El color identifica el proyecto y sus rangos en calendario.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Color en calendario</label>
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Usar color ${color}`}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                className={`h-10 w-10 rounded-full transition-transform ${form.color === color ? 'scale-110 ring-2 ring-offset-2 ring-text-secondary' : 'hover:scale-105'}`}
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

      {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="justify-center">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || submittingContractor} className="justify-center">
          {loading || submittingContractor ? 'Guardando...' : 'Guardar proyecto'}
        </Button>
      </div>
    </form>
  )
}
