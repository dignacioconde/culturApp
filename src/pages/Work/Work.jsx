import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Ticket, ChevronRight, Calendar } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { formatDate, formatDatetime } from '../../lib/formatters'

function ProjectCard({ project, eventCount = 0 }) {
  const isActive = project.status === 'confirmed' || project.status === 'in_progress'
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`block p-4 rounded-lg border transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isActive ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-200 hover:border-indigo-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{project.name}</h3>
              <StatusBadge status={project.status} size="sm" />
            </div>
            {project.client && <p className="text-xs text-gray-500 mt-0.5 truncate">{project.client}</p>}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{formatDate(project.start_date)}{project.end_date && ` – ${formatDate(project.end_date)}`}</span>
              {eventCount > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Ticket size={12} />{eventCount}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </div>
    </Link>
  )
}

function EventCard({ event, projectName = null }) {
  const isActive = event.status === 'confirmed' || event.status === 'in_progress'
  return (
    <Link
      to={`/events/${event.id}`}
      className={`block p-4 rounded-lg border transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isActive ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-200 hover:border-indigo-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: event.color ?? '#4f98a3' }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{event.name}</h3>
              <StatusBadge status={event.status} size="sm" />
            </div>
            {event.client && <p className="text-xs text-gray-500 mt-0.5 truncate">{event.client}</p>}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{formatDatetime(event.start_datetime)}{event.end_datetime && ` – ${formatDatetime(event.end_datetime)}`}</span>
            </div>
            {projectName && (
              <p className="text-xs text-indigo-600 mt-1">Proyecto: {projectName}</p>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </div>
    </Link>
  )
}

export default function Work() {
  const { user } = useAuth()
  const { projects, loading: projectsLoading } = useProjects(user?.id)
  const { events, loading: eventsLoading } = useEvents(user?.id)
  const [tab, setTab] = useState('all')

  const activeProjects = projects.filter(p => p.status === 'confirmed' || p.status === 'in_progress')
  const activeEvents = events.filter(e => e.status === 'confirmed' || e.status === 'in_progress')

  const getProjectEventCount = (projectId) => {
    return events.filter(e => e.project_id === projectId).length
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name
  }

  return (
    <PageWrapper title="Trabajos">
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setTab('projects')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              tab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen size={14} />Proyectos
          </button>
          <button
            onClick={() => setTab('events')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              tab === 'events' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Ticket size={14} />Eventos
          </button>
        </div>

        {/* Proyectos Activos - siempre visible si hay */}
        {(activeProjects.length > 0 || activeEvents.length > 0) && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Trabajos activos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tab !== 'events' && activeProjects.map(project => (
                <ProjectCard key={project.id} project={project} eventCount={getProjectEventCount(project.id)} />
              ))}
              {tab !== 'projects' && activeEvents.map(event => (
                <EventCard key={event.id} event={event} projectName={event.project_id ? getProjectName(event.project_id) : null} />
              ))}
            </div>
          </div>
        )}

        {/* Resto de proyectos */}
        {(tab === 'all' || tab === 'projects') && projects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Proyectos</h2>
              <Link to="/projects">
                <Button size="sm" variant="ghost">
                  <FolderOpen size={14} /> Ver proyectos
                </Button>
              </Link>
            </div>
            {projectsLoading ? (
              <p className="text-sm text-gray-400">Cargando proyectos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} eventCount={getProjectEventCount(project.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resto de eventos */}
        {(tab === 'all' || tab === 'events') && events.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Eventos</h2>
              <Link to="/events">
                <Button size="sm" variant="ghost">
                  <Ticket size={14} /> Ver eventos
                </Button>
              </Link>
            </div>
            {eventsLoading ? (
              <p className="text-sm text-gray-400">Cargando eventos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {events.map(event => (
                  <EventCard key={event.id} event={event} projectName={event.project_id ? getProjectName(event.project_id) : null} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vacío */}
        {!projectsLoading && !eventsLoading && projects.length === 0 && events.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">No tienes ningún trabajo registrado.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/projects">
                <Button><FolderOpen size={16} /> Crear proyecto</Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary"><Ticket size={16} /> Crear evento</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
