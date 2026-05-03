import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle, Edit, CalendarDays } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { ProjectForm } from './ProjectForm'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { useIncomes } from '../../hooks/useIncomes'
import { useExpenses } from '../../hooks/useExpenses'
import { formatCurrency, formatCurrencyPerHour, formatDate, formatDatetime, formatHours } from '../../lib/formatters'
import { EXPENSE_CATEGORIES } from '../../lib/constants'

const EMPTY_EXPENSE = { concept: '', amount: '', category: 'otros', expense_date: '', is_deductible: true }

const getEventHours = (event) => {
  if (!event.end_datetime) return 0
  const minutes = (new Date(event.end_datetime).getTime() - new Date(event.start_datetime).getTime()) / 60000
  return minutes > 0 ? minutes / 60 : 0
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { projects, loading: projectsLoading, error: projectsError, updateProject, deleteProject } = useProjects(user?.id)
  const { events, loading: eventsLoading } = useEvents(user?.id, id)
  const eventIds = useMemo(() => events.map((e) => e.id), [events])
  const { incomes, loading: incomesLoading, createIncome, updateIncome, deleteIncome } = useIncomes(user?.id, { projectId: id, eventIds })
  const { expenses, loading: expensesLoading, createExpense, updateExpense, deleteExpense } = useExpenses(user?.id, { projectId: id, eventIds })
  const { toasts, addToast, removeToast } = useToast()

  const project = projects.find((p) => p.id === id)

  const [editModal, setEditModal] = useState(false)
  const [savingProject, setSavingProject] = useState(false)

  const defaultTaxRate = profile?.tax_rate ?? 15
  const emptyIncomeForm = { concept: '', amount: '', tax_rate: defaultTaxRate, expected_date: '', is_paid: false }

  const [incomeModal, setIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)
  const [incomeForm, setIncomeForm] = useState(emptyIncomeForm)
  const [savingIncome, setSavingIncome] = useState(false)

  const [expenseModal, setExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE)
  const [savingExpense, setSavingExpense] = useState(false)

  if (projectsLoading) {
    return (
      <PageWrapper title="Proyecto">
        <p className="text-sm text-gray-400">Cargando proyecto...</p>
      </PageWrapper>
    )
  }

  if (!project) {
    return (
      <PageWrapper title="Proyecto">
        <div className="max-w-xl">
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-900">{projectsError ? 'No hemos podido cargar el proyecto.' : 'Proyecto no encontrado.'}</p>
            <p className="text-sm text-gray-500 mt-1">Vuelve al listado para revisar tus proyectos disponibles.</p>
            <Link to="/projects" className="inline-flex mt-4">
              <Button variant="secondary" size="sm">
                <ArrowLeft size={14} /> Volver a proyectos
              </Button>
            </Link>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const directIncomes = incomes.filter((i) => i.project_id === id)
  const directExpenses = expenses.filter((e) => e.project_id === id)

  const totalGross = incomes.reduce((acc, i) => acc + Number(i.amount), 0)
  const paidIncomes = incomes.filter((i) => i.is_paid)
  const paidEventIncomes = paidIncomes.filter((i) => i.event_id)
  const paidEventIds = new Set(paidEventIncomes.map((i) => i.event_id))
  const totalPaid = paidIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
  const totalPaidFromEvents = paidEventIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
  const pendingAmount = totalGross - totalPaid
  const totalRetentions = paidIncomes.reduce((acc, i) => acc + Number(i.amount) * (Number(i.tax_rate) / 100), 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0)
  const projectHours = events
    .filter((event) => paidEventIds.has(event.id))
    .reduce((acc, event) => acc + getEventHours(event), 0)
  const grossHourlyRate = projectHours > 0 ? totalPaidFromEvents / projectHours : 0
  const netProfit = totalPaid - totalRetentions - totalExpenses

  const openNewIncome = () => { setEditingIncome(null); setIncomeForm(emptyIncomeForm); setIncomeModal(true) }
  const openEditIncome = (income) => {
    setEditingIncome(income)
    setIncomeForm({ concept: income.concept, amount: income.amount, tax_rate: income.tax_rate, expected_date: income.expected_date ?? '', is_paid: income.is_paid })
    setIncomeModal(true)
  }
  const openNewExpense = () => { setEditingExpense(null); setExpenseForm(EMPTY_EXPENSE); setExpenseModal(true) }
  const openEditExpense = (expense) => {
    setEditingExpense(expense)
    setExpenseForm({ concept: expense.concept, amount: expense.amount, category: expense.category, expense_date: expense.expense_date ?? '', is_deductible: expense.is_deductible })
    setExpenseModal(true)
  }

  const handleUpdateProject = async (formData) => {
    setSavingProject(true)
    const { error } = await updateProject(id, formData)
    setSavingProject(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Proyecto actualizado.')
    setEditModal(false)
  }

  const handleDeleteProject = async () => {
    if (!confirm('¿Eliminar este proyecto? Se borrarán también sus ingresos y gastos directos.')) return
    const { error } = await deleteProject(id)
    if (error) { addToast('Error al eliminar.', 'error'); return }
    navigate('/projects')
  }

  const handleSubmitIncome = async (e) => {
    e.preventDefault()
    if (!incomeForm.concept.trim() || Number(incomeForm.amount) <= 0) {
      addToast('Completa el concepto y un importe mayor que 0.', 'error')
      return
    }
    setSavingIncome(true)
    const { error } = editingIncome
      ? await updateIncome(editingIncome.id, incomeForm)
      : await createIncome({ ...incomeForm, project_id: id })
    setSavingIncome(false)
    if (error) { addToast('Error al guardar el ingreso.', 'error'); return }
    addToast(editingIncome ? 'Ingreso actualizado.' : 'Ingreso añadido.')
    setIncomeModal(false)
  }

  const handleTogglePaid = async (income) => {
    await updateIncome(income.id, {
      is_paid: !income.is_paid,
      paid_date: !income.is_paid ? new Date().toISOString().split('T')[0] : null,
    })
  }

  const handleSubmitExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.concept.trim() || Number(expenseForm.amount) <= 0) {
      addToast('Completa el concepto y un importe mayor que 0.', 'error')
      return
    }
    setSavingExpense(true)
    const { error } = editingExpense
      ? await updateExpense(editingExpense.id, expenseForm)
      : await createExpense({ ...expenseForm, project_id: id })
    setSavingExpense(false)
    if (error) { addToast('Error al guardar el gasto.', 'error'); return }
    addToast(editingExpense ? 'Gasto actualizado.' : 'Gasto añadido.')
    setExpenseModal(false)
  }

  return (
    <PageWrapper title={project.name}>
      <div className="flex flex-col gap-6 max-w-4xl">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 breadcrumbs">
          <Link to="/projects" className="hover:text-gray-600">Proyectos</Link>
          <span>/</span>
          <span className="text-gray-600">{project.name}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/projects" className="text-gray-400 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
                <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                <StatusBadge status={project.status} />
              </div>
              {project.client && <p className="text-sm text-gray-500 mt-0.5">{project.client}</p>}
              <p className="text-xs text-gray-400 mt-1 capitalize">
                {project.category} · {formatDate(project.start_date)}{project.end_date && ` – ${formatDate(project.end_date)}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button variant="secondary" size="sm" onClick={() => setEditModal(true)} className="min-h-11 min-w-[5.5rem]">
              <Edit size={14} /> Editar
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteProject} className="min-h-11 min-w-[5.5rem]">
              <Trash2 size={14} /> Eliminar
            </Button>
          </div>
        </div>

        <Card className="p-5 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Resumen financiero</h3>
              <p className="text-xs text-gray-500 mt-1">Incluye ingresos y gastos directos del proyecto y sus eventos.</p>
            </div>
            <p className="text-xs text-gray-500">Cobrado: {formatCurrency(totalPaid)} · Pendiente: {formatCurrency(pendingAmount)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Ingresos previstos', value: formatCurrency(totalGross) },
            { label: 'IRPF sobre cobrado', value: formatCurrency(totalRetentions) },
            { label: 'Gastos registrados', value: formatCurrency(totalExpenses) },
            { label: 'Cobro bruto/hora', value: projectHours > 0 ? formatCurrencyPerHour(grossHourlyRate) : '—', detail: `Solo eventos cobrados · ${formatHours(projectHours)} h` },
            { label: 'Beneficio neto', value: formatCurrency(netProfit), highlight: true },
          ].map(({ label, value, detail, highlight }) => (
            <div key={label} className={`rounded-lg border p-4 ${highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-lg font-semibold mt-1 ${highlight ? 'text-indigo-700' : 'text-gray-900'}`}>{value}</p>
              {detail && <p className="mt-1 text-xs text-gray-400">{detail}</p>}
            </div>
          ))}
          </div>
        </Card>

        {/* Eventos asociados */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-indigo-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Eventos asociados</h3>
                <p className="text-xs text-gray-500 mt-1">Ocurrencias concretas dentro de este proyecto.</p>
              </div>
            </div>
            <Link to={`/events?project=${id}`}>
              <Button size="sm" variant="secondary">
                <Plus size={14} /> Nuevo evento
              </Button>
            </Link>
          </div>
          {eventsLoading ? (
            <p className="text-sm text-gray-400">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay eventos asociados a este proyecto todavía.</p>
              <Link to={`/events?project=${id}`} className="inline-flex mt-3">
                <Button size="sm" variant="secondary">
                  <Plus size={14} /> Crear primer evento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.color ?? '#4f98a3' }} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-400">{formatDatetime(event.start_datetime)}</p>
                    </div>
                  </div>
                  <StatusBadge status={event.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Ingresos directos del proyecto */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Ingresos del proyecto</h3>
              <p className="text-xs text-gray-400 mt-0.5">No atribuibles a un evento concreto</p>
            </div>
            <Button size="sm" onClick={openNewIncome}>
              <Plus size={14} /> Añadir ingreso
            </Button>
          </div>
          {incomesLoading ? (
            <p className="text-sm text-gray-400">Cargando ingresos...</p>
          ) : directIncomes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay ingresos directos del proyecto registrados.</p>
              <Button size="sm" className="mt-3" onClick={openNewIncome}>
                <Plus size={14} /> Añadir primer ingreso
              </Button>
            </div>
) : (
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Concepto</th>
                    <th className="text-right pb-2 font-medium">Importe</th>
                    <th className="text-right pb-2 font-medium">IRPF</th>
                    <th className="text-right pb-2 font-medium">Fecha prevista</th>
                    <th className="text-center pb-2 font-medium">Cobrado</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {directIncomes.map((income) => (
                    <tr key={income.id} className="border-b border-gray-50 last:border-0 group">
                      <td className="py-2">
                        <button onClick={() => openEditIncome(income)} className="text-gray-900 hover:text-indigo-600 hover:underline text-left transition-colors">
                          {income.concept}
                        </button>
                      </td>
                      <td className="py-2 text-right font-medium">{formatCurrency(income.amount)}</td>
                      <td className="py-2 text-right text-gray-500">{income.tax_rate}%</td>
                      <td className="py-2 text-right text-gray-500">{formatDate(income.expected_date)}</td>
                      <td className="py-2 text-center">
                        <button onClick={() => handleTogglePaid(income)} className="text-gray-400 hover:text-green-600 transition-colors">
                          {income.is_paid ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} />}
                        </button>
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={() => deleteIncome(income.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
            </div>
          )}
        </Card>

        {/* Gastos directos del proyecto */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Gastos del proyecto</h3>
              <p className="text-xs text-gray-400 mt-0.5">No atribuibles a un evento concreto</p>
            </div>
            <Button size="sm" onClick={openNewExpense}>
              <Plus size={14} /> Añadir gasto
            </Button>
          </div>
          {expensesLoading ? (
            <p className="text-sm text-gray-400">Cargando gastos...</p>
          ) : directExpenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay gastos directos del proyecto registrados.</p>
              <Button size="sm" className="mt-3" onClick={openNewExpense}>
                <Plus size={14} /> Añadir primer gasto
              </Button>
            </div>
) : (
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Concepto</th>
                    <th className="text-right pb-2 font-medium">Importe</th>
                    <th className="text-right pb-2 font-medium">Categoría</th>
                    <th className="text-right pb-2 font-medium">Fecha</th>
                    <th className="text-center pb-2 font-medium">Deducible</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {directExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-50 last:border-0 group">
                      <td className="py-2">
                        <button onClick={() => openEditExpense(expense)} className="text-gray-900 hover:text-indigo-600 hover:underline text-left transition-colors">
                          {expense.concept}
                        </button>
                      </td>
                      <td className="py-2 text-right font-medium">{formatCurrency(expense.amount)}</td>
                      <td className="py-2 text-right text-gray-500 capitalize">{expense.category}</td>
                      <td className="py-2 text-right text-gray-500">{formatDate(expense.expense_date)}</td>
                      <td className="py-2 text-center">
                        {expense.is_deductible
                          ? <CheckCircle size={14} className="text-green-500 mx-auto" />
                          : <Circle size={14} className="text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={() => deleteExpense(expense.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
</tbody>
            </table>
            </div>
          )}
        </Card>

        {project.notes && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Notas</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.notes}</p>
          </Card>
        )}
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Editar proyecto">
        <ProjectForm initialData={project} onSubmit={handleUpdateProject} onCancel={() => setEditModal(false)} loading={savingProject} />
      </Modal>

      <Modal isOpen={incomeModal} onClose={() => setIncomeModal(false)} title={editingIncome ? 'Editar ingreso' : 'Añadir ingreso'}>
        <form onSubmit={handleSubmitIncome} className="flex flex-col gap-4">
          <Input label="Concepto *" value={incomeForm.concept} onChange={(e) => setIncomeForm((p) => ({ ...p, concept: e.target.value }))} placeholder="Producción general" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Importe (€) *" type="number" min="0" step="0.01" value={incomeForm.amount} onChange={(e) => setIncomeForm((p) => ({ ...p, amount: e.target.value }))} required />
            <Input label="Retención IRPF (%)" type="number" min="0" max="100" value={incomeForm.tax_rate} onChange={(e) => setIncomeForm((p) => ({ ...p, tax_rate: e.target.value }))} />
            <Input label="Fecha prevista de cobro" type="date" value={incomeForm.expected_date} onChange={(e) => setIncomeForm((p) => ({ ...p, expected_date: e.target.value }))} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_paid" checked={incomeForm.is_paid} onChange={(e) => setIncomeForm((p) => ({ ...p, is_paid: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="is_paid" className="text-sm text-gray-700">Ya está cobrado</label>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIncomeModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingIncome}>{editingIncome ? 'Guardar cambios' : 'Añadir ingreso'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={expenseModal} onClose={() => setExpenseModal(false)} title={editingExpense ? 'Editar gasto' : 'Añadir gasto'}>
        <form onSubmit={handleSubmitExpense} className="flex flex-col gap-4">
          <Input label="Concepto *" value={expenseForm.concept} onChange={(e) => setExpenseForm((p) => ({ ...p, concept: e.target.value }))} placeholder="Material de producción" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Importe (€) *" type="number" min="0" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))} required />
            <Select label="Categoría" value={expenseForm.category} onChange={(e) => setExpenseForm((p) => ({ ...p, category: e.target.value }))}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <Input label="Fecha *" type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm((p) => ({ ...p, expense_date: e.target.value }))} required />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_deductible" checked={expenseForm.is_deductible} onChange={(e) => setExpenseForm((p) => ({ ...p, is_deductible: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="is_deductible" className="text-sm text-gray-700">Gasto deducible fiscalmente</label>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setExpenseModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingExpense}>{editingExpense ? 'Guardar cambios' : 'Añadir gasto'}</Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
