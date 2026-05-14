import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { CalendarPageNav } from '../../components/calendar/CalendarPageNav'
import { ProjectYearView } from '../../components/calendar/ProjectYearView'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { ProjectForm } from '../Projects/ProjectForm'
import { useAuth } from '../../hooks/useAuth'
import { useContractors } from '../../hooks/useContractors'
import { useProjects } from '../../hooks/useProjects'
import { getProjectContractor } from '../../lib/contractors'
import { STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/formatters'
import { getDefaultSelectedMonth, getProjectsForMonth, MONTH_LABELS } from '../../lib/projectYearCalendar'
import { AlertCircle, FolderOpen, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'

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

function ProjectColorLegend({ projects, monthLabel }) {
  const visibleProjects = projects.slice(0, 8)
  const hiddenCount = projects.length - visibleProjects.length

  if (projects.length === 0) return null

  return (
    <section className="rounded-lg border border-border-subtle bg-surface-muted px-3 py-2">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Proyectos en {monthLabel}</p>
      <div className="flex flex-wrap gap-2">
        {visibleProjects.map((project) => (
          <span key={project.id} className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-subtle bg-surface-card px-2.5 py-1 text-xs text-text-secondary">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.color ?? 'var(--color-project-1)' }} />
            <span className="truncate">{project.name}</span>
            <span className="shrink-0 text-text-secondary/80">{STATUS_LABELS[project.status] ?? project.status}</span>
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

export default function CalendarProjects() {
  const { user } = useAuth()
  const { projects, loading, error, createProject } = useProjects(user?.id)
  const { contractors, findOrCreateContractor } = useContractors(user?.id)
  const [visibleYear, setVisibleYear] = useState(() => dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().month())
  const [selectedProject, setSelectedProject] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [newProjectInitialData, setNewProjectInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const selectedMonthProjects = useMemo(
    () => getProjectsForMonth(projects, visibleYear, selectedMonth).map((project) => project.source),
    [projects, selectedMonth, visibleYear]
  )

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

  const changeYear = (nextYear) => {
    setVisibleYear(nextYear)
    setSelectedMonth(getDefaultSelectedMonth(projects, nextYear))
  }

  return (
    <PageWrapper title="Calendario de proyectos">
      <CalendarPageNav />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col rounded-lg border border-border-subtle bg-surface-card p-3 shadow-sm sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">{projects.length} proyectos</p>
              <p className="text-xs text-text-secondary">Plan interno de proyectos por rango de fechas.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-muted px-2 py-1">
                <button
                  onClick={() => changeYear(visibleYear - 1)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary sm:min-h-9 sm:min-w-9"
                  aria-label="Año anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="min-w-16 text-center text-base font-semibold text-text-primary">{visibleYear}</span>
                <button
                  onClick={() => changeYear(visibleYear + 1)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary sm:min-h-9 sm:min-w-9"
                  aria-label="Año siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Button size="sm" onClick={() => openNewProject()} className="min-h-11 w-full justify-center sm:min-h-8 sm:w-auto">
                <Plus size={16} />
                Nuevo proyecto
              </Button>
            </div>
          </div>
          {error && (
            <div className="mb-3">
              <CalendarFeedback icon={AlertCircle} tone="error">
                No se han podido cargar los proyectos del calendario.
              </CalendarFeedback>
            </div>
          )}
          {loading ? (
            <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface-muted text-sm text-text-secondary">
              Cargando planificación…
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4">
              <ProjectYearView
                projects={projects}
                year={visibleYear}
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
                onSelectProject={setSelectedProject}
              />
              <ProjectColorLegend projects={selectedMonthProjects} monthLabel={MONTH_LABELS[selectedMonth]} />
              {projects.length === 0 && (
                <div className="mt-3">
                  <CalendarFeedback icon={FolderOpen}>
                    No hay proyectos en esta cuenta. Crea el primero para verlo en la planificación anual.
                  </CalendarFeedback>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedProject && (
          (() => {
            const selectedContractor = getProjectContractor(selectedProject, contractors)
            return (
          <div className="flex w-full flex-col gap-4 rounded-lg border border-border-subtle bg-surface-card p-5 text-text-primary shadow-sm lg:w-80 lg:self-start">
            <div className="flex items-start justify-between">
              <div className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: selectedProject.color ?? 'var(--color-project-1)' }} />
              <button onClick={() => setSelectedProject(null)} className="-mr-1 -mt-1 rounded-lg p-1.5 text-text-secondary hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary" aria-label="Cerrar panel">
                <X size={20} />
              </button>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary break-words">{selectedProject.name}</h3>
              {selectedContractor && (
                <p className="text-sm text-text-secondary mt-0.5 break-words">{selectedContractor.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
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
              <Button variant="secondary" size="sm" className="min-h-11 w-full justify-center sm:min-h-8">
                Ver detalle completo
              </Button>
            </Link>
          </div>
            )
          })()
        )}
      </div>

      <Modal isOpen={newModal} onClose={closeNewProject} title="Nuevo proyecto">
        <ProjectForm
          initialData={newProjectInitialData}
          contractors={contractors}
          onCreateContractor={findOrCreateContractor}
          onSubmit={handleCreate}
          onCancel={closeNewProject}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
