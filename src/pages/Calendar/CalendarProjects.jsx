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
import { useProjects } from '../../hooks/useProjects'
import { formatDate } from '../../lib/formatters'
import { getDefaultSelectedMonth } from '../../lib/projectYearCalendar'
import { AlertCircle, FolderOpen, Plus, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

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
        <div className="flex flex-1 flex-col rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] p-3 sm:p-4 lg:min-h-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">{projects.length} proyectos</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Vista interna por rango de fechas</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E2D9C2] bg-[#FFFCF5] px-2 py-1">
                <button
                  onClick={() => changeYear(visibleYear - 1)}
                  className="rounded-lg p-1.5 text-gray-600 hover:bg-[#F5EFE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                  aria-label="Año anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="min-w-16 text-center text-base font-semibold text-gray-900">{visibleYear}</span>
                <button
                  onClick={() => changeYear(visibleYear + 1)}
                  className="rounded-lg p-1.5 text-gray-600 hover:bg-[#F5EFE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                  aria-label="Año siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Button size="sm" onClick={() => openNewProject()} className="w-full justify-center sm:w-auto">
                <Plus size={16} />
                Nuevo proyecto
              </Button>
            </div>
          </div>
          {error && (
            <div className="mb-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>No se han podido cargar los proyectos del calendario.</p>
            </div>
          )}
          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
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
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  <FolderOpen size={16} className="text-gray-400 flex-shrink-0" />
                  No hay proyectos en esta cuenta. Crea el primero para verlo en la planificación anual.
                </div>
              )}
            </div>
          )}
        </div>

        {selectedProject && (
          <div className={`
            w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4
            lg:relative
            ${isMobile ? 'fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-0 right-0 max-h-[calc(70dvh-4rem)] overflow-y-auto rounded-b-none border-b-0 shadow-lg z-30' : ''}
          `}>
            {/* Toggle para móvil */}
            {isMobile && (
              <button 
                onClick={() => setPanelExpanded(!panelExpanded)}
                className="flex w-full items-center justify-center py-2 text-gray-500 hover:text-gray-700"
              >
                {panelExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            )}
            
            <div className="flex items-start justify-between">
              <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: selectedProject.color ?? '#4f98a3' }} />
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 -mr-1 -mt-1 p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]" aria-label="Cerrar panel">
                <X size={20} />
              </button>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 break-words">{selectedProject.name}</h3>
              {selectedProject.client && (
                <p className="text-sm text-gray-500 mt-0.5 break-words">{selectedProject.client}</p>
              )}
            </div>
            <div className={`flex flex-col gap-2 text-sm text-gray-600 ${isMobile && !panelExpanded ? 'hidden' : ''}`}>
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
              <Button variant="secondary" size="sm" className="w-full justify-center">
                Ver detalle completo
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Modal isOpen={newModal} onClose={closeNewProject} title="Nuevo proyecto">
        <ProjectForm
          initialData={newProjectInitialData}
          onSubmit={handleCreate}
          onCancel={closeNewProject}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
