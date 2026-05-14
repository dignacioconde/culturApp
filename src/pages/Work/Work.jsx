import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Briefcase, Building2, CalendarDays, ChevronRight, FolderOpen, Plus, Ticket } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useContractors } from '../../hooks/useContractors'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { getEventContractor, getProjectContractor } from '../../lib/contractors'
import { formatDateRange, formatDatetime } from '../../lib/formatters'

const views = [
  { value: 'all', label: 'Todo' },
  { value: 'projects', label: 'Proyectos' },
  { value: 'events', label: 'Eventos' },
]

const EMPTY_LIST = []
const linkButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-primary px-4 py-2 text-sm font-medium leading-none text-primary-foreground shadow-sm transition-colors hover:bg-accent-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2'
const secondaryLinkButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-sm font-medium leading-none text-text-primary shadow-sm transition-colors hover:bg-surface-page-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2'

function QuietStatusBadge({ status }) {
  if (!status || status === 'confirmed') return null
  return <StatusBadge status={status} />
}

function EventRow({ event, projects = EMPTY_LIST, contractors = EMPTY_LIST, compact = false }) {
  const contractor = getEventContractor(event, projects, contractors)
  const accentColor = event.color ?? 'var(--accent-primary)'

  return (
    <Link
      to={`/events/${event.id}`}
      className={`card-lift group flex min-w-0 overflow-hidden rounded-2xl border border-border-subtle bg-surface-card transition-colors hover:border-text-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${compact ? '' : ''}`}
    >
      <span className="w-1.5 shrink-0 transition-[width] duration-200 group-hover:w-2" style={{ backgroundColor: accentColor }} aria-hidden="true" />
      <span className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-3 ${compact ? '' : 'sm:px-4'}`}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-page-dark text-text-secondary">
          <Ticket size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium text-text-primary">{event.name}</span>
            <QuietStatusBadge status={event.status} />
          </span>
          <span className="mt-0.5 block truncate font-data text-xs text-text-secondary">
            {formatDatetime(event.start_datetime)}
            {contractor ? ` · ${contractor.name}` : ''}
          </span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function ProjectBlock({ project, events = EMPTY_LIST, allProjects = EMPTY_LIST, contractors = EMPTY_LIST }) {
  const contractor = getProjectContractor(project, contractors)

  return (
    <Card className="card-lift overflow-hidden border-border-subtle bg-surface-card">
      <div className="flex items-stretch">
        <span className="w-1.5 shrink-0 transition-[width] duration-200" style={{ backgroundColor: project.color ?? '#4f98a3' }} aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="min-w-0 truncate font-display text-lg font-semibold leading-tight text-text-primary hover:text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
                >
                  {project.name}
                </Link>
                <QuietStatusBadge status={project.status} />
              </div>
              <p className="mt-1 truncate font-data text-xs text-text-secondary sm:text-sm">
                {contractor ? `${contractor.name} · ` : ''}
                {formatDateRange(project.start_date, project.end_date)}
              </p>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full px-2 text-text-secondary hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              aria-label={`Abrir proyecto ${project.name}`}
            >
              <ChevronRight size={18} />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid gap-2">
              {events.map((event) => (
                <EventRow key={event.id} event={event} projects={allProjects} contractors={contractors} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-muted p-3 text-sm text-text-secondary">
              Sin eventos asociados todavía.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function Work() {
  const { user } = useAuth()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const { events, loading: eventsLoading, error: eventsError } = useEvents(user?.id)
  const { contractors, loading: contractorsLoading, error: contractorsError, schemaReady: contractorsSchemaReady } = useContractors(user?.id)
  const [searchParams, setSearchParams] = useSearchParams()

  const currentView = views.some((view) => view.value === searchParams.get('view'))
    ? searchParams.get('view')
    : 'all'

  const eventsByProject = useMemo(() => {
    const grouped = new Map()
    events.forEach((event) => {
      if (!event.project_id) return
      const projectEvents = grouped.get(event.project_id) ?? []
      projectEvents.push(event)
      grouped.set(event.project_id, projectEvents)
    })
    return grouped
  }, [events])

  const projectIds = useMemo(() => new Set(projects.map((project) => project.id)), [projects])
  const standaloneEvents = useMemo(
    () => events.filter((event) => !event.project_id || !projectIds.has(event.project_id)),
    [events, projectIds]
  )

  const loading = projectsLoading || eventsLoading || contractorsLoading
  const error = projectsError || eventsError || (contractorsSchemaReady ? contractorsError : null)
  const showProjects = currentView === 'all' || currentView === 'projects'
  const showEvents = currentView === 'all' || currentView === 'events'
  const visibleProjectCount = showProjects ? projects.length : 0
  const visibleStandaloneCount = showEvents ? standaloneEvents.length : 0
  const hasAnyWork = projects.length > 0 || events.length > 0

  const setView = (view) => {
    const nextParams = new URLSearchParams(searchParams)
    if (view === 'all') nextParams.delete('view')
    else nextParams.set('view', view)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <PageWrapper title="Trabajos">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="font-data text-xs text-text-secondary sm:text-sm">
              {projects.length} proyectos · {events.length} eventos
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/projects" className={secondaryLinkButtonClass}>
              <Plus size={16} />
              Proyecto
            </Link>
            <Link to="/events" className={linkButtonClass}>
              <Plus size={16} />
              Evento
            </Link>
            <Link to="/contractors" className={secondaryLinkButtonClass}>
              <Building2 size={16} />
              Contratantes
            </Link>
          </div>
        </div>

        <div className="inline-flex w-full items-center gap-1 rounded-full border border-border-subtle bg-surface-card p-1 sm:w-fit" role="tablist" aria-label="Filtrar trabajos">
          {views.map((view) => (
            <button
              key={view.value}
              type="button"
              role="tab"
              aria-selected={currentView === view.value}
              onClick={() => setView(view.value)}
              className={`min-h-10 flex-1 rounded-full px-3 text-sm font-medium transition-colors sm:flex-none sm:min-w-24 ${
                currentView === view.value
                  ? 'bg-text-primary text-primary-foreground shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
            No hemos podido cargar todos los trabajos. Revisa la conexión y vuelve a intentarlo.
          </div>
        )}

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-border-subtle bg-surface-card p-5">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton mt-3 h-3 w-1/2" />
                <div className="skeleton mt-5 h-10" />
              </Card>
            ))}
          </div>
        ) : !hasAnyWork ? (
          <Card className="border-dashed border-border-subtle bg-surface-muted/70 p-6 text-center">
            <Briefcase size={36} className="mx-auto text-text-secondary" />
            <p className="mt-3 font-display text-lg font-semibold leading-tight text-text-primary">No tienes ningún trabajo registrado.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-text-secondary">
              Crea un proyecto si quieres agrupar varias fechas o un evento si es una cita concreta.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <Link to="/projects" className={secondaryLinkButtonClass}>
                <FolderOpen size={16} />
                Crear proyecto
              </Link>
              <Link to="/events" className={linkButtonClass}>
                <Ticket size={16} />
                Crear evento
              </Link>
            </div>
          </Card>
        ) : visibleProjectCount === 0 && visibleStandaloneCount === 0 ? (
          <Card className="border-dashed border-border-subtle bg-surface-muted/70 p-6 text-center">
            <CalendarDays size={32} className="mx-auto text-text-secondary" />
            <p className="mt-3 font-display text-lg font-semibold leading-tight text-text-primary">No hay trabajos en esta vista.</p>
            <button
              type="button"
              onClick={() => setView('all')}
              className="mt-4 text-sm font-medium text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              Ver todo
            </button>
          </Card>
        ) : (
          <div className="grid gap-5">
            {showProjects && projects.length > 0 && (
              <section className="grid gap-3" aria-labelledby="work-projects-heading">
                <h2 id="work-projects-heading" className="font-display text-lg font-semibold leading-tight text-text-primary">
                  Proyectos
                </h2>
                <div className="grid gap-3 xl:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectBlock
                      key={project.id}
                      project={project}
                      events={eventsByProject.get(project.id) ?? []}
                      allProjects={projects}
                      contractors={contractors}
                    />
                  ))}
                </div>
              </section>
            )}

            {showEvents && standaloneEvents.length > 0 && (
              <section className="grid gap-3" aria-labelledby="work-events-heading">
                <h2 id="work-events-heading" className="font-display text-lg font-semibold leading-tight text-text-primary">
                  Eventos sin proyecto
                </h2>
                <div className="grid gap-2 xl:grid-cols-2">
                  {standaloneEvents.map((event) => (
                    <EventRow key={event.id} event={event} projects={projects} contractors={contractors} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
