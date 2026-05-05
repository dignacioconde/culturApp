import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Ticket } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { formatDatetime } from '../../lib/formatters'

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
        <span className="text-sm font-medium text-gray-900 truncate flex-1">{project.name}</span>
        <StatusBadge status={project.status} size="sm" />
      </div>
      {project.client && <p className="text-xs text-gray-400 mt-1 pl-4 truncate">{project.client}</p>}
    </Link>
  )
}

function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="block p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color ?? '#4f98a3' }} />
        <span className="text-sm font-medium text-gray-900 truncate flex-1">{event.name}</span>
        <StatusBadge status={event.status} size="sm" />
      </div>
      <p className="text-xs text-gray-400 mt-1 pl-4 truncate">{formatDatetime(event.start_datetime)}</p>
    </Link>
  )
}

export default function Work() {
  const { user } = useAuth()
  const { projects, loading: projectsLoading } = useProjects(user?.id)
  const { events, loading: eventsLoading } = useEvents(user?.id)
  const [tab, setTab] = useState('projects')

  // Forzar renderizado consistente del tab activo
  const activeTab = useMemo(() => tab, [tab])

  return (
    <PageWrapper title="Trabajos">
      {/* Tabs simplificados */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4" role="tablist" aria-label="Ver proyectos o eventos">
        <button
          role="tab"
          aria-selected={activeTab === 'projects'}
          onClick={() => setTab('projects')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors min-w-[80px] ${
            activeTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Proyectos
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'events'}
          onClick={() => setTab('events')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors min-w-[80px] ${
            activeTab === 'events' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Eventos
        </button>
      </div>

      {/* Proyectos */}
      {activeTab === 'projects' && (
        <div className="flex flex-col gap-3">
          {projectsLoading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : projects.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-3">Sin proyectos</p>
              <Link to="/projects">
                <Button size="sm">Crear proyecto</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Eventos */}
      {activeTab === 'events' && (
        <div className="flex flex-col gap-3">
          {eventsLoading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : events.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-3">Sin eventos</p>
              <Link to="/events">
                <Button size="sm">Crear evento</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estado vacío general */}
      {!projectsLoading && !eventsLoading && projects.length === 0 && events.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">No tienes ningún trabajo registrado.</p>
          <div className="flex justify-center gap-2">
            <Link to="/projects">
              <Button size="sm"><FolderOpen size={14} /> Proyecto</Button>
            </Link>
            <Link to="/events">
              <Button size="sm" variant="secondary"><Ticket size={14} /> Evento</Button>
            </Link>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
