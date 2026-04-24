import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { ProjectForm } from './ProjectForm'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { formatDate } from '../../lib/formatters'
import { PROJECT_STATUSES, PROJECT_CATEGORIES } from '../../lib/constants'

export default function ProjectList() {
  const { user } = useAuth()
  const { projects, loading, createProject } = useProjects(user?.id)
  const { toasts, addToast, removeToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const filtered = projects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.client?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && p.status !== filterStatus) return false
    if (filterCategory && p.category !== filterCategory) return false
    return true
  })

  const handleCreate = async (formData) => {
    setSaving(true)
    const { error } = await createProject(formData)
    setSaving(false)
    if (error) {
      addToast('Error al crear el proyecto.', 'error')
      return
    }
    addToast('Proyecto creado correctamente.')
    setIsModalOpen(false)
  }

  return (
    <PageWrapper title="Proyectos">
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar proyectos..."
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 w-52"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Todos los estados</option>
              {PROJECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Todas las categorías</option>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Nuevo proyecto
          </Button>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-sm text-gray-400">Cargando proyectos...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <FolderOpen size={36} />
            <p className="text-sm">No hay proyectos. Crea tu primero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: project.color ?? '#4f98a3' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                        <StatusBadge status={project.status} />
                      </div>
                      {project.client && (
                        <p className="text-sm text-gray-500 mt-0.5 truncate">{project.client}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2 capitalize">{project.category}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(project.start_date)}
                        {project.end_date && ` – ${formatDate(project.end_date)}`}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo proyecto">
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
