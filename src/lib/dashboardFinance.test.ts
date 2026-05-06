import { describe, expect, it } from 'vitest'
import { getCashMonthSummary, getReceivables, getWorkKpis, getWorkSections, getWorkSummaries } from './dashboardFinance'

const month = { startOfMonth: '2026-05-01', endOfMonth: '2026-05-31', today: '2026-05-06' }

describe('dashboard finance helpers', () => {
  it('cuadra la cartera cobrable hasta el mes seleccionado', () => {
    const summary = getCashMonthSummary([
      { id: 'paid', amount: 100, expected_date: '2026-05-10', is_paid: true, paid_date: '2026-06-01' },
      { id: 'pending', amount: 90, expected_date: '2026-05-29', is_paid: false, paid_date: null },
      { id: 'overdue', amount: 20, expected_date: '2026-05-05', is_paid: false, paid_date: null },
      { id: 'old', amount: 300, expected_date: '2026-04-20', is_paid: false, paid_date: null },
      { id: 'settled-before', amount: 80, expected_date: '2026-04-10', is_paid: true, paid_date: '2026-04-25' },
      { id: 'settled-during', amount: 40, expected_date: '2026-04-15', is_paid: true, paid_date: '2026-05-03' },
    ], month)

    expect(summary.plannedTotal).toBe(550)
    expect(summary.plannedPaidTotal + summary.plannedPendingTotal + summary.plannedOverdueTotal).toBe(550)
    expect(summary.plannedPaidTotal).toBe(40)
    expect(summary.paidByCashDateTotal).toBe(40)
  })

  it('no arrastra ingresos previstos futuros de meses anteriores si aun no han vencido', () => {
    const summary = getCashMonthSummary([
      { id: 'future-old-month', amount: 120, expected_date: '2026-04-20', is_paid: false, paid_date: null },
      { id: 'month', amount: 90, expected_date: '2026-05-29', is_paid: false, paid_date: null },
    ], { startOfMonth: '2026-05-01', endOfMonth: '2026-05-31', today: '2026-04-10' })

    expect(summary.plannedTotal).toBe(90)
    expect(summary.plannedPendingTotal).toBe(90)
    expect(summary.plannedOverdueTotal).toBe(0)
  })

  it('no proyecta deuda arrastrada a meses futuros', () => {
    const summary = getCashMonthSummary([
      { id: 'may-overdue', amount: 120, expected_date: '2026-05-20', is_paid: false, paid_date: null },
      { id: 'june', amount: 90, expected_date: '2026-06-15', is_paid: false, paid_date: null },
    ], { startOfMonth: '2026-06-01', endOfMonth: '2026-06-30', today: '2026-05-25' })

    expect(summary.plannedTotal).toBe(90)
    expect(summary.plannedPendingTotal).toBe(90)
    expect(summary.plannedOverdueTotal).toBe(0)
  })

  it('arrastra vencidos antiguos como parte del plan y los expone como acumulados', () => {
    const summary = getCashMonthSummary([
      { id: 'old', amount: 300, expected_date: '2026-04-20', is_paid: false, paid_date: null },
      { id: 'month', amount: 20, expected_date: '2026-05-05', is_paid: false, paid_date: null },
    ], month)

    expect(summary.plannedOverdueTotal).toBe(320)
    expect(summary.accumulatedOverdueTotal).toBe(300)
  })

  it('mantiene cobros pagados sin paid_date dentro del plan', () => {
    const summary = getCashMonthSummary([
      { id: 'paid-without-date', amount: 100, expected_date: '2026-05-10', is_paid: true, paid_date: null },
    ], month)

    expect(summary.plannedPaidTotal).toBe(100)
    expect(summary.paidByCashDateTotal).toBe(0)
    expect(summary.paidMissingDateCount).toBe(1)
  })

  it('agrega ingresos de eventos hijos al proyecto sin crear trabajo duplicado', () => {
    const works = getWorkSummaries({
      projects: [{ id: 'p1', name: 'Proyecto', client: 'Cliente', status: 'in_progress', start_date: '2026-05-01' }],
      events: [{ id: 'e1', project_id: 'p1', name: 'Evento hijo', start_datetime: '2026-05-10T08:00:00Z', status: 'confirmed' }],
      incomes: [{ id: 'i1', event_id: 'e1', amount: 250, expected_date: '2026-05-20', is_paid: false }],
      ...month,
    })

    expect(works).toHaveLength(1)
    expect(works[0]).toMatchObject({ id: 'p1', type: 'project', pending: 250 })
  })

  it('arrastra deuda antigua de eventos hijos al proyecto', () => {
    const works = getWorkSummaries({
      projects: [{ id: 'p1', name: 'Proyecto', client: 'Cliente', status: 'in_progress', start_date: '2026-05-01' }],
      events: [{ id: 'e1', project_id: 'p1', name: 'Evento hijo', start_datetime: '2026-05-10T08:00:00Z', status: 'confirmed' }],
      incomes: [{ id: 'i1', event_id: 'e1', amount: 250, expected_date: '2026-04-20', is_paid: false }],
      ...month,
    })

    expect(works).toHaveLength(1)
    expect(works[0]).toMatchObject({ id: 'p1', type: 'project', overdue: 250, debt: 250 })
  })

  it('crea trabajo propio para eventos independientes', () => {
    const works = getWorkSummaries({
      projects: [],
      events: [{ id: 'e1', project_id: null, name: 'Evento solo', start_datetime: '2026-05-10T08:00:00Z', status: 'confirmed' }],
      incomes: [{ id: 'i1', event_id: 'e1', amount: 120, expected_date: '2026-05-20', is_paid: false }],
      ...month,
    })

    expect(works).toHaveLength(1)
    expect(works[0]).toMatchObject({ id: 'e1', type: 'event', pending: 120 })
  })

  it('calcula KPIs de trabajos sobre trabajos relevantes', () => {
    const kpis = getWorkKpis([
      { debt: 100, pending: 80, overdue: 20, paid: 50 },
      { debt: 0, pending: 0, overdue: 0, paid: 200 },
    ])

    expect(kpis).toEqual({ debtWorks: 1, pendingTotal: 80, overdueTotal: 20, paidTotal: 250 })
  })

  it('separa trabajos por perseguir, cobro futuro y ya cobrados', () => {
    const sections = getWorkSections([
      { id: 'debt', type: 'project', debt: 90, pending: 90, overdue: 0, paid: 0, nextExpectedDate: '2026-05-29' },
      { id: 'future', type: 'project', debt: 0, pending: 0, overdue: 0, paid: 0, nextExpectedDate: '2026-06-10' },
      { id: 'paid', type: 'event', debt: 0, pending: 0, overdue: 0, paid: 200, nextExpectedDate: null },
    ], { endOfMonth: '2026-05-31' })

    expect(sections.map((section) => [section.id, section.works.map((work) => work.id)])).toEqual([
      ['attention', ['debt']],
      ['future', ['future']],
      ['paid', ['paid']],
    ])
  })

  it('ordena recibibles vencidos y próximos', () => {
    const receivables = getReceivables([
      { id: 'later', amount: 90, expected_date: '2026-05-29', is_paid: false },
      { id: 'old', amount: 300, expected_date: '2026-04-20', is_paid: false },
      { id: 'paid', amount: 20, expected_date: '2026-05-05', is_paid: true },
    ], { until: '2026-05-31' })

    expect(receivables.map((income) => income.id)).toEqual(['old', 'later'])
  })

  it('puede acotar recibibles para no mezclar deuda acumulada', () => {
    const receivables = getReceivables([
      { id: 'old', amount: 300, expected_date: '2026-04-20', is_paid: false },
      { id: 'month', amount: 20, expected_date: '2026-05-05', is_paid: false },
    ], { from: '2026-05-01', until: '2026-05-31' })

    expect(receivables.map((income) => income.id)).toEqual(['month'])
  })
})
