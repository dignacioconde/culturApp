import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CalendarDays, FilterX, Plus, Search } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { EventForm } from './EventForm'
import { useAuth } from '../../hooks/useAuth'
import { useEvents } from '../../hooks/useEvents'
import { useProjects } from '../../hooks/useProjects'
import { formatDatetime } from '../../lib/formatters'
import { EVENT_STATUSES, EVENT_CATEGORIES } from '../../lib/constants'

export default function EventList() {
  const { user } = useAuth()
  const { events, loading, error, createEvent } = useEvents(user?.id)
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const { toasts, addToast, removeToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterProject, setFilterProject] = useState('')

  const effectiveFilterProject = useMemo(() => {
    const projectParam = searchParams.get('project')
    if (projectParam) {
      return projectParam
    }
    return filterProject
  }, [searchParams, filterProject])

  const hasFilters = Boolean(search || filterStatus || filterCategory || effectiveFilterProject)
  const categoryLabels = useMemo(() => Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.value, c.label])), [])
  const projectById = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects])

  const filtered = events.filter((e) => {
    const query = search.trim().toLowerCase()
    const project = projectById[e.project_id]
    const matchesSearch = !query ||
      e.name.toLowerCase().includes(query) ||
      e.client?.toLowerCase().includes(query) ||
      project?.name.toLowerCase().includes(query)

    if (!matchesSearch) return false
    if (filterStatus && e.status !== filterStatus) return false
    if (filterCategory && e.category !== filterCategory) return false
    if (effectiveFilterProject === '__none__' && e.project_id) return false
    if (effectiveFilterProject && effectiveFilterProject !== '__none__' && e.project_id !== effectiveFilterProject) return false
    return true
  })

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('')
    setFilterCategory('')
    setFilterProject('')
    if (searchParams.get('project')) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('project')
      setSearchParams(newParams)
    }
  }

  const handleCreate = async (formData) => {
    setSaving(true)
    const { error } = await createEvent(formData)
    setSaving(false)
    if (error) { addToast('Error al crear el evento.', 'error'); return }
    addToast('Evento creado correctamente.')
    setIsModalOpen(false)
  }

  return (
    <PageWrapper title="Eventos">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {filtered.length} de {events.length} eventos
              {hasFilters ? ' con los filtros actuales' : ''}
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="w-full justify-center sm:w-auto">
            <Plus size={16} />
            Nuevo evento
          </Button>
        </div>

        <Card className="p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_190px_220px_auto] xl:items-center">
            <div className="relative min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar evento, cliente o proyecto"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {EVENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {EVENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
            <Select
              value={effectiveFilterProject}
              onChange={(e) => {
                setFilterProject(e.target.value)
                if (searchParams.get('project')) {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('project')
                  setSearchParams(newParams)
                }
              }}
            >
              <option value="">Todos los proyectos</option>
              <option value="__none__">Sin proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} className="justify-center whitespace-nowrap">
                <FilterX size={16} />
                Limpiar
              </Button>
            )}
          </div>
        </Card>

        {(error || projectsError) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>No se han podido cargar todos los eventos. Revisa la conexión y vuelve a intentarlo.</p>
          </div>
        )}

        {loading || projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-5">
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
                <div className="mt-5 h-3 w-1/3 rounded bg-gray-100" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
            <CalendarDays size={36} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              {hasFilters ? 'No hay eventos que coincidan' : 'No hay eventos todavía'}
            </p>
            <p className="mt-1 max-w-sm text-sm text-gray-400">
              {hasFilters 
                ? 'Ajusta la búsqueda o limpia los filtros para ver más resultados.' 
                : 'Crea tu primer evento para verlo en la lista y en el calendario compartible.'}
            </p>
            {hasFilters ? (
              <Button variant="secondary" size="sm" onClick={clearFilters} className="mt-4">
                <FilterX size={16} />
                Limpiar filtros
              </Button>
            ) : (
              <Button size="sm" onClick={() => setIsModalOpen(true)} className="mt-4">
                <Plus size={16} />
                Crear evento
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((event) => {
              const project = projectById[event.project_id]
              return (
                <Link key={event.id} to={`/events/${event.id}`} className="block min-w-0">
                  <Card className="p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: event.color ?? '#4f98a3' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-gray-900 truncate">{event.name}</h3>
                          <div className="flex-shrink-0">
                            <StatusBadge status={event.status} />
                          </div>
                        </div>
                        {event.client && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">{event.client}</p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                            {categoryLabels[event.category] ?? event.category}
                          </span>
                          <span className="text-gray-400">{formatDatetime(event.start_datetime)}</span>
                        </div>
                        <p className="mt-3 text-xs font-medium text-indigo-600 truncate">
                          {project ? project.name : 'Sin proyecto'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo evento">
        <EventForm
          projects={projects}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
