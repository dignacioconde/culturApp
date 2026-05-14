import { useState, useMemo, useEffect } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { CalendarPageNav } from '../../components/calendar/CalendarPageNav'
import { CalendarSyncPanel } from '../../components/calendar/CalendarSyncPanel'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { EventForm } from '../Events/EventForm'
import { useAuth } from '../../hooks/useAuth'
import { useCalendarFeeds } from '../../hooks/useCalendarFeeds'
import { useContractors } from '../../hooks/useContractors'
import { useEvents } from '../../hooks/useEvents'
import { useProjects } from '../../hooks/useProjects'
import { formatContractorDisplay, getEventContractor } from '../../lib/contractors'
import { STATUS_LABELS } from '../../lib/constants'
import { formatDatetime, formatTime } from '../../lib/formatters'
import { AlertCircle, CalendarDays, Clock, Plus, X } from 'lucide-react'

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

const calendarFrameClass = [
  'rounded-lg border border-border-subtle bg-surface-card p-2 shadow-sm',
  '[&_.rbc-calendar]:text-text-primary',
  '[&_.rbc-toolbar]:gap-2 [&_.rbc-toolbar]:text-sm',
  '[&_.rbc-toolbar_button]:rounded-full [&_.rbc-toolbar_button]:border-border-subtle [&_.rbc-toolbar_button]:bg-surface-card',
  '[&_.rbc-toolbar_button]:text-text-secondary [&_.rbc-toolbar_button]:shadow-sm',
  '[&_.rbc-toolbar_button:hover]:bg-surface-page-dark [&_.rbc-toolbar_button:hover]:text-text-primary',
  '[&_.rbc-toolbar_button.rbc-active]:border-accent-primary [&_.rbc-toolbar_button.rbc-active]:bg-accent-primary [&_.rbc-toolbar_button.rbc-active]:text-primary-foreground',
  '[&_.rbc-header]:border-border-subtle [&_.rbc-header]:py-2 [&_.rbc-header]:text-xs [&_.rbc-header]:font-semibold [&_.rbc-header]:text-text-secondary',
  '[&_.rbc-month-view]:rounded-lg [&_.rbc-month-view]:border-border-subtle',
  '[&_.rbc-time-view]:rounded-lg [&_.rbc-time-view]:border-border-subtle',
  '[&_.rbc-time-content]:border-border-subtle',
  '[&_.rbc-day-bg+_.rbc-day-bg]:border-border-subtle',
  '[&_.rbc-off-range-bg]:bg-surface-muted',
  '[&_.rbc-today]:bg-warning-soft',
  '[&_.rbc-current-time-indicator]:bg-accent-primary',
].join(' ')

function CalendarFeedback({ icon: Icon, tone = 'muted', children }) {
  const tones = {
    error: 'border-danger/30 bg-danger-soft text-danger',
    muted: 'border-border-subtle bg-surface-muted text-text-secondary',
  }

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}

function getVisibleEvents(events, date, view) {
  const anchor = dayjs(date)
  const start = view === 'day'
    ? anchor.startOf('day')
    : view === 'week'
    ? anchor.startOf('week')
    : anchor.startOf('month')
  const end = view === 'day'
    ? anchor.endOf('day')
    : view === 'week'
    ? anchor.endOf('week')
    : anchor.endOf('month')

  return events.filter((event) => {
    const eventStart = dayjs(event.start_datetime)
    const eventEnd = event.end_datetime ? dayjs(event.end_datetime) : eventStart
    return !eventStart.isAfter(end) && !eventEnd.isBefore(start)
  })
}

