import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { AlertCircle, CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Clock, FolderOpen, Wallet } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { KpiCard } from './KpiCard'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { useIncomes } from '../../hooks/useIncomes'
import { formatCurrency, formatDate } from '../../lib/formatters'
import { getCashMonthSummary, getWorkKpis, getWorkSections, getWorkSummaries } from '../../lib/dashboardFinance'
import { formatDueText, getDueDays } from '../../lib/dueDates'
import { markPaid, markUnpaid, needsQuickPaidConfirmation } from '../../lib/payment'

const YEARS = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i)

dayjs.locale('es')

const incomeConceptLabel = (income) => income.concept?.trim() || 'Ingreso sin concepto'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const { events, loading: eventsLoading, error: eventsError } = useEvents(user?.id)
  const { incomes, loading: incomesLoading, error: incomesError, updateIncome } = useIncomes(user?.id)
  const { toasts, addToast, removeToast } = useToast()

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [view, setView] = useState('cash')
  const [savingIncomeId, setSavingIncomeId] = useState(null)
  const [pendingConfirmationIncome, setPendingConfirmationIncome] = useState(null)

  const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD')
  const endOfMonth = selectedDate.endOf('month').format('YYYY-MM-DD')
  const selectedMonthLabel = selectedDate.format('MMMM YYYY')
  const today = dayjs().format('YYYY-MM-DD')

  const prevMonth = () => setSelectedDate((d) => d.subtract(1, 'month'))
  const nextMonth = () => setSelectedDate((d) => d.add(1, 'month'))

  const cashKpis = useMemo(() =>
    getCashMonthSummary(incomes, { startOfMonth, endOfMonth, today })
  , [incomes, startOfMonth, endOfMonth, today])

  const pendingIncomes = useMemo(() =>
    [...cashKpis.plannedOverdue, ...cashKpis.plannedPending]
      .sort((a, b) => a.expected_date.localeCompare(b.expected_date))
  , [cashKpis.plannedOverdue, cashKpis.plannedPending])
  const works = useMemo(() =>
    getWorkSummaries({ projects, events, incomes, startOfMonth, endOfMonth, today })
  , [projects, events, incomes, startOfMonth, endOfMonth, today])

  const workKpis = useMemo(() => getWorkKpis(works), [works])
  const workSections = useMemo(() => getWorkSections(works, { endOfMonth }), [works, endOfMonth])

  const navigateToIncome = (income) => {
    if (income.event_id) navigate(`/events/${income.event_id}`)
    else if (income.project_id) navigate(`/projects/${income.project_id}`)
  }

  const undoPendingIncomePaid = async (income, previousPayment) => {
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

  const markPendingIncomePaid = async (income) => {
    if (!income || savingIncomeId) return

    const currentPayment = { is_paid: income.is_paid, paid_date: income.paid_date ?? null }
    const paymentState = markPaid(currentPayment)

    setSavingIncomeId(income.id)
    try {
      const { error } = await updateIncome(income.id, paymentState)
      if (error) {
        addToast('No se ha podido marcar el cobro. Vuelve a intentarlo.', 'error')
        return
      }
      addToast('Cobro marcado como cobrado.', 'success', {
        actionLabel: 'Deshacer',
        dismissLabel: 'Aceptar',
        duration: 5000,
        onAction: () => undoPendingIncomePaid(income, currentPayment),
      })
      setPendingConfirmationIncome(null)
    } catch {
      addToast('No se ha podido marcar el cobro. Vuelve a intentarlo.', 'error')
    } finally {
      setSavingIncomeId(null)
    }
  }

  const requestMarkPendingIncomePaid = (income) => {
    if (savingIncomeId) return
    if (needsQuickPaidConfirmation(income)) {
      setPendingConfirmationIncome(income)
      return
    }
    markPendingIncomePaid(income)
  }

  const loading = projectsLoading || eventsLoading || incomesLoading
  const error = projectsError || eventsError || incomesError

  return (
    <PageWrapper title="Dashboard">
      <div className="flex flex-col gap-6">

        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem_6.5rem] items-center gap-2 sm:flex sm:gap-1">
              <button onClick={prevMonth} className="flex min-h-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Mes anterior">
                <ChevronLeft size={18} />
              </button>
              <span className="min-w-0 truncate text-center text-sm font-medium capitalize text-gray-900 sm:min-w-[130px]">
                {selectedMonthLabel}
              </span>
              <button onClick={nextMonth} className="flex min-h-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Mes siguiente">
                <ChevronRight size={18} />
              </button>
              <Select
                value={selectedDate.year()}
                onChange={(e) => setSelectedDate((d) => d.year(Number(e.target.value)))}
                className="min-h-11 py-2 text-sm sm:ml-2 sm:min-h-0 sm:py-1 sm:text-xs"
                aria-label="Año"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>

            <div className="flex self-start overflow-hidden rounded-lg border border-gray-200 text-sm">
              <button
                onClick={() => setView('cash')}
                className={`min-h-[44px] px-3 py-2 transition-colors sm:min-h-[unset] sm:px-2.5 sm:py-1.5 ${view === 'cash' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Caja del mes
              </button>
              <button
                onClick={() => setView('work')}
                className={`min-h-[44px] border-l border-gray-200 px-3 py-2 transition-colors sm:min-h-[unset] sm:px-2.5 sm:py-1.5 ${view === 'work' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Trabajos
              </button>
            </div>
          </div>
        </Card>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>No se han podido cargar todos los datos del dashboard. Revisa la conexión y vuelve a intentarlo.</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 animate-pulse sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-gray-200" />
                    <div className="h-6 w-full rounded bg-gray-200" />
                    <div className="h-2.5 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === 'cash' ? (
          <>
            <Card className="p-4 md:hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">A cobrar en {selectedMonthLabel}</p>
                  <p className="mt-1 text-3xl font-semibold leading-tight text-[#211C18]">{formatCurrency(cashKpis.plannedTotal)}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {cashKpis.planned.length} ingreso{cashKpis.planned.length === 1 ? '' : 's'} previsto{cashKpis.planned.length === 1 ? '' : 's'} o arrastrado{cashKpis.planned.length === 1 ? '' : 's'}
                  </p>
                </div>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FDF5E4] text-[#D4921A]">
                  <CalendarDays size={19} />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                <div>
                  <p className="text-[11px] text-gray-500">Cobrado</p>
                  <p className="truncate text-sm font-semibold text-[#2D6A4F]">{formatCurrency(cashKpis.plannedPaidTotal)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500">Pendiente</p>
                  <p className="truncate text-sm font-semibold text-gray-900">{formatCurrency(cashKpis.plannedPendingTotal)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500">Vencido</p>
                  <p className={`truncate text-sm font-semibold ${cashKpis.plannedOverdueTotal > 0 ? 'text-[#C94035]' : 'text-gray-900'}`}>{formatCurrency(cashKpis.plannedOverdueTotal)}</p>
                </div>
              </div>
              {cashKpis.plannedTotal > 0 && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E2D9C2]">
                  <div
                    className="h-full rounded-full bg-[#2D6A4F]"
                    style={{ width: `${Math.min(Math.max(cashKpis.plannedPaidTotal / cashKpis.plannedTotal, 0), 1) * 100}%` }}
                  />
                </div>
              )}
            </Card>
            <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title={`A cobrar en ${selectedMonthLabel}`}
                value={formatCurrency(cashKpis.plannedTotal)}
                subtitle={`${cashKpis.planned.length} ingreso${cashKpis.planned.length === 1 ? '' : 's'} previsto${cashKpis.planned.length === 1 ? '' : 's'} o arrastrado${cashKpis.planned.length === 1 ? '' : 's'}`}
                icon={CalendarDays}
                color="amber"
              />
              <KpiCard
                title="Cobrado del plan"
                value={formatCurrency(cashKpis.plannedPaidTotal)}
                subtitle={`${cashKpis.plannedPaid.length} cobro${cashKpis.plannedPaid.length === 1 ? '' : 's'} marcado${cashKpis.plannedPaid.length === 1 ? '' : 's'}`}
                icon={Wallet}
                color="green"
                progress={cashKpis.plannedTotal > 0 ? cashKpis.plannedPaidTotal / cashKpis.plannedTotal : 0}
              />
              <KpiCard
                title="Pendiente"
                value={formatCurrency(cashKpis.plannedPendingTotal)}
                subtitle={`${cashKpis.plannedPending.length} cobro${cashKpis.plannedPending.length === 1 ? '' : 's'} por llegar`}
                icon={Clock}
                color="amber"
              />
              <KpiCard
                title="Vencido"
                value={formatCurrency(cashKpis.plannedOverdueTotal)}
                subtitle={cashKpis.plannedOverdue.length > 0 ? `${cashKpis.plannedOverdue.length} pago${cashKpis.plannedOverdue.length === 1 ? '' : 's'} por perseguir` : 'Sin vencidos'}
                icon={AlertCircle}
                color={cashKpis.plannedOverdueTotal > 0 ? 'red' : 'green'}
              />
            </div>
          </>
        ) : (
          <>
            <Card className="p-3.5 md:hidden">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#FDF5E4] text-[#D4921A]">
                  <FolderOpen size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-gray-500">Ahora mismo</p>
                      <p className="mt-0.5 truncate text-2xl font-semibold leading-tight text-[#211C18]">{formatCurrency(workKpis.pendingTotal)}</p>
                    </div>
                    <p className="flex-shrink-0 text-[11px] text-gray-400">
                      {workKpis.debtWorks} con deuda
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#FFF5F3] px-2 py-1 text-[11px] font-medium text-[#C94035]">
                      Vencido {formatCurrency(workKpis.overdueTotal)}
                    </span>
                    <span className="rounded-full bg-[#F4FBF7] px-2 py-1 text-[11px] font-medium text-[#2D6A4F]">
                      Cobrado {formatCurrency(workKpis.paidTotal)}
                    </span>
                    <span className="rounded-full bg-[#F8F6EF] px-2 py-1 text-[11px] font-medium text-gray-700">
                      {selectedMonthLabel}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Trabajos con deuda"
                value={workKpis.debtWorks}
                subtitle="Con al menos un cobro pendiente"
                icon={FolderOpen}
                color={workKpis.debtWorks > 0 ? 'amber' : 'green'}
              />
              <KpiCard
                title="Pendiente total"
                value={formatCurrency(workKpis.pendingTotal)}
                subtitle="En trabajos relevantes"
                icon={Clock}
                color="amber"
              />
              <KpiCard
                title="Vencido total"
                value={formatCurrency(workKpis.overdueTotal)}
                subtitle={workKpis.overdueTotal > 0 ? 'Pagos por perseguir' : 'Sin vencidos'}
                icon={AlertCircle}
                color={workKpis.overdueTotal > 0 ? 'red' : 'green'}
              />
              <KpiCard
                title="Cobrado asociado"
                value={formatCurrency(workKpis.paidTotal)}
                subtitle={`Plan de ${selectedMonthLabel}`}
                icon={Wallet}
                color="green"
              />
            </div>
          </>
        )}

        {view === 'cash' && (
          <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="p-4">
              <div className="mb-3 flex flex-col gap-1 border-b border-gray-100 pb-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Cobrado realmente este mes: <span className="font-semibold text-gray-900">{formatCurrency(cashKpis.paidByCashDateTotal)}</span>
                </p>
                {cashKpis.paidMissingDateCount > 0 && (
                  <p className="text-amber-600">
                    {cashKpis.paidMissingDateCount} cobro{cashKpis.paidMissingDateCount === 1 ? '' : 's'} sin fecha real
                  </p>
                )}
              </div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <h2 className="text-sm font-semibold text-gray-900">Próximos cobros</h2>
              </div>
              <span className="text-xs text-gray-400 capitalize">{selectedMonthLabel}</span>
            </div>
            {pendingIncomes.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">Sin cobros próximos ni vencidos</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {pendingIncomes.slice(0, 6).map((income) => {
                  const daysLeft = getDueDays(income.expected_date)
                  const isOverdue = daysLeft < 0
                  const isUrgent = daysLeft <= 7
                  const isSaving = savingIncomeId === income.id
                  return (
                    <div key={income.id} className="flex items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-gray-50">
                      <button
                        type="button"
                        onClick={() => navigateToIncome(income)}
                        className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{incomeConceptLabel(income)}</p>
                          <p className={`text-xs ${isOverdue ? 'font-medium text-red-600' : isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                            {formatDueText(income.expected_date)} · {formatDate(income.expected_date)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(income.amount)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => requestMarkPendingIncomePaid(income)}
                        disabled={Boolean(savingIncomeId)}
                        aria-label={`Marcar como cobrado ${incomeConceptLabel(income)}`}
                        title="Marcar como cobrado"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#2D6A4F] transition-colors hover:bg-[#F4FBF7] hover:text-[#1F5A42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                      >
                        {isSaving
                          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D6A4F] border-t-transparent" />
                          : <CheckCircle size={18} />}
                      </button>
                    </div>
                  )
                })}
                {pendingIncomes.length > 6 && (
                  <p className="pt-2 text-center text-xs text-gray-400">+ {pendingIncomes.length - 6} más</p>
                )}
              </div>
            )}
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle size={16} className={cashKpis.accumulatedOverdueTotal > 0 ? 'text-red-500' : 'text-gray-300'} />
                <h2 className="text-sm font-semibold text-gray-900">Vencidos anteriores incluidos</h2>
              </div>
              {cashKpis.accumulatedOverdue.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">Sin arrastre anterior</p>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="mb-2 text-sm font-semibold text-[#C94035]">{formatCurrency(cashKpis.accumulatedOverdueTotal)}</p>
                  {cashKpis.accumulatedOverdue.slice(0, 4).map((income) => {
                    const isSaving = savingIncomeId === income.id
                    return (
                      <div key={income.id} className="flex items-center gap-2 rounded-lg px-1 py-2 transition-colors hover:bg-gray-50">
                        <button
                          type="button"
                          onClick={() => navigateToIncome(income)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">{incomeConceptLabel(income)}</p>
                              <p className="text-xs font-medium text-red-600">{formatDueText(income.expected_date)} · {formatDate(income.expected_date)}</p>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-gray-900">{formatCurrency(income.amount)}</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestMarkPendingIncomePaid(income)}
                          disabled={Boolean(savingIncomeId)}
                          aria-label={`Marcar como cobrado ${incomeConceptLabel(income)}`}
                          title="Marcar como cobrado"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#2D6A4F] transition-colors hover:bg-[#F4FBF7] hover:text-[#1F5A42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                        >
                          {isSaving
                            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D6A4F] border-t-transparent" />
                            : <CheckCircle size={18} />}
                        </button>
                      </div>
                    )
                  })}
                  {cashKpis.accumulatedOverdue.length > 4 && (
                    <p className="pt-2 text-center text-xs text-gray-400">+ {cashKpis.accumulatedOverdue.length - 4} más</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {view === 'work' && (
          <Card className="p-3.5 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-[var(--color-primary-500)]" />
                <h2 className="text-sm font-semibold text-gray-900">Trabajos del mes</h2>
              </div>
              <span className="text-xs font-medium text-[var(--color-primary-600)]">
                {works.length}
              </span>
            </div>
            {works.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">Sin trabajos relevantes para este mes</p>
            ) : (
              <div className="flex flex-col gap-4">
                {workSections.map((section) => (
                  <div key={section.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.02em] text-gray-500">{section.title}</h3>
                        <p className="text-[11px] text-gray-400">{section.description}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400">{section.works.length}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {section.works.slice(0, 6).map((work) => (
                        <button
                          key={`${section.id}-${work.type}-${work.id}`}
                          onClick={() => navigate(work.path)}
                          className="rounded-lg border border-gray-100 px-2.5 py-2.5 text-left transition-colors hover:bg-gray-50 sm:px-3 sm:py-3"
                        >
                          <div className="sm:hidden">
                            <div className="flex items-start gap-3">
                              <span
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${work.color}1F`, color: work.color }}
                              >
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: work.color }} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">{work.name}</p>
                                    <p className="mt-0.5 truncate text-xs text-gray-400">{work.client}</p>
                                  </div>
                                  <div className="flex-shrink-0 pt-0.5 text-[11px] text-gray-400">
                                    {work.nextExpectedDate ? formatDate(work.nextExpectedDate) : ''}
                                  </div>
                                </div>
                                <div className="mt-2.5 flex items-end justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-gray-500">Pendiente</p>
                                    <p className="truncate text-2xl font-semibold leading-tight text-[#211C18]">{formatCurrency(work.pending)}</p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <StatusBadge status={work.status} />
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${work.overdue > 0 ? 'bg-[#FFF5F3] text-[#C94035]' : 'bg-gray-100 text-gray-500'}`}>
                                    Vencido {formatCurrency(work.overdue)}
                                  </span>
                                  <span className="rounded-full bg-[#F4FBF7] px-2 py-1 text-[11px] font-medium text-[#2D6A4F]">
                                    Cobrado {formatCurrency(work.paid)}
                                  </span>
                                  <span className="rounded-full bg-[#F8F6EF] px-2 py-1 text-[11px] font-medium text-gray-700">
                                    Plan {formatCurrency(work.totalExpected)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex sm:flex-col sm:gap-2 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 items-start gap-2">
                                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: work.color }} />
                                <div className="min-w-0 flex-1">
                                  <div className="flex min-w-0 items-center justify-between gap-2">
                                    <p className="truncate text-sm font-semibold text-gray-900">{work.name}</p>
                                    <div>
                                      <StatusBadge status={work.status} />
                                    </div>
                                  </div>
                                  <p className="mt-1 truncate text-xs text-gray-400">{work.client}</p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-5 lg:min-w-[560px]">
                              <div className="rounded-lg bg-gray-50 px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-gray-400">Plan</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(work.totalExpected)}</p>
                              </div>
                              <div className="rounded-lg bg-[#F4FBF7] px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-gray-400">Cobrado</p>
                                <p className="font-semibold text-[#2D6A4F]">{formatCurrency(work.paid)}</p>
                              </div>
                              <div className="rounded-lg bg-gray-50 px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-gray-400">Pendiente</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(work.pending)}</p>
                              </div>
                              <div className="rounded-lg bg-[#FFF5F3] px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-gray-400">Vencido</p>
                                <p className={`font-semibold ${work.overdue > 0 ? 'text-[#C94035]' : 'text-gray-900'}`}>{formatCurrency(work.overdue)}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-gray-400">Próximo</p>
                                <p className="font-semibold text-gray-900">{work.nextExpectedDate ? formatDate(work.nextExpectedDate) : '—'}</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      {section.works.length > 6 && (
                        <p className="pt-1 text-center text-xs text-gray-400">+ {section.works.length - 6} más</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Modal
          isOpen={Boolean(pendingConfirmationIncome)}
          onClose={() => {
            if (!savingIncomeId) setPendingConfirmationIncome(null)
          }}
          title="Confirmar cobro"
        >
          {pendingConfirmationIncome && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Este cobro tiene un concepto poco claro. Confirma que quieres marcarlo como cobrado.
              </p>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">{incomeConceptLabel(pendingConfirmationIncome)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(pendingConfirmationIncome.expected_date)} · {formatCurrency(pendingConfirmationIncome.amount)}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPendingConfirmationIncome(null)}
                  disabled={savingIncomeId === pendingConfirmationIncome.id}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => markPendingIncomePaid(pendingConfirmationIncome)}
                  disabled={savingIncomeId === pendingConfirmationIncome.id}
                >
                  {savingIncomeId === pendingConfirmationIncome.id ? 'Guardando...' : 'Marcar cobrado'}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </PageWrapper>
  )
}
