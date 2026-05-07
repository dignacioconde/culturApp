import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle, Edit, CalendarDays, ChevronDown } from 'lucide-react'
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
import { formatCurrency, formatCurrencyPerHour, formatDate, formatDatetime, formatHours, parseDecimal } from '../../lib/formatters'
import { normalizeExpenseForm, normalizeIncomeForm } from '../../lib/financeForms'
import { formatDueDescription, formatDueText, getDueDays } from '../../lib/dueDates'
import { isPaid, markPaid, markUnpaid, needsQuickPaidConfirmation, paymentDate } from '../../lib/payment'
import { EXPENSE_CATEGORIES } from '../../lib/constants'

const EMPTY_EXPENSE = { concept: '', amount: '', category: 'otros', expense_date: '', is_deductible: true }
const compactSecondaryAction = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium leading-none text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-paper-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2'
const compactPrimaryActionDesktop = 'hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[var(--color-red)] px-3 py-1.5 text-sm font-medium leading-none text-white shadow-sm transition-colors hover:bg-[var(--color-red-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2'
const compactSecondaryActionDesktop = 'hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-paper)] px-3 py-1.5 text-sm font-medium leading-none text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-paper-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2'
const compactDangerActionDesktop = 'hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium leading-none text-[var(--color-red)] transition-colors hover:bg-[var(--color-red-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2'
const incomeConceptLabel = (income) => income.concept?.trim() || 'Ingreso sin concepto'
const incomeDueClass = (income) => {
  if (!income.expected_date) return 'text-gray-400'
  const daysLeft = getDueDays(income.expected_date)
  if (daysLeft < 0) return 'font-medium text-red-600'
  if (daysLeft <= 7) return 'text-red-500'
  return 'text-gray-400'
}

const getEventHours = (event) => {
  if (!event.end_datetime) return 0
  const minutes = (new Date(event.end_datetime).getTime() - new Date(event.start_datetime).getTime()) / 60000
  return minutes > 0 ? minutes / 60 : 0
}

