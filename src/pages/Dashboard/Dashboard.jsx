import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Clock, FolderOpen, Wallet } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Input'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { FirstStepsChecklist } from '../../components/onboarding/FirstStepsChecklist'
import { KpiCard } from './KpiCard'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { useIncomes } from '../../hooks/useIncomes'
import { formatCurrency, formatDate, formatDatetimeCompact, formatTime } from '../../lib/formatters'
import { getCashMonthSummary, getWorkKpis, getWorkSections, getWorkSummaries } from '../../lib/dashboardFinance'
import { formatDueText, getDueDays } from '../../lib/dueDates'
import { markPaid, markUnpaid, needsQuickPaidConfirmation } from '../../lib/payment'

const YEARS = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i)

dayjs.locale('es')

const AMOUNT_CLASS = 'font-data tabular-nums tracking-normal'
const EMPTY_STATE_CLASS = 'rounded-lg border border-dashed border-border-subtle bg-surface-muted px-3 py-4 text-center text-sm text-text-secondary'

const incomeConceptLabel = (income) => income.concept?.trim() || 'Ingreso sin concepto'

const eventNameLabel = (event) => event.name?.trim() || 'Evento sin nombre'

const eventContextLabel = (event, projectById) => {
  const project = event.project_id ? projectById.get(event.project_id) : null
  return project?.name || event.client || 'Evento independiente'
}

const formatEventWindow = (event) => {
  if (!event.start_datetime) return 'Sin hora definida'
  const start = dayjs(event.start_datetime)
  const end = event.end_datetime ? dayjs(event.end_datetime) : null
  const startLabel = start.isSame(dayjs(), 'day')
    ? `Hoy · ${formatTime(event.start_datetime)}`
    : formatDatetimeCompact(event.start_datetime)

  if (!end?.isValid()) return startLabel

  const endLabel = start.isSame(end, 'day') ? formatTime(event.end_datetime) : formatDatetimeCompact(event.end_datetime)
  return `${startLabel} - ${endLabel}`
}

const buildEventNowState = ({ event, projectById, kind, badge }) => ({
  kind,
  badge,
  title: eventNameLabel(event),
  description: eventContextLabel(event, projectById),
  meta: formatEventWindow(event),
  path: `/events/${event.id}`,
})

const getNowDashboardState = (events, projectById) => {
  const now = dayjs()
  const scheduledEvents = events
    .filter((event) => event.start_datetime)
    .map((event) => ({
      event,
      start: dayjs(event.start_datetime),
      end: event.end_datetime ? dayjs(event.end_datetime) : dayjs(event.start_datetime).add(90, 'minute'),
    }))
    .filter(({ start }) => start.isValid())
    .sort((a, b) => a.start.valueOf() - b.start.valueOf())

  if (scheduledEvents.length === 0) {
    return {
      kind: 'empty',
      badge: 'Vacío',
      title: 'Sin eventos todavía',
      description: 'Cuando crees eventos, aparecerá aquí tu siguiente paso.',
      meta: 'Agenda por estrenar',
      path: '/events',
    }
  }

  const currentEvent = scheduledEvents.find(({ start, end }) => !start.isAfter(now) && !end.isBefore(now))
  if (currentEvent) {
    return buildEventNowState({
      event: currentEvent.event,
      projectById,
      kind: 'current',
      badge: 'En curso',
    })
  }

  const upcomingEvent = scheduledEvents.find(({ start }) => start.isAfter(now) || start.isSame(now))
  if (upcomingEvent) {
    return buildEventNowState({
      event: upcomingEvent.event,
      projectById,
      kind: 'upcoming',
      badge: upcomingEvent.start.isSame(now, 'day') ? 'Hoy' : 'Próximo',
    })
  }

  const latestEvent = scheduledEvents.at(-1)?.event
  return {
    kind: 'idle',
    badge: 'Sin actividad',
    title: 'Sin eventos próximos',
    description: 'No hay actividad futura en tu agenda.',
    meta: latestEvent ? `Último: ${formatDatetimeCompact(latestEvent.start_datetime)}` : 'Agenda sin fechas futuras',
    path: '/calendar/events',
  }
}