function CalendarEventLegend({ events }) {
  const visibleEvents = events.slice(0, 8)
  const hiddenCount = events.length - visibleEvents.length

  if (events.length === 0) return null

  return (
    <section className="mb-3 rounded-lg border border-border-subtle bg-surface-muted px-3 py-2">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Colores visibles</p>
      <div className="flex flex-wrap gap-2">
        {visibleEvents.map((event) => (
          <span key={event.id} className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-subtle bg-surface-card px-2.5 py-1 text-xs text-text-secondary">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: event.color ?? 'var(--color-project-1)' }} />
            <span className="truncate">{event.name}</span>
            <span className="shrink-0 text-text-secondary/80">{STATUS_LABELS[event.status] ?? event.status}</span>
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className="inline-flex items-center rounded-full border border-border-subtle bg-surface-card px-2.5 py-1 text-xs font-medium text-text-secondary">
            +{hiddenCount} más
          </span>
        )}
      </div>
    </section>
  )
}

function CalendarEventList({ events, onSelectEvent }) {
  return (
    <section className="mt-3 rounded-lg border border-border-subtle bg-surface-muted p-3">
      <div className="mb-2 flex items-center gap-2 text-text-primary">
        <Clock size={16} className="text-text-secondary" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Eventos visibles</h2>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-text-secondary">No hay eventos en este periodo.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelectEvent(event)}
              className="flex min-h-16 items-start gap-3 rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-left shadow-sm transition hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <span className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: event.color ?? 'var(--color-project-1)' }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-text-primary">{event.name}</span>
                <span className="block text-xs text-text-secondary">{formatDatetime(event.start_datetime)}</span>
                {event.end_datetime && (
                  <span className="block text-xs text-text-secondary">Hasta {formatTime(event.end_datetime)}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

// Detectar si es viewport móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function CalendarEvents() {
  const { user } = useAuth()
  const { events, loading, error, createEvent } = useEvents(user?.id)
  const { projects, error: projectsError } = useProjects(user?.id)
  const { contractors, findOrCreateContractor } = useContractors(user?.id)
  const calendarFeeds = useCalendarFeeds(user?.id)
  const isMobile = useIsMobile()
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [calendarView, setCalendarView] = useState(() => isMobile ? 'month' : 'month')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [newEventInitialData, setNewEventInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  
  // En móvil solo mostrar month y day, no week
  const availableViews = isMobile ? ['month', 'day'] : ['month', 'week', 'day']
  const activeCalendarView = isMobile && calendarView === 'week' ? 'month' : calendarView
  const timeGridMinWidth = activeCalendarView === 'week' ? 'min-w-[46rem]' : activeCalendarView === 'day' ? 'min-w-[22rem]' : 'min-w-full'

  const calendarEvents = useMemo(() =>
    events.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.start_datetime),
      end: e.end_datetime ? new Date(e.end_datetime) : new Date(e.start_datetime),
      resource: e,
    }))
  , [events])

  const visibleEvents = useMemo(
    () => getVisibleEvents(events, calendarDate, activeCalendarView),
    [events, calendarDate, activeCalendarView]
  )

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.resource.color ?? 'var(--color-project-1)',
      borderRadius: '6px',
      border: '1px solid rgb(255 255 255 / 0.42)',
      color: 'var(--surface-page)',
      fontSize: '12px',
      fontWeight: 600,
      padding: '2px 7px',
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
    const eventStart = startsAtMidnight && activeCalendarView === 'month'
      ? slotStart.hour(8)
      : slotStart
    const eventEnd = activeCalendarView === 'month'
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
      <CalendarPageNav />
      <div className="flex flex-col gap-4 lg:flex-row lg:h-[calc(100vh-8rem)]">
        <div className="flex flex-1 flex-col rounded-lg border border-border-subtle bg-surface-card p-3 shadow-sm sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">{events.length} eventos</p>
              <p className="text-xs text-text-secondary">Agenda de ocurrencias con fecha y hora exactas.</p>
            </div>
            <Button size="sm" onClick={() => openNewEvent()} className="min-h-11 w-full justify-center sm:min-h-8 sm:w-auto">
              <Plus size={16} />
              Nuevo evento
            </Button>
          </div>
          {(error || projectsError) && (
            <div className="mb-3">
              <CalendarFeedback icon={AlertCircle} tone="error">
                No se han podido cargar todos los datos del calendario.
              </CalendarFeedback>
            </div>
          )}
          {loading ? (
            <div className="flex h-[min(62dvh,520px)] min-h-[420px] flex-1 items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface-muted text-sm text-text-secondary sm:h-[560px] sm:min-h-[560px] lg:h-full lg:min-h-0">
              Cargando calendario…
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <CalendarEventLegend events={visibleEvents} />
              <div className={`${calendarFrameClass} h-[min(62dvh,520px)] min-h-[420px] overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] sm:h-[560px] sm:min-h-[560px] lg:h-full lg:min-h-0`}>
                <div className={`h-full ${timeGridMinWidth}`}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    date={calendarDate}
                    view={activeCalendarView}
                    views={availableViews}
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
                <div className="mt-3">
                  <CalendarFeedback icon={CalendarDays}>
                    No hay eventos en esta cuenta. Puedes moverte por meses o seleccionar un hueco para crear el primero.
                  </CalendarFeedback>
                </div>
              )}
              <CalendarEventList events={visibleEvents} onSelectEvent={setSelectedEvent} />
            </div>
          )}
        </div>

        {selectedEvent && (
          (() => {
            const selectedContractor = getEventContractor(selectedEvent, projects, contractors)
            return (
          <div className="flex w-full flex-col gap-4 rounded-lg border border-border-subtle bg-surface-card p-5 text-text-primary shadow-sm lg:w-80 lg:self-start">
            <div className="flex items-start justify-between">
              <div className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: selectedEvent.color ?? 'var(--color-project-1)' }} />
              <button onClick={() => setSelectedEvent(null)} className="-mr-1 -mt-1 rounded-lg p-1.5 text-text-secondary hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary" aria-label="Cerrar panel">
                <X size={20} />
              </button>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary break-words">{selectedEvent.name}</h3>
              {selectedContractor && (
                <p className="text-sm text-text-secondary mt-0.5 break-words">
                  {formatContractorDisplay(selectedContractor, { showInherited: true })}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
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
                    <Link to={`/projects/${project.id}`} className="min-w-0 flex-1 break-words text-right text-accent-primary hover:underline">
                      {project.name}
                    </Link>
                  </div>
                ) : null
              })()}
            </div>
            <Link to={`/events/${selectedEvent.id}`} className="mt-auto">
              <Button variant="secondary" size="sm" className="min-h-11 w-full justify-center sm:min-h-8">
                Ver detalle completo
              </Button>
            </Link>
          </div>
            )
          })()
        )}
      </div>

      <div className="mt-4">
        <CalendarSyncPanel
          {...calendarFeeds}
          onToast={addToast}
        />
      </div>

      <Modal isOpen={newModal} onClose={closeNewEvent} title="Nuevo evento">
        <EventForm
          initialData={newEventInitialData}
          projects={projects}
          contractors={contractors}
          onCreateContractor={findOrCreateContractor}
          onSubmit={handleCreate}
          onCancel={closeNewEvent}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
