import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { TrendingUp, Wallet, Receipt, PiggyBank, Clock, FolderOpen, ChevronLeft, ChevronRight, AlertCircle, Timer } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { KpiCard } from './KpiCard'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useEvents } from '../../hooks/useEvents'
import { useIncomes } from '../../hooks/useIncomes'
import { useExpenses } from '../../hooks/useExpenses'
import { formatCurrency, formatCurrencyPerHour, formatDate, formatHours } from '../../lib/formatters'

const YEARS = Array.from({ length: 6 }, (_, i) => dayjs().year() - 2 + i)

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

  const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD')
  const endOfMonth = selectedDate.endOf('month').format('YYYY-MM-DD')
  const today = dayjs().format('YYYY-MM-DD')
  const in30Days = dayjs().add(30, 'day').format('YYYY-MM-DD')

  const prevMonth = () => setSelectedDate((d) => d.subtract(1, 'month'))
  const nextMonth = () => setSelectedDate((d) => d.add(1, 'month'))

  // IDs de proyectos activos en el mes seleccionado
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

  // IDs de eventos que pertenecen a proyectos activos
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
    const paidEventIncomes = paidIncomes.filter((i) => i.event_id)
    const paidEventIds = new Set(paidEventIncomes.map((i) => i.event_id))
    const grossPaid = paidIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
    const grossPaidFromEvents = paidEventIncomes.reduce((acc, i) => acc + Number(i.amount), 0)
    const totalRetentions = paidIncomes.reduce((acc, i) => acc + Number(i.amount) * (Number(i.tax_rate) / 100), 0)
    const totalExpenses = relevantExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const billableHours = events
      .filter((event) => paidEventIds.has(event.id))
      .reduce((acc, event) => acc + getEventHours(event), 0)
    const grossHourlyRate = billableHours > 0 ? grossPaidFromEvents / billableHours : 0
    const netProfit = grossPaid - totalRetentions - totalExpenses
    return { grossExpected, grossPaid, totalRetentions, totalExpenses, billableHours, grossHourlyRate, netProfit }
  }, [relevantIncomes, relevantExpenses, events])

  const pendingIncomes = useMemo(() =>
    incomes
      .filter((i) => !i.is_paid && i.expected_date >= today && i.expected_date <= in30Days)
      .sort((a, b) => a.expected_date.localeCompare(b.expected_date))
  , [incomes, today, in30Days])

  const activeProjects = useMemo(() =>
    projects.filter((p) => p.status === 'confirmed' || p.status === 'in_progress')
  , [projects])

  const navigateToIncome = (income) => {
    if (income.event_id) navigate(`/events/${income.event_id}`)
    else if (income.project_id) navigate(`/projects/${income.project_id}`)
  }

  const loading = projectsLoading || eventsLoading || incomesLoading || expensesLoading
  const error = projectsError || eventsError || incomesError || expensesError

  const getIncomeName = (income) => {
    if (income.event_id) {
      const event = events.find((e) => e.id === income.event_id)
      return event?.name ?? '—'
    }
    const project = projects.find((p) => p.id === income.project_id)
    return project?.name ?? '—'
  }

  return (
    <PageWrapper title="Dashboard">
      <div className="flex flex-col gap-6">

        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Resumen económico</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900 capitalize">{selectedDate.format('MMMM YYYY')}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {criteria === 'cash_flow'
                  ? 'Importes por fecha prevista o real de cobro y gasto.'
                  : 'Importes asociados a proyectos activos durante el mes.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
                <span className="text-sm font-semibold text-gray-900 w-32 text-center capitalize">
              {selectedDate.format('MMMM YYYY')}
            </span>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
                <select
                  value={selectedDate.year()}
                  onChange={(e) => setSelectedDate((d) => d.year(Number(e.target.value)))}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 bg-white"
                  aria-label="Año"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 rounded-lg border border-gray-200 overflow-hidden text-sm sm:w-auto">
                <button
                  onClick={() => setCriteria('cash_flow')}
                  className={`px-3 py-2 transition-colors ${criteria === 'cash_flow' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Cobros
                </button>
                <button
                  onClick={() => setCriteria('project_active')}
                  className={`px-3 py-2 border-l border-gray-200 transition-colors ${criteria === 'project_active' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
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

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Ingresos previstos"
            value={formatCurrency(kpis.grossExpected)}
            subtitle={criteria === 'cash_flow' ? 'Fecha de cobro en el mes' : 'Proyectos activos en el mes'}
            icon={TrendingUp}
            color="indigo"
          />
          <KpiCard
            title="Ingresos cobrados"
            value={formatCurrency(kpis.grossPaid)}
            subtitle={`Retenciones: ${formatCurrency(kpis.totalRetentions)}`}
            icon={Wallet}
            color="green"
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
            subtitle={`Solo eventos cobrados · ${formatHours(kpis.billableHours)} h`}
            icon={Timer}
            color="indigo"
          />
          <KpiCard
            title="Beneficio neto"
            value={formatCurrency(kpis.netProfit)}
            subtitle="Cobrado – retenciones – gastos"
            icon={PiggyBank}
            color={kpis.netProfit >= 0 ? 'green' : 'red'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <Clock size={16} className="text-amber-500 flex-shrink-0" />
                <h2 className="text-sm font-semibold text-gray-900">Cobros pendientes</h2>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 whitespace-nowrap">
                30 días
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Cargando cobros...</p>
            ) : pendingIncomes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-700">Sin cobros próximos</p>
                <p className="mt-1 text-sm text-gray-400">No hay importes pendientes en los próximos 30 días.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pendingIncomes.map((income) => (
                  <button
                    key={income.id}
                    onClick={() => navigateToIncome(income)}
                    className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors text-left w-full"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{income.concept}</p>
                      <p className="text-xs text-gray-400 truncate">{getIncomeName(income)} · {formatDate(income.expected_date)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(income.amount)}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen size={16} className="text-indigo-500 flex-shrink-0" />
                <h2 className="text-sm font-semibold text-gray-900">Proyectos activos</h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 whitespace-nowrap">
                {activeProjects.length}
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Cargando proyectos...</p>
            ) : activeProjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-700">Sin proyectos activos</p>
                <p className="mt-1 text-sm text-gray-400">Los proyectos confirmados o en curso aparecerán aquí.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex items-start justify-between gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors text-left w-full"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color ?? '#4f98a3' }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-400 truncate">{project.client || 'Sin cliente'}</p>
                      </div>
                    </div>
                    <StatusBadge status={project.status} />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
