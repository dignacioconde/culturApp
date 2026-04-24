import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, CalendarDays } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { EventForm } from './EventForm'
import { useAuth } from '../../hooks/useAuth'
import { useEvents } from '../../hooks/useEvents'
import { useProjects } from '../../hooks/useProjects'
import { formatDatetime } from '../../lib/formatters'
import { EVENT_STATUSES, EVENT_CATEGORIES } from '../../lib/constants'

export default function EventList() {
  const { user } = useAuth()
  const { events, loading, createEvent } = useEvents(user?.id)
  const { projects } = useProjects(user?.id)
  const { toasts, addToast, removeToast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterProject, setFilterProject] = useState('')

  const filtered = events.filter((e) => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.client?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && e.status !== filterStatus) return false
    if (filterCategory && e.category !== filterCategory) return false
    if (filterProject && e.project_id !== filterProject) return false
    return true
  })

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar eventos..."
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 w-52"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Todos los estados</option>
              {EVENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Todas las categorías</option>
              {EVENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Todos los proyectos</option>
              <option value="__none__">Sin proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Nuevo evento
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Cargando eventos...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <CalendarDays size={36} />
            <p className="text-sm">No hay eventos. Crea el primero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((event) => {
              const project = projects.find((p) => p.id === event.project_id)
              return (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: event.color ?? '#4f98a3' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{event.name}</h3>
                          <StatusBadge status={event.status} />
                        </div>
                        {event.client && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate">{event.client}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{formatDatetime(event.start_datetime)}</p>
                        {project && (
                          <p className="text-xs text-indigo-500 mt-0.5 truncate">{project.name}</p>
                        )}
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
