import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { TrendingUp, Wallet, Receipt, PiggyBank, Clock, FolderOpen, ChevronLeft, ChevronRight, AlertCircle, Timer, CalendarDays } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Input'
import { KpiCard } from './KpiCard'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { useIncomes } from '../../hooks/useIncomes'
import { useExpenses } from '../../hooks/useExpenses'
import { formatCurrency, formatCurrencyPerHour, formatDate, formatHours } from '../../lib/formatters'

const YEARS = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i)

dayjs.locale('es')

const getEventHours = (event) => {
  if (!event.end_datetime) return 0
  const minutes = dayjs(event.end_datetime).diff(dayjs(event.start_datetime), 'minute')
  return minutes > 0 ? minutes / 60 : 0
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects(user?.id)
  const { events, loading: eventsLoading, error: eventsError } = useEvents(user?.id)
  const { incomes, loading: incomesLoading, error: incomesError } = useIncomes(user?.id)
  const { expenses, loading: expensesLoading, error: expensesError } = useExpenses(user?.id)

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [criteria, setCriteria] = useState('cash_flow')
  const [pendingDays, setPendingDays] = useState(30)

  const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD')
  const endOfMonth = selectedDate.endOf('month').format('YYYY-MM-DD')
  const today = dayjs().format('YYYY-MM-DD')
  const inPendingDays = dayjs().add(pendingDays, 'day').format('YYYY-MM-DD')
  const inSevenDays = dayjs().add(7, 'day').format('YYYY-MM-DD')

  const prevMonth = () => setSelectedDate((d) => d.subtract(1, 'month'))
  const nextMonth = () => setSelectedDate((d) => d.add(1, 'month'))

  const activeProjectIds = useMemo(() => {
    if (criteria !== 'project_active') return null
    return new Set(
      projects
        .filter((p) => {
          const end = p.end_date ?? p.start_date
          return p.start_date <= endOfMonth && end >= startOfMonth
        })
        .map((p) => p.id)
    )
  }, [projects, criteria, startOfMonth, endOfMonth])

  const activeEventIds = useMemo(() => {
    if (criteria !== 'project_active' || !activeProjectIds) return null
    return new Set(events.filter((e) => activeProjectIds.has(e.project_id)).map((e) => e.id))
  }, [events, criteria, activeProjectIds])

  const relevantIncomes = useMemo(() => {
    if (criteria === 'cash_flow')
      return incomes.filter((i) => {
        const incomeDate = i.is_paid ? (i.paid_date ?? i.expected_date) : i.expected_date
        return incomeDate >= startOfMonth && incomeDate <= endOfMonth
      })
    return incomes.filter((i) =>
      (i.project_id && activeProjectIds.has(i.project_id)) ||
      (i.event_id && activeEventIds.has(i.event_id))
    )
  }, [incomes, criteria, startOfMonth, endOfMonth, activeProjectIds, activeEventIds])

  const relevantExpenses = useMemo(() => {
    if (criteria === 'cash_flow')
      return expenses.filter((e) => e.expense_date >= startOfMonth && e.expense_date <= endOfMonth)
    return expenses.filter((e) =>
      (e.project_id && activeProjectIds.has(e.project_id)) ||
      (e.event_id && activeEventIds.has(e.event_id))
    )
  }, [expenses, criteria, startOfMonth, endOfMonth, activeProjectIds, activeEventIds])

  const kpis = useMemo(() => {
    const grossExpected = relevantIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
    const paidIncomes = relevantIncomes.filter((i) => i.is_paid)
    // Ingresos cobrados de eventos del mes seleccionado (filtrar por fecha de cobro)
    const paidEventIncomes = paidIncomes.filter((i) => {
      if (!i.event_id) return false
      const incomeDate = i.paid_date ?? i.expected_date
      return incomeDate >= startOfMonth && incomeDate <= endOfMonth
    })
    const paidEventIds = new Set(paidEventIncomes.map((i) => i.event_id))
    const grossPaid = paidIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
    // Solo ingresos cobrados de eventos del mes para el cálculo de €/h
    const grossPaidFromEvents = paidEventIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
    const totalRetentions = paidIncomes.reduce((acc, i) => acc + Number(i.amount) * (Number(i.tax_rate) / 100), 0)
    const totalExpenses = relevantExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    // Horas de eventos del mes seleccionado que tienen ingresos cobrados asociados
    const billableHours = events
      .filter((event) => {
        if (!paidEventIds.has(event.id)) return false
        // El evento debe tener horas dentro del mes seleccionado (start o end dentro del rango)
        const eventStart = dayjs(event.start_datetime).format('YYYY-MM-DD')
        const eventEnd = event.end_datetime ? dayjs(event.end_datetime).format('YYYY-MM-DD') : eventStart
        return eventStart <= endOfMonth && eventEnd >= startOfMonth
      })
      .reduce((acc, event) => acc + getEventHours(event), 0)
    const grossHourlyRate = billableHours > 0 ? grossPaidFromEvents / billableHours : 0
    const netProfit = grossPaid - totalRetentions - totalExpenses
    return { grossExpected, grossPaid, totalRetentions, totalExpenses, billableHours, grossHourlyRate, netProfit }
  }, [relevantIncomes, relevantExpenses, events, startOfMonth, endOfMonth])

  const pendingIncomes = useMemo(() =>
    incomes
      .filter((i) => !i.is_paid && i.expected_date >= today && i.expected_date <= inPendingDays)
      .sort((a, b) => a.expected_date.localeCompare(b.expected_date))
  , [incomes, today, inPendingDays])

  const urgentPendingIncomes = useMemo(() =>
    incomes
      .filter((i) => !i.is_paid && i.expected_date && i.expected_date <= inSevenDays)
      .sort((a, b) => a.expected_date.localeCompare(b.expected_date))
  , [incomes, inSevenDays])

  const urgentPendingTotal = useMemo(() =>
    urgentPendingIncomes.reduce((acc, income) => acc + Number(income.amount), 0)
  , [urgentPendingIncomes])

  const overdueIncomes = useMemo(() =>
    urgentPendingIncomes.filter((income) => income.expected_date < today)
  , [urgentPendingIncomes, today])

  const upcomingEvents = useMemo(() =>
    events
      .filter((event) => {
        if (event.status === 'cancelled') return false
        const eventDate = dayjs(event.start_datetime)
        return eventDate.isAfter(dayjs().subtract(1, 'hour')) && eventDate.format('YYYY-MM-DD') <= inSevenDays
      })
      .sort((a, b) => dayjs(a.start_datetime).valueOf() - dayjs(b.start_datetime).valueOf())
  , [events, inSevenDays])

  const todayEvents = useMemo(() =>
    upcomingEvents.filter((event) => dayjs(event.start_datetime).format('YYYY-MM-DD') === today)
  , [upcomingEvents, today])

  const nextEvent = upcomingEvents[0]

  const activeProjects = useMemo(() =>
    projects.filter((p) => p.status === 'confirmed' || p.status === 'in_progress')
  , [projects])

  const navigateToIncome = (income) => {
    if (income.event_id) navigate(`/events/${income.event_id}`)
    else if (income.project_id) navigate(`/projects/${income.project_id}`)
  }

  const loading = projectsLoading || eventsLoading || incomesLoading || expensesLoading
  const error = projectsError || eventsError || incomesError || expensesError

  return (
    <PageWrapper title="Dashboard">
      <div className="flex flex-col gap-6">

        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Selector de mes simplificado */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem_6.5rem] items-center gap-2 sm:flex sm:gap-1">
                <button onClick={prevMonth} className="flex min-h-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Mes anterior">
                  <ChevronLeft size={18} />
                </button>
                <span className="min-w-0 truncate text-center text-sm font-medium capitalize text-gray-900 sm:min-w-[100px]">
                  {selectedDate.format('MMMM')}
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
              
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm self-start">
                <button
                  onClick={() => setCriteria('cash_flow')}
                  className={`px-3 sm:px-2.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[unset] transition-colors ${criteria === 'cash_flow' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Cobros
                </button>
                <button
                  onClick={() => setCriteria('project_active')}
                  className={`px-3 sm:px-2.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[unset] border-l border-gray-200 transition-colors ${criteria === 'project_active' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Proyectos
                </button>
              </div>
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
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-full" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <KpiCard
              title="Ingresos previstos"
              value={formatCurrency(kpis.grossExpected)}
              subtitle={criteria === 'cash_flow' ? 'Fecha de cobro en el mes' : 'Proyectos activos en el mes'}
              icon={TrendingUp}
              color="red"
            />
            <KpiCard
              title="Ingresos cobrados"
              value={formatCurrency(kpis.grossPaid)}
              subtitle={`Retenciones: ${formatCurrency(kpis.totalRetentions)}`}
              icon={Wallet}
              color="green"
              progress={kpis.grossExpected > 0 ? kpis.grossPaid / kpis.grossExpected : 0}
            />
            <KpiCard
              title="Gastos totales"
              value={formatCurrency(kpis.totalExpenses)}
              icon={Receipt}
              color="amber"
            />
            <KpiCard
              title="Cobro bruto/hora"
              value={kpis.billableHours > 0 ? formatCurrencyPerHour(kpis.grossHourlyRate) : '—'}
              subtitle={kpis.billableHours > 0 ? `Solo eventos cobrados · ${formatHours(kpis.billableHours)} h` : 'Sin eventos cobrados'}
              icon={Timer}
              color="red"
            />
            <KpiCard
              title="Beneficio neto"
              value={formatCurrency(kpis.netProfit)}
              subtitle="Cobrado – retenciones – gastos"
              icon={PiggyBank}
              color={kpis.netProfit >= 0 ? 'green' : 'red'}
            />
          </div>
        )}

        <Card className="p-3 md:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Ahora</h2>
              <p className="text-xs text-gray-500">{dayjs().format('dddd, D MMMM')}</p>
            </div>
            <button
              onClick={() => navigate('/calendar/events')}
              className="flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-[var(--color-primary-600)] hover:bg-gray-50"
            >
              <CalendarDays size={15} />
              Calendario
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-2 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[68px] rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => nextEvent ? navigate(`/events/${nextEvent.id}`) : navigate('/calendar/events')}
                className="flex min-h-[68px] items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#F9EDEB] text-[#C94035]">
                  <Clock size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {todayEvents.length > 0 ? `${todayEvents.length} evento${todayEvents.length === 1 ? '' : 's'} hoy` : nextEvent ? 'Próximo evento' : 'Sin eventos próximos'}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {nextEvent
                      ? `${dayjs(nextEvent.start_datetime).format('DD/MM HH:mm')} · ${nextEvent.name}`
                      : 'Semana tranquila'}
                  </span>
                </span>
              </button>

              <button
                onClick={() => urgentPendingIncomes[0] ? navigateToIncome(urgentPendingIncomes[0]) : undefined}
                className="flex min-h-[68px] items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FDF5E4] text-[#D4921A]">
                  <Wallet size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {urgentPendingIncomes.length > 0 ? `${urgentPendingIncomes.length} cobro${urgentPendingIncomes.length === 1 ? '' : 's'} urgente${urgentPendingIncomes.length === 1 ? '' : 's'}` : 'Sin cobros urgentes'}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {urgentPendingIncomes.length > 0
                      ? `${formatCurrency(urgentPendingTotal)} · ${overdueIncomes.length > 0 ? `${overdueIncomes.length} vencido${overdueIncomes.length === 1 ? '' : 's'}` : 'próximos 7 días'}`
                      : 'Nada vence esta semana'}
                  </span>
                </span>
              </button>

              <button
                onClick={() => navigate('/projects')}
                className="flex min-h-[68px] items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#E8F4EF] text-[#2D6A4F]">
                  <FolderOpen size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {activeProjects.length} proyecto{activeProjects.length === 1 ? '' : 's'} activo{activeProjects.length === 1 ? '' : 's'}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {activeProjects[0] ? activeProjects[0].name : 'Sin trabajo activo'}
                  </span>
                </span>
              </button>
            </div>
          )}

          {!loading && (
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
              <div>
                <p className="text-[11px] text-gray-500">Cobrado</p>
                <p className="truncate text-sm font-semibold text-gray-900">{formatCurrency(kpis.grossPaid)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">Gastos</p>
                <p className="truncate text-sm font-semibold text-gray-900">{formatCurrency(kpis.totalExpenses)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">Neto</p>
                <p className={`truncate text-sm font-semibold ${kpis.netProfit >= 0 ? 'text-[#2D6A4F]' : 'text-[#C94035]'}`}>
                  {formatCurrency(kpis.netProfit)}
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <h2 className="text-sm font-semibold text-gray-900">Cobros próximos</h2>
              </div>
              <Select
                value={pendingDays}
                onChange={(e) => setPendingDays(Number(e.target.value))}
                className="text-xs py-1.5"
                aria-label="Días"
              >
                <option value={7}>7 días</option>
                <option value={14}>14 días</option>
                <option value={30}>30 días</option>
              </Select>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="space-y-2 flex-1 min-w-0 mr-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : pendingIncomes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin cobros próximos</p>
            ) : (
              <div className="flex flex-col gap-1">
                {pendingIncomes.slice(0, 5).map((income) => {
                  const daysLeft = dayjs(income.expected_date).diff(dayjs(), 'day')
                  const isUrgent = daysLeft <= 7
                  return (
                    <button
                      key={income.id}
                      onClick={() => navigateToIncome(income)}
                      className="flex items-center justify-between gap-2 py-2 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{income.concept}</p>
                        <p className={`text-xs ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                          {formatDate(income.expected_date)} · {daysLeft}d
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(income.amount)}</span>
                    </button>
                  )
                })}
                {pendingIncomes.length > 5 && (
                  <p className="text-xs text-gray-400 text-center pt-2">+ {pendingIncomes.length - 5} más</p>
                )}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-[var(--color-primary-500)]" />
                <h2 className="text-sm font-semibold text-gray-900">Proyectos activos</h2>
              </div>
              <span className="text-xs font-medium text-[var(--color-primary-600)]">
                {activeProjects.length}
              </span>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-2 flex-1 min-w-0 mr-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0 mt-1" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded-full w-20 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : activeProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin proyectos activos</p>
            ) : (
              <div className="flex flex-col gap-1">
                {activeProjects.slice(0, 5).map((project) => (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex items-center justify-between gap-2 py-2 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-400 truncate">{project.client || 'Sin cliente'}</p>
                      </div>
                    </div>
                    <StatusBadge status={project.status} size="sm" />
                  </button>
                ))}
                {activeProjects.length > 5 && (
                  <p className="text-xs text-gray-400 text-center pt-2">+ {activeProjects.length - 5} más</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
