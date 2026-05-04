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
import { AlertCircle, CalendarDays, Plus, X } from 'lucide-react'

const localizer = dayjsLocalizer(dayjs)
const calendarMinTime = new Date(1970, 0, 1, 8, 0)
const calendarMaxTime = new Date(1970, 0, 1, 23, 0)
const calendarFormats = {
  timeGutterFormat: 'HH:mm',
  dayFormat: (date) => dayjs(date).format('D ddd'),
  dayHeaderFormat: (date) => dayjs(date).format('dddd D MMMM'),
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
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este período.',
  showMore: (total) => `+${total} más`,
}

export default function CalendarEvents() {
  const { user } = useAuth()
  const { events, loading, error, createEvent } = useEvents(user?.id)
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [calendarView, setCalendarView] = useState('month')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [newEventInitialData, setNewEventInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const timeGridMinWidth = calendarView === 'week' ? 'min-w-[46rem]' : calendarView === 'day' ? 'min-w-[22rem]' : 'min-w-full'

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

  const openNewEvent = (initialData = null) => {
    setNewEventInitialData(initialData)
    setNewModal(true)
  }

  const closeNewEvent = () => {
    setNewModal(false)
    setNewEventInitialData(null)
  }

  const handleSelectSlot = ({ start, end }) => {
    const slotStart = dayjs(start)
    const startsAtMidnight = slotStart.hour() === 0 && slotStart.minute() === 0
    const eventStart = startsAtMidnight && calendarView === 'month'
      ? slotStart.hour(8)
      : slotStart
    const eventEnd = calendarView === 'month'
      ? eventStart.add(1, 'hour')
      : dayjs(end).isAfter(eventStart)
      ? dayjs(end)
      : eventStart.add(1, 'hour')

    openNewEvent({
      start_datetime: eventStart.toDate().toISOString(),
      end_datetime: eventEnd.toDate().toISOString(),
    })
  }

  return (
    <PageWrapper title="Calendario de eventos">
      <div className="flex flex-col gap-4 lg:flex-row lg:h-[calc(100vh-8rem)]">
        <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-3 sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{events.length} eventos</p>
              <p className="text-xs text-gray-400">Calendario compartible con fecha y hora exactas.</p>
            </div>
            <Button size="sm" onClick={() => openNewEvent()} className="w-full justify-center sm:w-auto">
              <Plus size={16} />
              Nuevo evento
            </Button>
          </div>
          {(error || projectsError) && (
            <div className="mb-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>No se han podido cargar todos los datos del calendario.</p>
            </div>
          )}
          {loading || projectsLoading ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
              Cargando calendario...
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="h-[560px] min-h-[560px] overflow-x-auto overflow-y-hidden sm:h-[640px] sm:min-h-[640px] lg:h-full lg:min-h-0">
                <div className={`h-full ${timeGridMinWidth}`}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    date={calendarDate}
                    view={calendarView}
                    views={['month', 'week', 'day']}
                    messages={messages}
                    formats={calendarFormats}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    onNavigate={setCalendarDate}
                    onView={setCalendarView}
                    onSelectEvent={(event) => setSelectedEvent(event.resource)}
                    onSelectSlot={handleSelectSlot}
                    min={calendarMinTime}
                    max={calendarMaxTime}
                    popup
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
              {events.length === 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  <CalendarDays size={16} className="text-gray-400 flex-shrink-0" />
                  No hay eventos en esta cuenta. Puedes moverte por meses o seleccionar un hueco para crear el primero.
                </div>
              )}
            </div>
          )}
        </div>

        {selectedEvent && (
          <div className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: selectedEvent.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 -mr-1 -mt-1 p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]" aria-label="Cerrar panel">
                <X size={20} />
              </button>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 break-words">{selectedEvent.name}</h3>
              {selectedEvent.client && (
                <p className="text-sm text-gray-500 mt-0.5 break-words">{selectedEvent.client}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Estado</span>
                <StatusBadge status={selectedEvent.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Categoría</span>
                <span className="capitalize text-right">{selectedEvent.category}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Inicio</span>
                <span className="text-right">{formatDatetime(selectedEvent.start_datetime)}</span>
              </div>
              {selectedEvent.end_datetime && (
                <div className="flex items-start justify-between gap-3">
                  <span>Fin</span>
                  <span className="text-right">{formatDatetime(selectedEvent.end_datetime)}</span>
                </div>
              )}
              {selectedEvent.project_id && (() => {
                const project = projects?.find((p) => p.id === selectedEvent.project_id)
                return project ? (
                  <div className="flex items-start justify-between gap-3">
                    <span>Proyecto</span>
                    <Link to={`/projects/${project.id}`} className="max-w-44 truncate text-right text-[var(--color-primary-500)] hover:underline">
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

      <Modal isOpen={newModal} onClose={closeNewEvent} title="Nuevo evento">
        <EventForm
          initialData={newEventInitialData}
          projects={projects}
          onSubmit={handleCreate}
          onCancel={closeNewEvent}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