function QuietStatusBadge({ status }) {
  if (!status || status === 'confirmed') return null
  return <StatusBadge status={status} />
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
  const emptyIncomeForm = { concept: '', amount: '', tax_rate: defaultTaxRate, expected_date: '', is_paid: false, paid_date: null }

  const [incomeModal, setIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)
  const [incomeForm, setIncomeForm] = useState(emptyIncomeForm)
  const [savingIncome, setSavingIncome] = useState(false)
  const [savingIncomeId, setSavingIncomeId] = useState(null)
  const [pendingPaymentConfirmationIncome, setPendingPaymentConfirmationIncome] = useState(null)
  const [quickIncomeModal, setQuickIncomeModal] = useState(false)
  const quickIncomeDefault = () => ({ amount: '', is_paid: true })
  const [quickIncomeForm, setQuickIncomeForm] = useState(() => ({ amount: '', is_paid: true }))

  const [expenseModal, setExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE)
  const [savingExpense, setSavingExpense] = useState(false)
  const [quickExpenseModal, setQuickExpenseModal] = useState(false)
  const quickExpenseDefault = () => ({ amount: '', category: 'otros' })
  const [quickExpenseForm, setQuickExpenseForm] = useState(() => ({ amount: '', category: 'otros' }))
  const [financialSummaryExpanded, setFinancialSummaryExpanded] = useState(false)

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
  const paidIncomes = incomes.filter((i) => isPaid(i))
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

  const openEditIncome = (income) => {
    setEditingIncome(income)
    setIncomeForm({
      concept: income.concept,
      amount: income.amount,
      tax_rate: income.tax_rate,
      expected_date: income.expected_date ?? '',
      is_paid: isPaid(income),
      paid_date: income.paid_date ?? null,
    })
    setIncomeModal(true)
  }
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
    const { payload, error: validationError } = normalizeIncomeForm(incomeForm, {
      defaultTaxRate,
      existingIncome: editingIncome,
    })
    if (!incomeForm.concept.trim() || validationError === 'amount') {
      addToast('Completa el concepto y un importe mayor que 0.', 'error')
      return
    }
    if (validationError === 'tax_rate') {
      addToast('La retención IRPF debe estar entre 0 y 100.', 'error')
      return
    }
    setSavingIncome(true)
    const { error } = editingIncome
      ? await updateIncome(editingIncome.id, payload)
      : await createIncome({ ...payload, project_id: id })
    setSavingIncome(false)
    if (error) { addToast('Error al guardar el ingreso.', 'error'); return }
    addToast(editingIncome ? 'Ingreso actualizado.' : 'Ingreso añadido.')
    setIncomeModal(false)
  }

  const handleDeleteEditingIncome = async () => {
    if (!editingIncome) return
    if (!confirm('¿Eliminar este ingreso?')) return
    const { error } = await deleteIncome(editingIncome.id)
    if (error) { addToast('Error al eliminar el ingreso.', 'error'); return }
    addToast('Ingreso eliminado.')
    setIncomeModal(false)
  }

  const undoIncomePaid = async (income, previousPayment) => {
    if (!income || savingIncomeId) return

    const paymentState = markUnpaid(previousPayment)
    setSavingIncomeId(income.id)
    try {
      const { error } = await updateIncome(income.id, paymentState)
      if (error) {
        addToast('No se ha podido deshacer el cobro. Revisa el ingreso.', 'error')
        return
      }
      addToast('Cobro devuelto a pendiente.')
    } catch {
      addToast('No se ha podido deshacer el cobro. Revisa el ingreso.', 'error')
    } finally {
      setSavingIncomeId(null)
    }
  }

  const markIncomePaid = async (income) => {
    if (!income || savingIncomeId) return

    const currentPayment = { is_paid: income.is_paid, paid_date: income.paid_date ?? null }
    const paymentState = markPaid(currentPayment)
    setSavingIncomeId(income.id)
    try {
      const { error } = await updateIncome(income.id, paymentState)
      if (error) {
        addToast('Error al actualizar el cobro.', 'error')
        return
      }
      addToast('Cobro marcado como cobrado.', 'success', {
        actionLabel: 'Deshacer',
        dismissLabel: 'Aceptar',
        duration: 5000,
        onAction: () => undoIncomePaid(income, currentPayment),
      })
      setPendingPaymentConfirmationIncome(null)
    } catch {
      addToast('Error al actualizar el cobro.', 'error')
    } finally {
      setSavingIncomeId(null)
    }
  }

  const markIncomeUnpaid = async (income) => {
    if (!income || savingIncomeId) return

    const currentPayment = { is_paid: income.is_paid, paid_date: income.paid_date ?? null }
    const paymentState = markUnpaid(currentPayment)
    setSavingIncomeId(income.id)
    try {
      const { error } = await updateIncome(income.id, paymentState)
      if (error) {
        addToast('Error al actualizar el cobro.', 'error')
        return
      }
      addToast('Cobro devuelto a pendiente.')
    } catch {
      addToast('Error al actualizar el cobro.', 'error')
    } finally {
      setSavingIncomeId(null)
    }
  }

  const handleTogglePaid = async (income) => {
    if (savingIncomeId) return
    if (isPaid(income)) {
      markIncomeUnpaid(income)
      return
    }
    if (needsQuickPaidConfirmation(income)) {
      setPendingPaymentConfirmationIncome(income)
      return
    }
    markIncomePaid(income)
  }

  const handleSubmitExpense = async (e) => {
    e.preventDefault()
    const { payload, error: validationError } = normalizeExpenseForm(expenseForm)
    if (!expenseForm.concept.trim() || validationError === 'amount') {
      addToast('Completa el concepto y un importe mayor que 0.', 'error')
      return
    }
    setSavingExpense(true)
    const { error } = editingExpense
      ? await updateExpense(editingExpense.id, payload)
      : await createExpense({ ...payload, project_id: id })
    setSavingExpense(false)
    if (error) { addToast('Error al guardar el gasto.', 'error'); return }
    addToast(editingExpense ? 'Gasto actualizado.' : 'Gasto añadido.')
    setExpenseModal(false)
  }

  const handleDeleteEditingExpense = async () => {
    if (!editingExpense) return
    if (!confirm('¿Eliminar este gasto?')) return
    const { error } = await deleteExpense(editingExpense.id)
    if (error) { addToast('Error al eliminar el gasto.', 'error'); return }
    addToast('Gasto eliminado.')
    setExpenseModal(false)
  }

  const handleQuickSubmitIncome = async (e) => {
    e.preventDefault()
    const amount = parseDecimal(quickIncomeForm.amount)
    if (amount === null || amount <= 0) {
      addToast('Pon un importe mayor que 0.', 'error')
      return
    }
    const projectDate = project?.start_date || ''
    const payload = {
      concept: project?.name || 'Ingreso',
      amount,
      tax_rate: defaultTaxRate,
      expected_date: projectDate,
      paid_date: quickIncomeForm.is_paid ? paymentDate(new Date()) : null,
      is_paid: quickIncomeForm.is_paid,
    }
    setSavingIncome(true)
    const { error } = await createIncome({ ...payload, project_id: id })
    setSavingIncome(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Ingreso añadido.')
    setQuickIncomeForm(quickIncomeDefault())
    setQuickIncomeModal(false)
  }

  const handleQuickSubmitExpense = async (e) => {
    e.preventDefault()
    const amount = parseFloat(quickExpenseForm.amount)
    if (!quickExpenseForm.amount || amount <= 0) {
      addToast('Pon un importe mayor que 0.', 'error')
      return
    }
    const projectDate = project?.start_date || ''
    const payload = {
      concept: project?.name || 'Gasto',
      amount: quickExpenseForm.amount,
      category: quickExpenseForm.category || 'otros',
      expense_date: projectDate,
      is_deductible: true,
    }
    setSavingExpense(true)
    const { error } = await createExpense({ ...payload, project_id: id })
    setSavingExpense(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Gasto añadido.')
    setQuickExpenseForm(quickExpenseDefault())
    setQuickExpenseModal(false)
  }

  return (
    <PageWrapper title={project.name}>
      <div className="flex max-w-4xl flex-col gap-4 sm:gap-5 pb-20 sm:pb-5">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] breadcrumbs">
          <Link to="/work" className="hover:text-[var(--color-ink)]">Trabajos</Link>
          <span>/</span>
          <Link to="/work?view=projects" className="hover:text-[var(--color-ink)]">Proyectos</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)]">{project.name}</span>
        </nav>
        <div className="rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 sm:items-start">
              <Link to="/work?view=projects" className="mt-1 shrink-0 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]" aria-label="Volver a proyectos en trabajos">
                <ArrowLeft size={20} />
              </Link>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
                  <h2 className="min-w-0 truncate text-lg font-semibold text-[var(--color-ink)]">{project.name}</h2>
                  <QuietStatusBadge status={project.status} />
                </div>
                {project.client && (
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{project.client}</p>
                )}
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  {project.category} · {formatDate(project.start_date)}{project.end_date && ` – ${formatDate(project.end_date)}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-[var(--color-surface-alt)] p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setFinancialSummaryExpanded((prev) => !prev)}
            className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
          >
            <div className="flex flex-col items-start text-left">
              <h3 className="text-sm font-semibold text-[var(--color-ink)]">Resumen financiero</h3>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">Incluye ingresos y gastos directos del proyecto y sus eventos.</p>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
              <p className="text-xs text-[var(--color-ink-muted)]">Cobrado: {formatCurrency(totalPaid)} · Pendiente: {formatCurrency(pendingAmount)}</p>
              <ChevronDown size={16} className={`shrink-0 text-[var(--color-ink-muted)] transition-transform ${financialSummaryExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Cobrado', mobileLabel: 'Cobrado', value: formatCurrency(totalPaid) },
              { label: 'Pendiente', mobileLabel: 'Pend.', value: formatCurrency(pendingAmount) },
              { label: 'Beneficio neto', mobileLabel: 'Neto', value: formatCurrency(netProfit), highlight: true },
            ].map(({ label, mobileLabel, value, highlight }) => (
              <div key={label} className={`rounded-lg border p-2.5 sm:p-4 ${highlight ? 'border-[var(--color-primary-200)] bg-[var(--color-red-light)]' : 'border-[var(--color-paper-mid)] bg-[var(--color-surface)]'}`}>
                <p className="text-[11px] leading-tight text-[var(--color-ink-muted)] sm:text-xs">
                  <span className="sm:hidden">{mobileLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </p>
                <p className={`mt-1 text-sm font-semibold leading-tight break-words sm:text-lg ${highlight ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-ink)]'}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className={`${financialSummaryExpanded ? 'mt-3 grid' : 'hidden'} grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
          {[
            { label: 'Ingresos previstos', value: formatCurrency(totalGross) },
            { label: 'IRPF sobre cobrado', value: formatCurrency(totalRetentions) },
            { label: 'Gastos registrados', value: formatCurrency(totalExpenses) },
            { label: 'Cobro bruto/hora', value: projectHours > 0 ? formatCurrencyPerHour(grossHourlyRate) : '—', detail: projectHours > 0 ? `Solo eventos cobrados · ${formatHours(projectHours)} h` : 'Sin eventos cobrados' },
          ].map(({ label, value, detail }) => (
            <div key={label} className="rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] p-4">
              <p className="text-xs text-[var(--color-ink-muted)]">{label}</p>
              <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">{value}</p>
              {detail && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{detail}</p>}
            </div>
          ))}
          </div>
          <button
            type="button"
            onClick={() => setFinancialSummaryExpanded((prev) => !prev)}
            className="mt-3 text-xs font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
          >
            {financialSummaryExpanded ? 'Ocultar detalle financiero' : 'Ver detalle financiero'}
          </button>
        </Card>

        {/* Eventos asociados */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[var(--color-primary-500)]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Eventos asociados</h3>
                <p className="text-xs text-gray-500 mt-1">Ocurrencias concretas dentro de este proyecto.</p>
              </div>
            </div>
            <Link to={`/events?project=${id}`} className={compactSecondaryAction}>
              <Plus size={14} /> Nuevo evento
            </Link>
          </div>
          {eventsLoading ? (
            <p className="text-sm text-gray-400">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay eventos asociados a este proyecto todavía.</p>
              <Link to={`/events?project=${id}`} className={`${compactSecondaryAction} mt-3`}>
                <Plus size={14} /> Crear evento
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="-mx-2 flex min-w-0 items-center justify-between gap-3 rounded-lg border-b border-gray-100 px-2 py-2 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.color ?? '#4f98a3' }} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-400">{formatDatetime(event.start_datetime)}</p>
                    </div>
                  </div>
                  <QuietStatusBadge status={event.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Ingresos directos del proyecto */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Ingresos del proyecto</h3>
              <p className="text-xs text-gray-400 mt-0.5">No atribuibles a un evento concreto</p>
            </div>
          </div>
          {incomesLoading ? (
            <p className="text-sm text-gray-400">Cargando ingresos...</p>
          ) : directIncomes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay ingresos directos del proyecto registrados.</p>
            </div>
) : (
            <div className="md:relative md:overflow-x-auto">
              <table className="hidden md:table w-full min-w-[680px] text-sm">
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
                  {directIncomes.map((income) => {
                    const isSaving = savingIncomeId === income.id
                    return (
                      <tr key={income.id} className="border-b border-gray-50 last:border-0 group">
                        <td className="py-2">
                          <button onClick={() => openEditIncome(income)} className="text-gray-900 hover:text-[var(--color-primary-500)] hover:underline text-left transition-colors">
                            {incomeConceptLabel(income)}
                          </button>
                        </td>
                        <td className="py-2 text-right font-medium">{formatCurrency(income.amount)}</td>
                        <td className="py-2 text-right text-gray-500">{income.tax_rate}%</td>
                        <td className="py-2 text-right">
                          {isPaid(income) ? (
                            <p className="font-medium text-[#2D6A4F]">Cobrado</p>
                          ) : (
                            <>
                              <p className={incomeDueClass(income)}>{formatDueText(income.expected_date)}</p>
                              {income.expected_date && <p className="text-xs text-gray-400">{formatDate(income.expected_date)}</p>}
                            </>
                          )}
                        </td>
                        <td className="py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePaid(income)}
                            disabled={Boolean(savingIncomeId)}
                            aria-label={`${isPaid(income) ? 'Marcar como pendiente' : 'Marcar como cobrado'} ${incomeConceptLabel(income)}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#F4FBF7] hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                          >
                            {isSaving
                              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D6A4F] border-t-transparent" />
                              : isPaid(income) ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} />}
                          </button>
                        </td>
                        <td className="py-2 text-right">
                          <button onClick={() => deleteIncome(income.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* Minimalista para móvil */}
              <div className="md:hidden flex flex-col gap-1">
                {directIncomes.map((income) => {
                  const isSaving = savingIncomeId === income.id
                  return (
                    <div key={income.id} className="flex items-center justify-between gap-2 border-b border-[var(--color-paper-mid)] py-2 last:border-0">
                      <button
                        type="button"
                        onClick={() => openEditIncome(income)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate text-sm font-medium text-[var(--color-ink)]">{incomeConceptLabel(income)}</span>
                        <span className={`mt-0.5 block text-xs ${isPaid(income) ? 'text-[var(--color-green)]' : incomeDueClass(income)}`}>
                          {isPaid(income) ? 'Cobrado' : formatDueDescription(income.expected_date)}
                        </span>
                      </button>
                      <span className="shrink-0 text-sm font-semibold text-[var(--color-ink)]">{formatCurrency(income.amount)}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePaid(income)}
                        disabled={Boolean(savingIncomeId)}
                        aria-label={`${isPaid(income) ? 'Marcar como pendiente' : 'Marcar como cobrado'} ${incomeConceptLabel(income)}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--color-green)] transition-colors hover:bg-[var(--color-green-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-[var(--color-ink-muted)] disabled:hover:bg-transparent"
                      >
                        {isSaving
                          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D6A4F] border-t-transparent" />
                          : isPaid(income) ? <CheckCircle size={18} /> : <Circle size={18} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Gastos directos del proyecto */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Gastos del proyecto</h3>
              <p className="text-xs text-gray-400 mt-0.5">No atribuibles a un evento concreto</p>
            </div>
          </div>
          {expensesLoading ? (
            <p className="text-sm text-gray-400">Cargando gastos...</p>
          ) : directExpenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay gastos directos del proyecto registrados.</p>
            </div>
) : (
            <div className="md:relative md:overflow-x-auto">
              <table className="hidden md:table w-full min-w-[640px] text-sm">
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
                        <button onClick={() => openEditExpense(expense)} className="text-gray-900 hover:text-[var(--color-primary-500)] hover:underline text-left transition-colors">
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
              {/* Minimalista para móvil */}
              <div className="md:hidden flex flex-col gap-1">
                {directExpenses.map((expense) => (
                  <button key={expense.id} type="button" onClick={() => openEditExpense(expense)} className="flex items-center justify-between gap-3 border-b border-[var(--color-paper-mid)] py-2 text-left last:border-0">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--color-ink)]">{expense.concept}</span>
                      <span className="mt-0.5 block truncate text-xs capitalize text-[var(--color-ink-muted)]">
                        {expense.category} · {formatDate(expense.expense_date)}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-[var(--color-ink)]">{formatCurrency(expense.amount)}</span>
                  </button>
                ))}
              </div>
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
        <form onSubmit={handleSubmitIncome} className="flex flex-col gap-3">
          <Input label="Concepto *" value={incomeForm.concept} onChange={(e) => setIncomeForm((p) => ({ ...p, concept: e.target.value }))} placeholder="Producción general" required />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Importe (€) *" type="text" inputMode="decimal" value={incomeForm.amount} onChange={(e) => setIncomeForm((p) => ({ ...p, amount: e.target.value }))} required />
            <Input label="Retención IRPF (%)" type="text" inputMode="decimal" value={incomeForm.tax_rate} onChange={(e) => setIncomeForm((p) => ({ ...p, tax_rate: e.target.value }))} />
            <Input label="Fecha prevista de cobro" type="date" value={incomeForm.expected_date} onChange={(e) => setIncomeForm((p) => ({ ...p, expected_date: e.target.value, paid_date: p.is_paid && !p.paid_date ? e.target.value : p.paid_date }))} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_paid" checked={incomeForm.is_paid} onChange={(e) => setIncomeForm((p) => ({ ...p, is_paid: e.target.checked, paid_date: e.target.checked ? (p.paid_date ?? p.expected_date ?? '') : null }))} className="h-5 w-5 rounded border-[var(--color-paper-mid)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]" />
              <label htmlFor="is_paid" className="text-sm text-[var(--color-ink)]">Ya está cobrado</label>
            </div>
            {incomeForm.is_paid && (
              <Input label="Fecha real de cobro" type="date" value={incomeForm.paid_date ?? ''} onChange={(e) => setIncomeForm((p) => ({ ...p, paid_date: e.target.value }))} />
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {editingIncome && (
              <Button type="button" variant="ghost" onClick={handleDeleteEditingIncome} className="justify-center text-[var(--color-red)] hover:bg-[var(--color-red-light)]">
                Eliminar
              </Button>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setIncomeModal(false)}>Cancelar</Button>
              <Button type="submit" disabled={savingIncome}>{editingIncome ? 'Guardar cambios' : 'Añadir ingreso'}</Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(pendingPaymentConfirmationIncome)}
        onClose={() => {
          if (!savingIncomeId) setPendingPaymentConfirmationIncome(null)
        }}
        title="Confirmar cobro"
      >
        {pendingPaymentConfirmationIncome && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Este ingreso tiene un concepto poco claro. Confirma que quieres marcarlo como cobrado.
            </p>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">{incomeConceptLabel(pendingPaymentConfirmationIncome)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(pendingPaymentConfirmationIncome.expected_date)} · {formatCurrency(pendingPaymentConfirmationIncome.amount)}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPendingPaymentConfirmationIncome(null)}
                disabled={savingIncomeId === pendingPaymentConfirmationIncome.id}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => markIncomePaid(pendingPaymentConfirmationIncome)}
                disabled={savingIncomeId === pendingPaymentConfirmationIncome.id}
              >
                {savingIncomeId === pendingPaymentConfirmationIncome.id ? 'Guardando...' : 'Marcar cobrado'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={expenseModal} onClose={() => setExpenseModal(false)} title={editingExpense ? 'Editar gasto' : 'Añadir gasto'}>
        <form onSubmit={handleSubmitExpense} className="flex flex-col gap-3">
          <Input label="Concepto *" value={expenseForm.concept} onChange={(e) => setExpenseForm((p) => ({ ...p, concept: e.target.value }))} placeholder="Material de producción" required />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Importe (€) *" type="text" inputMode="decimal" value={expenseForm.amount} onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))} required />
            <Select label="Categoría" value={expenseForm.category} onChange={(e) => setExpenseForm((p) => ({ ...p, category: e.target.value }))}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <Input label="Fecha *" type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm((p) => ({ ...p, expense_date: e.target.value }))} required />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_deductible" checked={expenseForm.is_deductible} onChange={(e) => setExpenseForm((p) => ({ ...p, is_deductible: e.target.checked }))} className="h-5 w-5 rounded border-[var(--color-paper-mid)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]" />
              <label htmlFor="is_deductible" className="text-sm text-[var(--color-ink)]">Gasto deducible fiscalmente</label>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {editingExpense && (
              <Button type="button" variant="ghost" onClick={handleDeleteEditingExpense} className="justify-center text-[var(--color-red)] hover:bg-[var(--color-red-light)]">
                Eliminar
              </Button>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setExpenseModal(false)}>Cancelar</Button>
              <Button type="submit" disabled={savingExpense}>{editingExpense ? 'Guardar cambios' : 'Añadir gasto'}</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Bottom bar para móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 border-t border-[var(--color-paper-mid)] bg-[var(--color-surface)] px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <button type="button" onClick={() => setQuickIncomeModal(true)} className="flex-1 rounded-lg bg-[var(--color-red)] py-2 text-xs font-medium text-white sm:hidden">
          Cobro
        </button>
        <button type="button" onClick={() => setQuickExpenseModal(true)} className="flex-1 rounded-lg bg-[var(--color-red)] py-2 text-xs font-medium text-white sm:hidden">
          Gasto
        </button>
        <button type="button" onClick={() => setEditModal(true)} className="flex-1 rounded-lg bg-[var(--color-red)] py-2 text-xs font-medium text-white sm:hidden">
          Editar
        </button>
        <button type="button" onClick={handleDeleteProject} className="flex-1 rounded-lg border border-[var(--color-red-light)] py-2 text-xs font-medium text-[var(--color-red)] sm:hidden">
          Eliminar
        </button>
        {/* Desktop - quick modals */}
        <button type="button" onClick={() => setQuickIncomeModal(true)} className={compactPrimaryActionDesktop}>
          <Plus size={14} /> Ingreso
        </button>
        <button type="button" onClick={() => setQuickExpenseModal(true)} className={compactPrimaryActionDesktop}>
          <Plus size={14} /> Gasto
        </button>
        <button type="button" onClick={() => setEditModal(true)} className={compactSecondaryActionDesktop}>
          <Edit size={14} /> Editar
        </button>
        <button type="button" onClick={handleDeleteProject} className={compactDangerActionDesktop}>
          <Trash2 size={14} /> Eliminar
        </button>
      </div>

      {/* Quick Income Modal */}
      <Modal isOpen={quickIncomeModal} onClose={() => setQuickIncomeModal(false)} title="Cobro rápido">
        <form onSubmit={handleQuickSubmitIncome} className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            Concepto: <span className="font-medium text-gray-900">{project?.name || 'Ingreso'}</span>
          </p>
          <Input
            label="Importe (€)"
            type="text"
            inputMode="decimal"
            value={quickIncomeForm.amount}
            onChange={(e) => setQuickIncomeForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />
          <label className="flex items-center gap-3 rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface-alt)] p-3">
            <input
              type="checkbox"
              checked={quickIncomeForm.is_paid}
              onChange={(e) => setQuickIncomeForm((p) => ({ ...p, is_paid: e.target.checked }))}
              className="h-5 w-5 rounded border-[var(--color-paper-mid)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
            />
            <span className="text-sm font-medium text-[var(--color-ink)]">Marcar como cobrado</span>
          </label>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setQuickIncomeModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingIncome}>Guardar</Button>
          </div>
        </form>
      </Modal>

      {/* Quick Expense Modal */}
      <Modal isOpen={quickExpenseModal} onClose={() => setQuickExpenseModal(false)} title="Gasto rápido">
        <form onSubmit={handleQuickSubmitExpense} className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            Concepto: <span className="font-medium text-gray-900">{project?.name || 'Gasto'}</span>
          </p>
          <Input
            label="Importe (€)"
            type="text"
            inputMode="decimal"
            value={quickExpenseForm.amount}
            onChange={(e) => setQuickExpenseForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />
          <Select
            label="Categoría"
            value={quickExpenseForm.category}
            onChange={(e) => setQuickExpenseForm((p) => ({ ...p, category: e.target.value }))}
          >
            {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setQuickExpenseModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingExpense}>Guardar</Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
