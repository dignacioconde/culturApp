import { useState, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { ProjectForm } from '../Projects/ProjectForm'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { formatDate } from '../../lib/formatters'
import { AlertCircle, FolderOpen, Plus, X } from 'lucide-react'

const localizer = dayjsLocalizer(dayjs)

const messages = {
  allDay: 'Todo el día',
  previous: '‹',
  next: '›',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Proyecto',
  noEventsInRange: 'No hay proyectos en este período.',
  showMore: (total) => `+${total} más`,
}

export default function CalendarProjects() {
  const { user } = useAuth()
  const { projects, loading, error, createProject } = useProjects(user?.id)
  const [selectedProject, setSelectedProject] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const calendarEvents = useMemo(() =>
    projects.map((p) => ({
      id: p.id,
      title: p.name,
      start: new Date(p.start_date + 'T00:00:00'),
      end: new Date((p.end_date ?? p.start_date) + 'T23:59:59'),
      resource: p,
    }))
  , [projects])

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.resource.color ?? '#4f98a3',
      borderRadius: '6px',
      border: 'none',
      color: '#fff',
      fontSize: '12px',
      padding: '2px 6px',
    },
  })

  const handleCreate = async (formData) => {
    setSaving(true)
    const { error } = await createProject(formData)
    setSaving(false)
    if (error) { addToast('Error al crear el proyecto.', 'error'); return }
    addToast('Proyecto creado.')
    setNewModal(false)
  }

  return (
    <PageWrapper title="Calendario de proyectos">
      <div className="flex flex-col gap-4 lg:flex-row lg:h-[calc(100vh-8rem)]">
        <div className="flex min-h-[620px] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{projects.length} proyectos</p>
              <p className="text-xs text-gray-400">Vista interna por rango de fechas.</p>
            </div>
            <Button size="sm" onClick={() => setNewModal(true)} className="w-full justify-center sm:w-auto">
              <Plus size={16} />
              Nuevo proyecto
            </Button>
          </div>
          {error && (
            <div className="mb-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>No se han podido cargar los proyectos del calendario.</p>
            </div>
          )}
          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
              Cargando calendario...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 text-center">
              <FolderOpen size={36} className="text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-700">Todavía no hay proyectos</p>
              <p className="mt-1 max-w-sm text-sm text-gray-400">Crea un proyecto para visualizar su rango en el calendario interno.</p>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                defaultView="month"
                views={['month', 'week']}
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => setSelectedProject(event.resource)}
                style={{ height: '100%' }}
              />
            </div>
          )}
        </div>

        {selectedProject && (
          <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: selectedProject.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar panel">
                <X size={18} />
              </button>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 break-words">{selectedProject.name}</h3>
              {selectedProject.client && (
                <p className="text-sm text-gray-500 mt-0.5 break-words">{selectedProject.client}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Estado</span>
                <StatusBadge status={selectedProject.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Categoría</span>
                <span className="capitalize text-right">{selectedProject.category}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Inicio</span>
                <span className="text-right">{formatDate(selectedProject.start_date)}</span>
              </div>
              {selectedProject.end_date && (
                <div className="flex items-start justify-between gap-3">
                  <span>Fin</span>
                  <span className="text-right">{formatDate(selectedProject.end_date)}</span>
                </div>
              )}
            </div>
            <Link to={`/projects/${selectedProject.id}`} className="mt-auto">
              <Button variant="secondary" size="sm" className="w-full justify-center">
                Ver detalle completo
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Modal isOpen={newModal} onClose={() => setNewModal(false)} title="Nuevo proyecto">
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => setNewModal(false)}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