const NOW_CARD_STYLES = {
  current: {
    icon: 'bg-success-soft text-success',
    badge: 'bg-success-soft text-success',
    button: 'text-success hover:bg-success-soft',
  },
  upcoming: {
    icon: 'bg-warning-soft text-warning',
    badge: 'bg-warning-soft text-warning',
    button: 'text-warning hover:bg-warning-soft',
  },
  empty: {
    icon: 'bg-surface-muted text-text-secondary',
    badge: 'bg-surface-muted text-text-secondary',
    button: 'text-accent-primary hover:bg-accent-soft',
  },
  idle: {
    icon: 'bg-surface-muted text-text-secondary',
    badge: 'bg-surface-muted text-text-secondary',
    button: 'text-accent-primary hover:bg-accent-soft',
  },
}

const getDueTone = (daysLeft) => {
  if (daysLeft < 0) {
    return {
      row: 'border-danger-soft bg-danger-soft hover:border-danger',
      text: 'font-medium text-danger',
    }
  }

  if (daysLeft <= 7) {
    return {
      row: 'border-warning-soft bg-warning-soft hover:border-warning',
      text: 'font-medium text-warning',
    }
  }

  return {
    row: 'border-transparent hover:border-border-subtle hover:bg-surface-muted',
    text: 'text-text-secondary',
  }
}

