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
const calendarFormats = {
  dayFormat: (date) => dayjs(date).format('D ddd'),
  dayRangeHeaderFormat: ({ start, end }) => `${dayjs(start).format('D MMM')} – ${dayjs(end).format('D MMM')}`,
}

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
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
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [calendarView, setCalendarView] = useState('month')
  const [selectedProject, setSelectedProject] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [newProjectInitialData, setNewProjectInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const calendarMinWidth = calendarView === 'week' ? 'min-w-[46rem]' : 'min-w-full'

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

  const openNewProject = (initialData = null) => {
    setNewProjectInitialData(initialData)
    setNewModal(true)
  }

  const closeNewProject = () => {
    setNewModal(false)
    setNewProjectInitialData(null)
  }

  const handleSelectSlot = ({ start, end }) => {
    const startDate = dayjs(start).format('YYYY-MM-DD')
    const exclusiveEnd = dayjs(end)
    const inclusiveEnd = exclusiveEnd.isAfter(dayjs(start), 'day')
      ? exclusiveEnd.subtract(1, 'day')
      : dayjs(start)

    openNewProject({
      start_date: startDate,
      end_date: inclusiveEnd.format('YYYY-MM-DD'),
    })
  }

  return (
    <PageWrapper title="Calendario de proyectos">
      <div className="flex flex-col gap-4 lg:flex-row lg:h-[calc(100vh-8rem)]">
        <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-3 sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{projects.length} proyectos</p>
              <p className="text-xs text-gray-400">Vista interna por rango de fechas.</p>
            </div>
            <Button size="sm" onClick={() => openNewProject()} className="w-full justify-center sm:w-auto">
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
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="h-[560px] min-h-[560px] overflow-x-auto overflow-y-hidden sm:h-[640px] sm:min-h-[640px] lg:h-full lg:min-h-0">
                <div className={`h-full ${calendarMinWidth}`}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    date={calendarDate}
                    view={calendarView}
                    views={['month', 'week']}
                    messages={messages}
                    formats={calendarFormats}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    onNavigate={setCalendarDate}
                    onView={setCalendarView}
                    onSelectEvent={(event) => setSelectedProject(event.resource)}
                    onSelectSlot={handleSelectSlot}
                    popup
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
              {projects.length === 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  <FolderOpen size={16} className="text-gray-400 flex-shrink-0" />
                  No hay proyectos en esta cuenta. Puedes moverte por meses o seleccionar días para crear el primero.
                </div>
              )}
            </div>
          )}
        </div>

        {selectedProject && (
          <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: selectedProject.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 -mr-1 -mt-1 p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Cerrar panel">
                <X size={20} />
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

      <Modal isOpen={newModal} onClose={closeNewProject} title="Nuevo proyecto">
        <ProjectForm
          initialData={newProjectInitialData}
          onSubmit={handleCreate}
          onCancel={closeNewProject}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
