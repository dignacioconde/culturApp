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

const linkButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#C94035] px-4 py-2 text-sm font-medium leading-none text-white shadow-sm transition-colors hover:bg-[#A8342B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'
const secondaryLinkButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2D9C2] bg-[#F5EFE0] px-4 py-2 text-sm font-medium leading-none text-[#211C18] shadow-sm transition-colors hover:bg-[#EBE3CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'

function QuietStatusBadge({ status }) {
  if (!status || status === 'confirmed') return null
  return <StatusBadge status={status} />
}

function EventRow({ event, projects = [], contractors = [], compact = false }) {
  const contractor = getEventContractor(event, projects, contractors)

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group flex min-w-0 items-center gap-3 rounded-lg border border-[#E2D9C2] bg-[#FDFBF6] px-3 py-3 transition-colors hover:border-[#C94035]/40 hover:bg-white ${compact ? '' : 'sm:px-4'}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EBE3CE] text-[#5C5149]">
        <Ticket size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-[#211C18]">{event.name}</span>
          <QuietStatusBadge status={event.status} />
        </span>
        <span className="mt-0.5 block truncate text-xs text-[#5C5149]">
          {formatDatetime(event.start_datetime)}
          {contractor ? ` · ${contractor.name}` : ''}
        </span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-[#8A7A6D] transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function ProjectBlock({ project, events, allProjects = [], contractors = [] }) {
  const contractor = getProjectContractor(project, contractors)

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color ?? '#4f98a3' }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Link
                to={`/projects/${project.id}`}
                className="min-w-0 truncate text-base font-semibold text-[#211C18] hover:text-[#C94035] hover:underline"
              >
                {project.name}
              </Link>
              <QuietStatusBadge status={project.status} />
            </div>
            <p className="mt-1 truncate text-sm text-[#5C5149]">
              {contractor ? `${contractor.name} · ` : ''}
              {formatDateRange(project.start_date, project.end_date)}
            </p>
          </div>
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-2 text-[#5C5149] hover:bg-[#EBE3CE] hover:text-[#211C18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035]"
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
          <div className="rounded-lg border border-dashed border-[#E2D9C2] bg-[#FDFBF6] px-3 py-3 text-sm text-[#8A7A6D]">
            Sin eventos asociados todavía.
          </div>
        )}
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
            <p className="text-sm text-[#5C5149]">
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

        <div className="flex w-full gap-1 rounded-lg bg-[#EBE3CE] p-1 sm:w-fit" role="tablist" aria-label="Filtrar trabajos">
          {views.map((view) => (
            <button
              key={view.value}
              type="button"
              role="tab"
              aria-selected={currentView === view.value}
              onClick={() => setView(view.value)}
              className={`min-h-10 flex-1 rounded-md px-3 text-sm font-medium transition-colors sm:flex-none sm:min-w-24 ${
                currentView === view.value
                  ? 'bg-white text-[#211C18] shadow-sm'
                  : 'text-[#5C5149] hover:text-[#211C18]'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            No hemos podido cargar todos los trabajos. Revisa la conexión y vuelve a intentarlo.
          </div>
        )}

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-5">
                <div className="h-4 w-2/3 rounded bg-[#EBE3CE]" />
                <div className="mt-3 h-3 w-1/2 rounded bg-[#EBE3CE]" />
                <div className="mt-5 h-10 rounded bg-[#F5EFE0]" />
              </Card>
            ))}
          </div>
        ) : !hasAnyWork ? (
          <Card className="p-6 text-center">
            <Briefcase size={36} className="mx-auto text-[#8A7A6D]" />
            <p className="mt-3 text-sm font-medium text-[#211C18]">No tienes ningún trabajo registrado.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#5C5149]">
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
          <Card className="p-6 text-center">
            <CalendarDays size={32} className="mx-auto text-[#8A7A6D]" />
            <p className="mt-3 text-sm font-medium text-[#211C18]">No hay trabajos en esta vista.</p>
            <button
              type="button"
              onClick={() => setView('all')}
              className="mt-4 text-sm font-medium text-[#C94035] hover:underline"
            >
              Ver todo
            </button>
          </Card>
        ) : (
          <div className="grid gap-5">
            {showProjects && projects.length > 0 && (
              <section className="grid gap-3" aria-labelledby="work-projects-heading">
                <h2 id="work-projects-heading" className="text-sm font-semibold text-[#211C18]">
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
                <h2 id="work-events-heading" className="text-sm font-semibold text-[#211C18]">
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
