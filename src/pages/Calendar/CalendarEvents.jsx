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
import { EventForm } from '../Events/EventForm'
import { useAuth } from '../../hooks/useAuth'
import { useEvents } from '../../hooks/useEvents'
import { useProjects } from '../../hooks/useProjects'
import { formatDatetime } from '../../lib/formatters'
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
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este período.',
  showMore: (total) => `+${total} más`,
}

export default function CalendarEvents() {
  const { user } = useAuth()
  const { events, createEvent } = useEvents(user?.id)
  const { projects } = useProjects(user?.id)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const calendarEvents = useMemo(() =>
    events.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.start_datetime),
      end: e.end_datetime ? new Date(e.end_datetime) : new Date(e.start_datetime),
      resource: e,
    }))
  , [events])

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
    const { error } = await createEvent(formData)
    setSaving(false)
    if (error) { addToast('Error al crear el evento.', 'error'); return }
    addToast('Evento creado.')
    setNewModal(false)
  }

  return (
    <PageWrapper title="Calendario de eventos">
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => setNewModal(true)}>
              <Plus size={16} />
              Nuevo evento
            </Button>
          </div>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            defaultView="month"
            views={['month', 'week', 'day']}
            messages={messages}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedEvent(event.resource)}
            style={{ height: 'calc(100% - 44px)' }}
          />
        </div>

        {selectedEvent && (
          <div className="w-72 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: selectedEvent.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedEvent.name}</h3>
              {selectedEvent.client && (
                <p className="text-sm text-gray-500 mt-0.5">{selectedEvent.client}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estado</span>
                <StatusBadge status={selectedEvent.status} />
              </div>
              <div className="flex justify-between">
                <span>Categoría</span>
                <span className="capitalize">{selectedEvent.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Inicio</span>
                <span>{formatDatetime(selectedEvent.start_datetime)}</span>
              </div>
              {selectedEvent.end_datetime && (
                <div className="flex justify-between">
                  <span>Fin</span>
                  <span>{formatDatetime(selectedEvent.end_datetime)}</span>
                </div>
              )}
              {selectedEvent.project_id && (() => {
                const project = projects.find((p) => p.id === selectedEvent.project_id)
                return project ? (
                  <div className="flex justify-between">
                    <span>Proyecto</span>
                    <Link to={`/projects/${project.id}`} className="text-indigo-600 hover:underline truncate max-w-32">
                      {project.name}
                    </Link>
                  </div>
                ) : null
              })()}
            </div>
            <Link to={`/events/${selectedEvent.id}`} className="mt-auto">
              <Button variant="secondary" size="sm" className="w-full justify-center">
                Ver detalle completo
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Modal isOpen={newModal} onClose={() => setNewModal(false)} title="Nuevo evento">
        <EventForm
          projects={projects}
          onSubmit={handleCreate}
          onCancel={() => setNewModal(false)}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