function MobileNowCard({ state, onOpen }) {
  const styles = NOW_CARD_STYLES[state.kind] ?? NOW_CARD_STYLES.idle
  const Icon = state.kind === 'current' ? Clock : CalendarDays

  return (
    <Card className="border-border-subtle bg-surface-card p-3.5 md:hidden">
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-text-secondary">Ahora</p>
            <span className={`max-w-[9rem] truncate rounded-full px-2 py-1 text-[11px] font-medium ${styles.badge}`}>
              {state.badge}
            </span>
          </div>
          <p className="mt-1 break-words text-base font-semibold leading-snug text-text-primary">{state.title}</p>
          <p className="mt-1 break-words text-xs text-text-secondary">{state.description}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-xs font-medium text-text-primary">{state.meta}</p>
            {state.path && (
              <button
                type="button"
                onClick={() => onOpen(state.path)}
                aria-label={`Abrir ${state.title}`}
                className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${styles.button}`}
              >
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const { events, loading: eventsLoading, error: eventsError } = useEvents(user?.id)
  const { incomes, loading: incomesLoading, error: incomesError, updateIncome } = useIncomes(user?.id)
  const { profile, loading: profileLoading } = useProfile(user?.id)
  const { toasts, addToast, removeToast } = useToast()

  const [selectedDate, setSelectedDate] = useState(() => dayjs())
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

  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects])
  const nowDashboardState = useMemo(() => getNowDashboardState(events, projectById), [events, projectById])
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
    <PageWrapper title="Inicio">
      <div className="flex flex-col gap-4 md:gap-6">

        <Card className="border-border-subtle bg-surface-card p-2.5 sm:p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="flex min-w-0 flex-1 items-center rounded-full border border-border-subtle bg-surface-muted p-1 sm:flex-none">
                <button onClick={prevMonth} className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:min-h-9 sm:min-w-9" aria-label="Mes anterior">
                  <ChevronLeft size={18} />
                </button>
                <span className="min-w-0 flex-1 truncate px-2 text-center text-sm font-medium capitalize text-text-primary sm:min-w-[130px]">
                  {selectedMonthLabel}
                </span>
                <button onClick={nextMonth} className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:min-h-9 sm:min-w-9" aria-label="Mes siguiente">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="w-[6.25rem] shrink-0 sm:w-24">
                <Select
                  value={selectedDate.year()}
                  onChange={(e) => setSelectedDate((d) => d.year(Number(e.target.value)))}
                  className="!min-h-10 !rounded-full !bg-surface-muted !py-2 !text-sm !shadow-none font-data tabular-nums sm:!min-h-9 sm:!py-1.5 sm:!text-xs"
                  aria-label="Año"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </Select>
              </div>
            </div>

            <div className="inline-flex w-full rounded-full border border-border-subtle bg-surface-muted p-1 text-sm sm:w-auto">
              <button
                onClick={() => setView('cash')}
                className={`min-h-[44px] flex-1 rounded-full px-3 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:min-h-[unset] sm:flex-none sm:px-3 sm:py-1.5 ${view === 'cash' ? 'bg-text-primary text-surface-page shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Caja del mes
              </button>
              <button
                onClick={() => setView('work')}
                className={`min-h-[44px] flex-1 rounded-full px-3 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:min-h-[unset] sm:flex-none sm:px-3 sm:py-1.5 ${view === 'work' ? 'bg-text-primary text-surface-page shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Trabajos
              </button>
            </div>
          </div>
        </Card>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-danger-soft bg-danger-soft px-4 py-3 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>No se han podido cargar todos los datos de Inicio. Revisa la conexión y vuelve a intentarlo.</p>
          </div>
        )}

        {!loading && !profileLoading && (
          <FirstStepsChecklist
            profile={profile}
            projects={projects}
            events={events}
            incomes={incomes}
            onNavigate={navigate}
          />
        )}

        {!loading && <MobileNowCard state={nowDashboardState} onOpen={navigate} />}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border-subtle bg-surface-card p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="skeleton h-10 w-10 flex-shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="skeleton h-3 w-3/4" />
                    <div className="skeleton h-6 w-full" />
                    <div className="skeleton h-2.5 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === 'cash' ? (
          <>
            <Card className="border-border-subtle bg-surface-card p-3.5 md:hidden">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
                  <CalendarDays size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-text-secondary">Caja del mes</p>
                    <span className="max-w-[8.5rem] truncate text-[11px] text-text-secondary capitalize">{selectedMonthLabel}</span>
                  </div>
                  <p className={`mt-1 truncate text-2xl font-semibold leading-tight text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.plannedTotal)}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {cashKpis.planned.length} ingreso{cashKpis.planned.length === 1 ? '' : 's'} previsto{cashKpis.planned.length === 1 ? '' : 's'} o arrastrado{cashKpis.planned.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border-subtle pt-3">
                <div>
                  <p className="text-[11px] text-text-secondary">Cobrado</p>
                  <p className={`truncate text-sm font-semibold text-success ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.plannedPaidTotal)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary">Pendiente</p>
                  <p className={`truncate text-sm font-semibold text-warning ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.plannedPendingTotal)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary">Vencido</p>
                  <p className={`truncate text-sm font-semibold ${cashKpis.plannedOverdueTotal > 0 ? 'text-danger' : 'text-text-primary'} ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.plannedOverdueTotal)}</p>
                </div>
              </div>
              {cashKpis.plannedTotal > 0 && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-success"
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
            <Card className="border-border-subtle bg-surface-card p-3.5 md:hidden">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
                  <FolderOpen size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-text-secondary">Ahora mismo</p>
                      <p className={`mt-0.5 truncate text-2xl font-semibold leading-tight text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(workKpis.pendingTotal)}</p>
                    </div>
                    <p className="flex-shrink-0 text-[11px] text-text-secondary">
                      {workKpis.debtWorks} con deuda
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-danger-soft px-2 py-1 text-[11px] font-medium text-danger">
                      Vencido <span className={AMOUNT_CLASS}>{formatCurrency(workKpis.overdueTotal)}</span>
                    </span>
                    <span className="rounded-full bg-success-soft px-2 py-1 text-[11px] font-medium text-success">
                      Cobrado <span className={AMOUNT_CLASS}>{formatCurrency(workKpis.paidTotal)}</span>
                    </span>
                    <span className="rounded-full bg-surface-muted px-2 py-1 text-[11px] font-medium text-text-primary">
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
            <Card className="border-border-subtle bg-surface-card p-4">
              <div className="mb-3 flex flex-col gap-1 border-b border-border-subtle pb-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Cobrado realmente este mes: <span className={`font-semibold text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.paidByCashDateTotal)}</span>
                </p>
                {cashKpis.paidMissingDateCount > 0 && (
                  <p className="text-warning">
                    {cashKpis.paidMissingDateCount} cobro{cashKpis.paidMissingDateCount === 1 ? '' : 's'} sin fecha real
                  </p>
                )}
              </div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-warning" />
                  <h2 className="text-sm font-semibold text-text-primary">Próximos cobros</h2>
                </div>
                <span className="text-xs text-text-secondary capitalize">{selectedMonthLabel}</span>
              </div>
              {pendingIncomes.length === 0 ? (
                <p className={EMPTY_STATE_CLASS}>Sin cobros próximos ni vencidos</p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {pendingIncomes.slice(0, 6).map((income) => {
                    const daysLeft = getDueDays(income.expected_date)
                    const dueTone = getDueTone(daysLeft)
                    const isSaving = savingIncomeId === income.id
                    return (
                      <div key={income.id} className={`flex items-center gap-2 rounded-lg border px-2 py-2 transition-colors ${dueTone.row}`}>
                        <button
                          type="button"
                          onClick={() => navigateToIncome(income)}
                          className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-text-primary">{incomeConceptLabel(income)}</p>
                            <p className={`text-xs ${dueTone.text}`}>
                              {formatDueText(income.expected_date)} · {formatDate(income.expected_date)}
                            </p>
                          </div>
                          <span className={`text-sm font-medium text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(income.amount)}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestMarkPendingIncomePaid(income)}
                          disabled={Boolean(savingIncomeId)}
                          aria-label={`Marcar como cobrado ${incomeConceptLabel(income)}`}
                          title="Marcar como cobrado"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-success transition-colors hover:bg-success-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-text-secondary disabled:hover:bg-transparent"
                        >
                          {isSaving
                            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-success border-t-transparent" />
                            : <CheckCircle size={18} />}
                        </button>
                      </div>
                    )
                  })}
                  {pendingIncomes.length > 6 && (
                    <p className="pt-2 text-center text-xs text-text-secondary">+ {pendingIncomes.length - 6} más</p>
                  )}
                </div>
              )}
            </Card>

            <Card className="border-border-subtle bg-surface-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle size={16} className={cashKpis.accumulatedOverdueTotal > 0 ? 'text-danger' : 'text-text-secondary'} />
                <h2 className="text-sm font-semibold text-text-primary">Vencidos anteriores incluidos</h2>
              </div>
              {cashKpis.accumulatedOverdue.length === 0 ? (
                <p className={EMPTY_STATE_CLASS}>Sin arrastre anterior</p>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className={`mb-2 text-sm font-semibold text-danger ${AMOUNT_CLASS}`}>{formatCurrency(cashKpis.accumulatedOverdueTotal)}</p>
                  {cashKpis.accumulatedOverdue.slice(0, 4).map((income) => {
                    const isSaving = savingIncomeId === income.id
                    return (
                      <div key={income.id} className="flex items-center gap-2 rounded-lg border border-danger-soft bg-danger-soft px-2 py-2 transition-colors hover:border-danger">
                        <button
                          type="button"
                          onClick={() => navigateToIncome(income)}
                          className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-text-primary">{incomeConceptLabel(income)}</p>
                              <p className="text-xs font-medium text-danger">{formatDueText(income.expected_date)} · {formatDate(income.expected_date)}</p>
                            </div>
                            <span className={`shrink-0 text-sm font-medium text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(income.amount)}</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestMarkPendingIncomePaid(income)}
                          disabled={Boolean(savingIncomeId)}
                          aria-label={`Marcar como cobrado ${incomeConceptLabel(income)}`}
                          title="Marcar como cobrado"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-success transition-colors hover:bg-success-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-text-secondary disabled:hover:bg-transparent"
                        >
                          {isSaving
                            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-success border-t-transparent" />
                            : <CheckCircle size={18} />}
                        </button>
                      </div>
                    )
                  })}
                  {cashKpis.accumulatedOverdue.length > 4 && (
                    <p className="pt-2 text-center text-xs text-text-secondary">+ {cashKpis.accumulatedOverdue.length - 4} más</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {view === 'work' && (
          <Card className="border-border-subtle bg-surface-card p-3.5 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-accent-primary" />
                <h2 className="text-sm font-semibold text-text-primary">Trabajos del mes</h2>
              </div>
              <span className="font-data text-xs font-medium text-accent-primary tabular-nums">
                {works.length}
              </span>
            </div>
            {works.length === 0 ? (
              <p className={EMPTY_STATE_CLASS}>Sin trabajos relevantes para este mes</p>
            ) : (
              <div className="flex flex-col gap-4">
                {workSections.map((section) => (
                  <div key={section.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.02em] text-text-secondary">{section.title}</h3>
                        <p className="text-[11px] text-text-secondary">{section.description}</p>
                      </div>
                      <span className="font-data text-xs font-medium text-text-secondary tabular-nums">{section.works.length}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {section.works.slice(0, 6).map((work) => (
                        <button
                          key={`${section.id}-${work.type}-${work.id}`}
                          onClick={() => navigate(work.path)}
                          className="rounded-lg border border-border-subtle px-2.5 py-2.5 text-left transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:px-3 sm:py-3"
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
                                    <p className="truncate text-sm font-semibold text-text-primary">{work.name}</p>
                                    <p className="mt-0.5 truncate text-xs text-text-secondary">{work.client}</p>
                                  </div>
                                  <div className="flex-shrink-0 pt-0.5 text-[11px] text-text-secondary">
                                    {work.nextExpectedDate ? formatDate(work.nextExpectedDate) : ''}
                                  </div>
                                </div>
                                <div className="mt-2.5 flex items-end justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-text-secondary">Pendiente</p>
                                    <p className={`truncate text-2xl font-semibold leading-tight text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(work.pending)}</p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <StatusBadge status={work.status} />
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${work.overdue > 0 ? 'bg-danger-soft text-danger' : 'bg-surface-muted text-text-secondary'}`}>
                                    Vencido <span className={AMOUNT_CLASS}>{formatCurrency(work.overdue)}</span>
                                  </span>
                                  <span className="rounded-full bg-success-soft px-2 py-1 text-[11px] font-medium text-success">
                                    Cobrado <span className={AMOUNT_CLASS}>{formatCurrency(work.paid)}</span>
                                  </span>
                                  <span className="rounded-full bg-surface-muted px-2 py-1 text-[11px] font-medium text-text-primary">
                                    Plan <span className={AMOUNT_CLASS}>{formatCurrency(work.totalExpected)}</span>
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
                                    <p className="truncate text-sm font-semibold text-text-primary">{work.name}</p>
                                    <div>
                                      <StatusBadge status={work.status} />
                                    </div>
                                  </div>
                                  <p className="mt-1 truncate text-xs text-text-secondary">{work.client}</p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-5 lg:min-w-[560px]">
                              <div className="rounded-lg bg-surface-muted px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-text-secondary">Plan</p>
                                <p className={`font-semibold text-text-primary ${AMOUNT_CLASS}`}>{formatCurrency(work.totalExpected)}</p>
                              </div>
                              <div className="rounded-lg bg-success-soft px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-text-secondary">Cobrado</p>
                                <p className={`font-semibold text-success ${AMOUNT_CLASS}`}>{formatCurrency(work.paid)}</p>
                              </div>
                              <div className="rounded-lg bg-warning-soft px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-text-secondary">Pendiente</p>
                                <p className={`font-semibold text-warning ${AMOUNT_CLASS}`}>{formatCurrency(work.pending)}</p>
                              </div>
                              <div className="rounded-lg bg-danger-soft px-2 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                                <p className="text-text-secondary">Vencido</p>
                                <p className={`font-semibold ${work.overdue > 0 ? 'text-danger' : 'text-text-primary'} ${AMOUNT_CLASS}`}>{formatCurrency(work.overdue)}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-text-secondary">Próximo</p>
                                <p className="font-semibold text-text-primary">{work.nextExpectedDate ? formatDate(work.nextExpectedDate) : '—'}</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      {section.works.length > 6 && (
                        <p className="pt-1 text-center text-xs text-text-secondary">+ {section.works.length - 6} más</p>
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
              <p className="text-sm text-text-secondary">
                Este cobro tiene un concepto poco claro. Confirma que quieres marcarlo como cobrado.
              </p>
              <div className="rounded-lg border border-border-subtle bg-surface-muted p-3">
                <p className="text-sm font-medium text-text-primary">{incomeConceptLabel(pendingConfirmationIncome)}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {formatDate(pendingConfirmationIncome.expected_date)} · <span className={AMOUNT_CLASS}>{formatCurrency(pendingConfirmationIncome.amount)}</span>
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
