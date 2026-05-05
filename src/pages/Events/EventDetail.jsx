import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle, Edit, ChevronDown, ExternalLink } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { EventForm } from './EventForm'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useEvents } from '../../hooks/useEvents'
import { useProjects } from '../../hooks/useProjects'
import { useIncomes } from '../../hooks/useIncomes'
import { useExpenses } from '../../hooks/useExpenses'
import { formatCurrency, formatCurrencyPerHour, formatDate, formatDatetime, formatHours } from '../../lib/formatters'
import { normalizeExpenseForm, normalizeIncomeForm } from '../../lib/financeForms'
import { isPaid, markPaid, markUnpaid, paymentDate } from '../../lib/payment'
import { EXPENSE_CATEGORIES } from '../../lib/constants'

const EMPTY_EXPENSE = { concept: '', amount: '', category: 'otros', expense_date: '', is_deductible: true }
const compactSecondaryAction = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#E2D9C2] bg-[#F5EFE0] px-3 py-1.5 text-sm font-medium leading-none text-[#211C18] shadow-sm transition-colors hover:bg-[#EBE3CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'
const compactPrimaryAction = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#C94035] px-3 py-1.5 text-sm font-medium leading-none text-white shadow-sm transition-colors hover:bg-[#A8342B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'
const compactDangerAction = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium leading-none text-[#C94035] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'
const compactGhostInfo = 'inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2'

const getEventHours = (event) => {
  if (!event.end_datetime) return 0
  const minutes = (new Date(event.end_datetime).getTime() - new Date(event.start_datetime).getTime()) / 60000
  return minutes > 0 ? minutes / 60 : 0
}

function QuietStatusBadge({ status }) {
  if (!status || status === 'confirmed') return null
  return <StatusBadge status={status} />
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { events, loading: eventsLoading, error: eventsError, updateEvent, deleteEvent } = useEvents(user?.id)
  const { projects } = useProjects(user?.id)
  const { incomes, loading: incomesLoading, createIncome, updateIncome, deleteIncome } = useIncomes(user?.id, { eventId: id })
  const { expenses, loading: expensesLoading, createExpense, updateExpense, deleteExpense } = useExpenses(user?.id, { eventId: id })
  const { toasts, addToast, removeToast } = useToast()

  const event = events.find((e) => e.id === id)
  const project = event?.project_id ? projects.find((p) => p.id === event.project_id) : null

  const [editModal, setEditModal] = useState(false)
  const [savingEvent, setSavingEvent] = useState(false)

  const defaultTaxRate = profile?.tax_rate ?? 15
  const eventDate = event?.start_datetime ? paymentDate(new Date(event.start_datetime)) : ''
  const createIncomeForm = (overrides = {}) => ({ concept: '', amount: '', tax_rate: defaultTaxRate, expected_date: '', is_paid: false, ...overrides })
  const createExpenseForm = (overrides = {}) => ({ ...EMPTY_EXPENSE, ...overrides })

  const [incomeModal, setIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)
  const [incomeForm, setIncomeForm] = useState(() => createIncomeForm())
  const [savingIncome, setSavingIncome] = useState(false)
  const [quickIncomeModal, setQuickIncomeModal] = useState(false)
  const quickIncomeDefault = () => ({ amount: '', is_paid: true })
  const [quickIncomeForm, setQuickIncomeForm] = useState(() => ({ amount: '', is_paid: true }))

  const [expenseModal, setExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState(() => createExpenseForm())
  const [savingExpense, setSavingExpense] = useState(false)
  const [quickExpenseModal, setQuickExpenseModal] = useState(false)
  const quickExpenseDefault = () => ({ amount: '', category: 'otros' })
  const [quickExpenseForm, setQuickExpenseForm] = useState(() => ({ amount: '', category: 'otros' }))
  const [financialSummaryExpanded, setFinancialSummaryExpanded] = useState(false)

  if (eventsLoading) {
    return (
      <PageWrapper title="Evento">
        <p className="text-sm text-gray-400">Cargando evento...</p>
      </PageWrapper>
    )
  }

  if (!event) {
    return (
      <PageWrapper title="Evento">
        <div className="max-w-xl">
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-900">{eventsError ? 'No hemos podido cargar el evento.' : 'Evento no encontrado.'}</p>
            <p className="text-sm text-gray-500 mt-1">Vuelve al listado para revisar tus eventos disponibles.</p>
            <Link to="/events" className="inline-flex mt-4">
              <Button variant="secondary" size="sm">
                <ArrowLeft size={14} /> Volver a eventos
              </Button>
            </Link>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const totalGross = incomes.reduce((acc, i) => acc + Number(i.amount), 0)
  const paidIncomes = incomes.filter((i) => isPaid(i))
  const totalPaid = paidIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
  const pendingAmount = totalGross - totalPaid
  const totalRetentions = paidIncomes.reduce((acc, i) => acc + Number(i.amount) * (Number(i.tax_rate) / 100), 0)
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0)
  const eventHours = getEventHours(event)
  const grossHourlyRate = eventHours > 0 ? totalPaid / eventHours : 0
  const netProfit = totalPaid - totalRetentions - totalExpenses
  const headerMeta = [
    event.category,
    formatDatetime(event.start_datetime),
    event.end_datetime ? formatDatetime(event.end_datetime) : null,
  ].filter(Boolean)

  const openNewIncome = () => {
    setIncomeForm(createIncomeForm())
    setEditingIncome(null)
    setIncomeModal(true)
  }

  const openQuickIncome = () => {
    setQuickIncomeModal(true)
  }

  const handleQuickSubmitIncome = async (e) => {
    e.preventDefault()
    const amount = parseFloat(quickIncomeForm.amount)
    if (!quickIncomeForm.amount || amount <= 0) {
      addToast('Pon un importe mayor que 0.', 'error')
      return
    }
    const payload = {
      concept: event?.name || 'Ingreso',
      amount: quickIncomeForm.amount,
      tax_rate: defaultTaxRate,
      expected_date: eventDate,
      paid_date: quickIncomeForm.is_paid ? eventDate : null,
      is_paid: quickIncomeForm.is_paid,
    }
    setSavingIncome(true)
    const { error } = await createIncome({ ...payload, event_id: id })
    setSavingIncome(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Ingreso añadido.')
    setQuickIncomeForm(quickIncomeDefault())
    setQuickIncomeModal(false)
  }

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

  const openNewExpense = () => {
    setExpenseForm(createExpenseForm({ expense_date: eventDate }))
    setEditingExpense(null)
    setExpenseModal(true)
  }

  const openQuickExpense = () => {
    setQuickExpenseModal(true)
  }

  const handleQuickSubmitExpense = async (e) => {
    e.preventDefault()
    const amount = parseFloat(quickExpenseForm.amount)
    if (!quickExpenseForm.amount || amount <= 0) {
      addToast('Pon un importe mayor que 0.', 'error')
      return
    }
    const payload = {
      concept: event?.name || 'Gasto',
      amount: quickExpenseForm.amount,
      category: quickExpenseForm.category || 'otros',
      expense_date: eventDate,
      is_deductible: true,
    }
    setSavingExpense(true)
    const { error } = await createExpense({ ...payload, event_id: id })
    setSavingExpense(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Gasto añadido.')
    setQuickExpenseForm(quickExpenseDefault())
    setQuickExpenseModal(false)
  }

  const openEditExpense = (expense) => {
    setEditingExpense(expense)
    setExpenseForm({
      concept: expense.concept,
      amount: expense.amount,
      category: expense.category,
      expense_date: expense.expense_date ?? '',
      is_deductible: expense.is_deductible,
    })
    setExpenseModal(true)
  }

  const handleUpdateEvent = async (formData) => {
    setSavingEvent(true)
    const { error } = await updateEvent(id, formData)
    setSavingEvent(false)
    if (error) { addToast('Error al guardar.', 'error'); return }
    addToast('Evento actualizado.')
    setEditModal(false)
  }

  const handleDeleteEvent = async () => {
    if (!confirm('¿Eliminar este evento? Se borrarán también sus ingresos y gastos.')) return
    const { error } = await deleteEvent(id)
    if (error) { addToast('Error al eliminar.', 'error'); return }
    navigate('/events')
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
      : await createIncome({ ...payload, event_id: id })
    setSavingIncome(false)
    if (error) { addToast('Error al guardar el ingreso.', 'error'); return }
    addToast(editingIncome ? 'Ingreso actualizado.' : 'Ingreso añadido.')
    setIncomeModal(false)
  }

  const handleTogglePaid = async (income) => {
    const currentPayment = { is_paid: income.is_paid, paid_date: income.paid_date ?? null }
    const paymentState = isPaid(income) ? markUnpaid(currentPayment) : markPaid(currentPayment)
    const { error } = await updateIncome(income.id, paymentState)
    if (error) addToast('Error al actualizar el cobro.', 'error')
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
      : await createExpense({ ...payload, event_id: id })
    setSavingExpense(false)
    if (error) { addToast('Error al guardar el gasto.', 'error'); return }
    addToast(editingExpense ? 'Gasto actualizado.' : 'Gasto añadido.')
    setExpenseModal(false)
  }

  return (
    <PageWrapper title={event.name}>
      <div className="flex max-w-4xl flex-col gap-4 sm:gap-5 pb-20 sm:pb-5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 breadcrumbs">
          <Link to="/work" className="hover:text-gray-600">Trabajos</Link>
          <span>/</span>
          <Link to="/work?view=events" className="hover:text-gray-600">Eventos</Link>
          <span>/</span>
          <span className="text-gray-600">{event.name}</span>
        </nav>
        <div className="rounded-2xl border border-[#E9E2D3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 sm:items-start">
              <Link to="/work?view=events" className="mt-1 shrink-0 text-gray-400 hover:text-gray-700" aria-label="Volver a eventos en trabajos">
                <ArrowLeft size={20} />
              </Link>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: event.color ?? '#4f98a3' }} />
                  <h2 className="min-w-0 truncate text-lg font-semibold text-gray-900">{event.name}</h2>
                  <QuietStatusBadge status={event.status} />
                </div>
                {event.client && (
                  <p className="mt-1 text-sm text-gray-500">{event.client}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {formatDatetime(event.start_datetime)}
                  {event.end_datetime && ` – ${formatDatetime(event.end_datetime)}`}
                </p>
                {project && (
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--color-primary-600)]"
                  >
                    {project.name}
                    <ExternalLink size={10} className="text-gray-400" />
                  </Link>
                )}
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 border-t border-gray-200 bg-white px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
              <button type="button" onClick={openQuickIncome} className="flex-1 rounded-lg bg-[var(--color-primary-500)] py-2 text-xs font-medium text-white sm:hidden">
                Cobro
              </button>
              <button type="button" onClick={openQuickExpense} className="flex-1 rounded-lg bg-[var(--color-primary-500)] py-2 text-xs font-medium text-white sm:hidden">
                Gasto
              </button>
              <button type="button" onClick={() => setEditModal(true)} className="flex-1 rounded-lg bg-[#C94035] py-2 text-xs font-medium text-white sm:hidden">
                Editar
              </button>
              <button type="button" onClick={handleDeleteEvent} className="flex-1 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600 sm:hidden">
                Eliminar
              </button>
              {/* Desktop - quick modals */}
              <button type="button" onClick={openQuickIncome} className="hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#C94035] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#A8342B]">
                <Plus size={14} /> Ingreso
              </button>
              <button type="button" onClick={openQuickExpense} className="hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#C94035] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#A8342B]">
                <Plus size={14} /> Gasto
              </button>
              <button type="button" onClick={() => setEditModal(true)} className="hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#E2D9C2] bg-[#F5EFE0] px-3 py-1.5 text-sm font-medium text-[#211C18] shadow-sm hover:bg-[#EBE3CE]">
                <Edit size={14} /> Editar
              </button>
              <button type="button" onClick={handleDeleteEvent} className="hidden sm:inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#C94035] hover:bg-red-50">
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        </div>

        <Card className="bg-gray-50 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setFinancialSummaryExpanded((prev) => !prev)}
            className="mb-3 flex w-full flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          >
            <div className="flex flex-col items-start text-left">
              <h3 className="text-sm font-semibold text-gray-900">Resumen financiero</h3>
              <p className="hidden text-xs text-gray-500 sm:mt-1 sm:block">Lo importante primero. El detalle queda debajo.</p>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
              <p className="text-[11px] text-gray-500 sm:text-xs">Cobrado: {formatCurrency(totalPaid)} · Pendiente: {formatCurrency(pendingAmount)}</p>
              <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform ${financialSummaryExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Cobrado', mobileLabel: 'Cobrado', value: formatCurrency(totalPaid) },
              { label: 'Pendiente', mobileLabel: 'Pend.', value: formatCurrency(pendingAmount) },
              { label: 'Beneficio neto', mobileLabel: 'Neto', value: formatCurrency(netProfit), highlight: true },
            ].map(({ label, mobileLabel, value, highlight }) => (
              <div key={label} className={`rounded-lg border p-2.5 sm:p-4 ${highlight ? 'border-[var(--color-primary-200)] bg-[#fef3f2]' : 'border-gray-200 bg-white'}`}>
                <p className="text-[11px] leading-tight text-gray-500 sm:text-xs">
                  <span className="sm:hidden">{mobileLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </p>
                <p className={`mt-1 text-sm font-semibold leading-tight break-words sm:text-lg ${highlight ? 'text-[var(--color-primary-600)]' : 'text-gray-900'}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className={`${financialSummaryExpanded ? 'mt-3 grid' : 'hidden'} grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
            {[
              { label: 'Ingresos previstos', value: formatCurrency(totalGross) },
              { label: 'IRPF sobre cobrado', value: formatCurrency(totalRetentions) },
              { label: 'Gastos registrados', value: formatCurrency(totalExpenses) },
              { label: 'Cobro bruto/hora', value: eventHours > 0 ? formatCurrencyPerHour(grossHourlyRate) : '—', detail: eventHours > 0 ? `${formatHours(eventHours)} h` : null },
            ].map(({ label, value, detail }) => (
              <div key={label} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{value}</p>
                {detail && <p className="mt-1 text-xs text-gray-400">{detail}</p>}
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

        {/* Ingresos */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Ingresos</h3>
              <p className="mt-1 text-xs text-gray-500">
                {incomes.length} {incomes.length === 1 ? 'registro' : 'registros'} · {formatCurrency(totalGross)}
              </p>
            </div>
            <div className="hidden md:block">
              <button type="button" onClick={openQuickIncome} className={compactPrimaryAction}>
                <Plus size={14} /> Ingreso
              </button>
            </div>
          </div>
          {incomesLoading ? (
            <p className="text-sm text-gray-400">Cargando ingresos...</p>
          ) : incomes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay ingresos registrados para este evento.</p>
            </div>
) : (
            <div className="md:relative md:overflow-x-auto">
              {/* Table visible en desktop */}
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
                {incomes.map((income) => (
                  <tr key={income.id} className="border-b border-gray-50 last:border-0 group">
                    <td className="py-2">
                      <button
                        onClick={() => openEditIncome(income)}
                        className="text-gray-900 hover:text-[var(--color-primary-500)] hover:underline text-left transition-colors"
                      >
                        {income.concept}
                      </button>
                    </td>
                    <td className="py-2 text-right font-medium">{formatCurrency(income.amount)}</td>
                    <td className="py-2 text-right text-gray-500">{income.tax_rate}%</td>
                    <td className="py-2 text-right text-gray-500">{formatDate(income.expected_date)}</td>
                    <td className="py-2 text-center">
                      <button onClick={() => handleTogglePaid(income)} className="text-gray-400 hover:text-green-600 transition-colors">
                        {isPaid(income) ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} />}
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
            {/* Cards colapsables para móvil */}
              <div className="flex flex-col gap-1 md:hidden">
                {incomes.map((income) => (
                  <div
                    key={income.id}
                    onClick={() => openEditIncome(income)}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-900 truncate">{income.concept}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(income.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Gastos */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Gastos</h3>
              <p className="mt-1 text-xs text-gray-500">
                {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'} · {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="hidden md:block">
              <button type="button" onClick={openQuickExpense} className={compactPrimaryAction}>
                <Plus size={14} /> Gasto
              </button>
            </div>
          </div>
          {expensesLoading ? (
            <p className="text-sm text-gray-400">Cargando gastos...</p>
          ) : expenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <p>No hay gastos registrados para este evento.</p>
            </div>
) : (
            <div className="md:relative md:overflow-x-auto">
              {/* Table visible en desktop */}
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
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-50 last:border-0 group">
                      <td className="py-2">
                        <button
                          onClick={() => openEditExpense(expense)}
                          className="text-gray-900 hover:text-[var(--color-primary-500)] hover:underline text-left transition-colors"
                        >
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
{/* Cards minimalistas para móvil */}
              <div className="flex flex-col gap-1 md:hidden">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => openEditExpense(expense)}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-900 truncate">{expense.concept}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {event.notes && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Notas</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.notes}</p>
          </Card>
        )}
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Editar evento">
        <EventForm
          initialData={event}
          projects={projects}
          onSubmit={handleUpdateEvent}
          onCancel={() => setEditModal(false)}
          loading={savingEvent}
        />
      </Modal>

      <Modal isOpen={incomeModal} onClose={() => setIncomeModal(false)} title={editingIncome ? 'Editar ingreso' : 'Añadir ingreso'}>
        <form onSubmit={handleSubmitIncome} className="flex flex-col gap-4">
          <Input
            label="Concepto *"
            value={incomeForm.concept}
            onChange={(e) => setIncomeForm((p) => ({ ...p, concept: e.target.value }))}
            placeholder="Actuación principal"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Importe (€) *"
              type="text"
              inputMode="decimal"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm((p) => ({ ...p, amount: e.target.value }))}
              required
            />
            <Input
              label="Retención IRPF (%)"
              type="text"
              inputMode="decimal"
              value={incomeForm.tax_rate}
              onChange={(e) => setIncomeForm((p) => ({ ...p, tax_rate: e.target.value }))}
            />
            <Input
              label="Fecha prevista de cobro"
              type="date"
              value={incomeForm.expected_date}
              onChange={(e) => setIncomeForm((p) => ({ ...p, expected_date: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_paid" checked={incomeForm.is_paid}
                onChange={(e) => setIncomeForm((p) => ({ ...p, is_paid: e.target.checked }))}
                className="h-5 w-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]" />
              <label htmlFor="is_paid" className="text-sm text-gray-700">Ya está cobrado</label>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIncomeModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingIncome}>
              {editingIncome ? 'Guardar cambios' : 'Añadir ingreso'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={expenseModal} onClose={() => setExpenseModal(false)} title={editingExpense ? 'Editar gasto' : 'Añadir gasto'}>
        <form onSubmit={handleSubmitExpense} className="flex flex-col gap-4">
          <Input
            label="Concepto *"
            value={expenseForm.concept}
            onChange={(e) => setExpenseForm((p) => ({ ...p, concept: e.target.value }))}
            placeholder="Alquiler sala de ensayo"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Importe (€) *"
              type="text"
              inputMode="decimal"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
              required
            />
            <Select
              label="Categoría"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm((p) => ({ ...p, category: e.target.value }))}
            >
              {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <Input
              label="Fecha *"
              type="date"
              value={expenseForm.expense_date}
              onChange={(e) => setExpenseForm((p) => ({ ...p, expense_date: e.target.value }))}
              required
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_deductible" checked={expenseForm.is_deductible}
                onChange={(e) => setExpenseForm((p) => ({ ...p, is_deductible: e.target.checked }))}
                className="h-5 w-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]" />
              <label htmlFor="is_deductible" className="text-sm text-gray-700">Gasto deducible fiscalmente</label>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setExpenseModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={savingExpense}>
              {editingExpense ? 'Guardar cambios' : 'Añadir gasto'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Income Modal */}
      <Modal isOpen={quickIncomeModal} onClose={() => setQuickIncomeModal(false)} title="Cobro rápido">
        <form onSubmit={handleQuickSubmitIncome} className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            Concepto: <span className="font-medium text-gray-900">{event?.name || 'Ingreso'}</span>
          </p>
          <Input
            label="Importe (€)"
            type="text"
            inputMode="decimal"
            value={quickIncomeForm.amount}
            onChange={(e) => setQuickIncomeForm((p) => ({ ...p, amount: e.target.value }))}
            autoFocus
            required
          />
          <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <input
              type="checkbox"
              checked={quickIncomeForm.is_paid}
              onChange={(e) => setQuickIncomeForm((p) => ({ ...p, is_paid: e.target.checked }))}
              className="h-5 w-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
            />
            <span className="text-sm font-medium text-gray-700">Marcar como cobrado</span>
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
            Concepto: <span className="font-medium text-gray-900">{event?.name || 'Gasto'}</span>
          </p>
          <Input
            label="Importe (€)"
            type="text"
            inputMode="decimal"
            value={quickExpenseForm.amount}
            onChange={(e) => setQuickExpenseForm((p) => ({ ...p, amount: e.target.value }))}
            autoFocus
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
