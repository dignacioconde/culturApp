import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
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
import { formatDate } from '../../lib/formatters'
import { getDefaultSelectedMonth } from '../../lib/projectYearCalendar'
import { AlertCircle, FolderOpen, Plus, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function CalendarProjects() {
  const { user } = useAuth()
  const { projects, loading, error, createProject } = useProjects(user?.id)
  const { contractors, findOrCreateContractor } = useContractors(user?.id)
  const isMobile = useIsMobile()
  const [visibleYear, setVisibleYear] = useState(() => dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().month())
  const [selectedProject, setSelectedProject] = useState(null)
  const [newModal, setNewModal] = useState(false)
  const [newProjectInitialData, setNewProjectInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

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
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col rounded-lg border border-border-subtle bg-surface-card p-3 shadow-sm sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">{projects.length} proyectos</p>
              <p className="text-xs text-text-secondary">Vista interna por rango de fechas</p>
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
              Cargando planificación...
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
          <div className={`
            w-full lg:w-80 bg-surface-card rounded-lg border border-border-subtle p-5 flex flex-col gap-4 text-text-primary shadow-sm
            lg:relative
            ${isMobile ? 'fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-0 right-0 max-h-[calc(70dvh-4rem)] overflow-y-auto rounded-b-none border-b-0 shadow-lg z-30' : ''}
          `}>
            {/* Toggle para móvil */}
            {isMobile && (
              <button 
                onClick={() => setPanelExpanded(!panelExpanded)}
                className="flex w-full items-center justify-center py-2 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                {panelExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            )}
            
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: selectedProject.color ?? 'var(--color-project-1)' }} />
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
            <div className={`flex flex-col gap-2 text-sm text-text-secondary ${isMobile && !panelExpanded ? 'hidden' : ''}`}>
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
            <Link to={`/projects/${selectedProject.id}`} className={`mt-auto ${isMobile && !panelExpanded ? 'hidden' : ''}`}>
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
