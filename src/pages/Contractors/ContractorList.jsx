import { useMemo, useState } from 'react'
import { AlertCircle, Building2, Edit, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Input, Textarea } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { ToastContainer, useToast } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import { isContractorsSchemaMissing, useContractors } from '../../hooks/useContractors'

const EMPTY_CONTRACTOR = {
  name: '',
  billing_name: '',
  tax_id: '',
  email: '',
  phone: '',
  billing_address: '',
  notes: '',
}

function toForm(contractor) {
  return {
    ...EMPTY_CONTRACTOR,
    ...contractor,
    name: contractor?.name ?? '',
    billing_name: contractor?.billing_name ?? '',
    tax_id: contractor?.tax_id ?? '',
    email: contractor?.email ?? '',
    phone: contractor?.phone ?? '',
    billing_address: contractor?.billing_address ?? '',
    notes: contractor?.notes ?? '',
  }
}

function ContractorForm({ initialData, loading, onCancel, onSubmit }) {
  const [form, setForm] = useState(() => toForm(initialData))
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Pon un nombre para identificar el contratante.')
      return
    }

    await onSubmit({
      name: form.name.trim(),
      billing_name: form.billing_name.trim() || null,
      tax_id: form.tax_id.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      billing_address: form.billing_address.trim() || null,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <section className="grid gap-3">
        <Input
          label="Nombre del contratante *"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ayuntamiento de Madrid"
          required
        />
        <Input
          label="Nombre fiscal"
          name="billing_name"
          value={form.billing_name}
          onChange={handleChange}
          placeholder="Razón social si es distinta"
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="NIF/CIF"
          name="tax_id"
          value={form.tax_id}
          onChange={handleChange}
          placeholder="B12345678"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="contratacion@ejemplo.es"
        />
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+34 600 000 000"
        />
        <Input
          label="Dirección fiscal"
          name="billing_address"
          value={form.billing_address}
          onChange={handleChange}
          placeholder="Calle, ciudad, provincia"
        />
      </section>

      <Textarea
        label="Notas"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Condiciones habituales, contacto interno, observaciones..."
      />

      {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{error}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="justify-center">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="justify-center">
          {loading ? 'Guardando...' : 'Guardar contratante'}
        </Button>
      </div>
    </form>
  )
}

function ContractorCard({ contractor, onEdit, onDelete }) {
  return (
    <Card className="card-lift flex h-full min-w-0 flex-col overflow-hidden border-border-subtle bg-surface-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-page-dark text-text-secondary">
          <Building2 size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold leading-tight text-text-primary">{contractor.name}</h3>
          {contractor.billing_name && contractor.billing_name !== contractor.name && (
            <p className="mt-0.5 truncate text-sm text-text-secondary">{contractor.billing_name}</p>
          )}
          {contractor.tax_id && (
            <Badge className="mt-2 bg-surface-muted text-text-secondary">{contractor.tax_id}</Badge>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-text-secondary">
        {contractor.email && (
          <p className="flex min-w-0 items-center gap-2">
            <Mail size={14} className="shrink-0" />
            <span className="truncate">{contractor.email}</span>
          </p>
        )}
        {contractor.phone && (
          <p className="flex min-w-0 items-center gap-2">
            <Phone size={14} className="shrink-0" />
            <span className="truncate">{contractor.phone}</span>
          </p>
        )}
        {contractor.billing_address && (
          <p className="line-clamp-2 text-xs leading-5">{contractor.billing_address}</p>
        )}
        {contractor.notes && (
          <p className="line-clamp-2 rounded-lg border border-border-subtle bg-surface-muted px-3 py-2 text-xs leading-5 text-text-primary">{contractor.notes}</p>
        )}
      </div>

      <div className="mt-auto flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(contractor)}>
          <Edit size={14} />
          Editar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(contractor)}
          className="text-danger hover:bg-danger-soft"
          aria-label={`Eliminar contratante ${contractor.name}`}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  )
}

export default function ContractorList() {
  const { user } = useAuth()
  const { contractors, loading, error, createContractor, updateContractor, deleteContractor } = useContractors(user?.id)
  const schemaMissing = isContractorsSchemaMissing(error)
  const { toasts, addToast, removeToast } = useToast()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContractor, setEditingContractor] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filteredContractors = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return contractors

    return contractors.filter((contractor) => [
      contractor.name,
      contractor.billing_name,
      contractor.tax_id,
      contractor.email,
      contractor.phone,
      contractor.billing_address,
      contractor.notes,
    ].some((value) => String(value ?? '').toLowerCase().includes(query)))
  }, [contractors, search])

  const openCreate = () => {
    setEditingContractor(null)
    setModalOpen(true)
  }

  const openEdit = (contractor) => {
    setEditingContractor(contractor)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingContractor(null)
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    const result = editingContractor
      ? await updateContractor(editingContractor.id, payload)
      : await createContractor(payload)
    setSaving(false)

    if (result.error) {
      const duplicate = result.error.code === '23505'
      addToast(duplicate ? 'Ya existe un contratante con ese nombre.' : 'No se ha podido guardar el contratante.', 'error')
      return
    }

    addToast(editingContractor ? 'Contratante actualizado.' : 'Contratante creado.')
    closeModal()
  }

  const requestDelete = (contractor) => {
    setDeleteConfirm({
      title: 'Eliminar contratante',
      description: `Se eliminará "${contractor.name}". Los proyectos y eventos que lo usen no se borran, pero dejarán de tener este contratante asociado.`,
      confirmLabel: 'Eliminar contratante',
      onConfirm: async () => {
        const { error: deleteError } = await deleteContractor(contractor.id)
        if (deleteError) {
          addToast('No se ha podido eliminar el contratante.', 'error')
          return
        }
        addToast('Contratante eliminado.')
        setDeleteConfirm(null)
      },
    })
  }

  return (
    <PageWrapper title="Contratantes">
      <div className="flex max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.04em] text-accent-primary">Directorio operativo</p>
            <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-text-primary">Contratantes</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {filteredContractors.length} de {contractors.length} contratantes
              {search ? ' con la búsqueda actual' : ''}
            </p>
          </div>
          <Button onClick={openCreate} className="w-full justify-center sm:w-auto">
            <Plus size={16} />
            Nuevo contratante
          </Button>
        </div>

        <Card className="border-border-subtle bg-surface-card p-3 sm:p-4">
          <div className="relative min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, fiscal, email o teléfono"
              className="min-h-11 w-full rounded-lg border border-border-subtle bg-surface-card py-2 pl-9 pr-3 text-base text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 sm:text-sm"
            />
          </div>
        </Card>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-danger-soft bg-danger-soft/70 px-4 py-3 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {schemaMissing ? 'Falta aplicar la migración de contratantes.' : 'No se han podido cargar los contratantes.'}
              </p>
              {schemaMissing && (
                <p className="mt-1">
                  Aplica `supabase/migrations/20260513120000_contractors.sql` en la base de datos que usa esta sesión local y recarga la app.
                </p>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-border-subtle bg-surface-card p-5">
                <div className="h-4 w-2/3 rounded bg-surface-page-dark" />
                <div className="mt-3 h-3 w-1/2 rounded bg-surface-page-dark" />
                <div className="mt-5 h-3 w-1/3 rounded bg-surface-page-dark" />
              </Card>
            ))}
          </div>
        ) : filteredContractors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface-muted px-4 py-14 text-center">
            <Building2 size={36} className="text-text-secondary" />
            <p className="mt-3 font-display text-lg font-semibold leading-tight text-text-primary">
              {search ? 'No hay contratantes que coincidan' : 'No hay contratantes todavía'}
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              {search
                ? 'Ajusta la búsqueda para encontrar otro resultado.'
                : 'Crea contratantes para reutilizarlos en proyectos y eventos sin repetir el cliente en cada trabajo.'}
            </p>
            {!search && (
              <Button size="sm" onClick={openCreate} className="mt-4">
                <Plus size={16} />
                Crear contratante
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredContractors.map((contractor) => (
              <ContractorCard
                key={contractor.id}
                contractor={contractor}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingContractor ? 'Editar contratante' : 'Nuevo contratante'}>
        <ContractorForm
          key={editingContractor?.id ?? 'new-contractor'}
          initialData={editingContractor}
          loading={saving}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        title={deleteConfirm?.title}
        description={deleteConfirm?.description}
        confirmLabel={deleteConfirm?.confirmLabel}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={deleteConfirm?.onConfirm}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
