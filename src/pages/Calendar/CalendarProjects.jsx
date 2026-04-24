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
import { Plus, X } from 'lucide-react'

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
  const { projects, createProject } = useProjects(user?.id)
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
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => setNewModal(true)}>
              <Plus size={16} />
              Nuevo proyecto
            </Button>
          </div>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            defaultView="month"
            views={['month', 'week']}
            messages={messages}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedProject(event.resource)}
            style={{ height: 'calc(100% - 44px)' }}
          />
        </div>

        {selectedProject && (
          <div className="w-72 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: selectedProject.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedProject.name}</h3>
              {selectedProject.client && (
                <p className="text-sm text-gray-500 mt-0.5">{selectedProject.client}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estado</span>
                <StatusBadge status={selectedProject.status} />
              </div>
              <div className="flex justify-between">
                <span>Categoría</span>
                <span className="capitalize">{selectedProject.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Inicio</span>
                <span>{formatDate(selectedProject.start_date)}</span>
              </div>
              {selectedProject.end_date && (
                <div className="flex justify-between">
                  <span>Fin</span>
                  <span>{formatDate(selectedProject.end_date)}</span>
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
