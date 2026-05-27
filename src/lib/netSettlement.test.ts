import { describe, expect, it } from 'vitest'
import { getGrossHourlyRateSummary, getNetSettlementSummary } from './netSettlement'

describe('net settlement helpers', () => {
  it('separa gastos internos y repercutibles en el neto operativo', () => {
    const summary = getNetSettlementSummary({
      incomes: [
        { id: 'i1', amount: 1000, tax_rate: 15, is_paid: true, paid_date: '2026-05-10' },
        { id: 'i2', amount: 300, tax_rate: 15, is_paid: false },
      ],
      expenses: [
        { id: 'x1', amount: 100, expense_kind: 'internal' },
        { id: 'x2', amount: 50, expense_kind: 'reimbursable', reimbursed_by_income_id: 'i1' },
        { id: 'x3', amount: 25, expense_kind: 'reimbursable' },
      ],
    })

    expect(summary.grossTotal).toBe(1300)
    expect(summary.paidTotal).toBe(1000)
    expect(summary.pendingTotal).toBe(300)
    expect(summary.retentionTotal).toBe(150)
    expect(summary.internalExpensesTotal).toBe(100)
    expect(summary.reimbursableExpensesTotal).toBe(75)
    expect(summary.linkedReimbursableExpensesTotal).toBe(50)
    expect(summary.unlinkedReimbursableExpensesTotal).toBe(25)
    expect(summary.operationalNet).toBe(675)
  })

  it('trata gastos legacy sin tipo como internos', () => {
    const summary = getNetSettlementSummary({
      incomes: [{ amount: 200, tax_rate: 0, is_paid: true, paid_date: '2026-05-10' }],
      expenses: [{ amount: 30 }],
    })

    expect(summary.internalExpensesTotal).toBe(30)
    expect(summary.reimbursableExpensesTotal).toBe(0)
    expect(summary.operationalNet).toBe(170)
  })

  it('calcula cobro bruto/hora solo con ingresos cobrados enlazados a eventos', () => {
    const summary = getGrossHourlyRateSummary({
      incomes: [
        { amount: 500, event_id: 'e1', is_paid: true, paid_date: '2026-05-10' },
        { amount: 200, event_id: 'e2', is_paid: false },
        { amount: 300, is_paid: true, paid_date: '2026-05-11' },
      ],
      events: [
        { id: 'e1', start_datetime: '2026-05-10T18:00:00.000Z', end_datetime: '2026-05-10T20:00:00.000Z' },
        { id: 'e2', start_datetime: '2026-05-11T18:00:00.000Z', end_datetime: '2026-05-11T22:00:00.000Z' },
      ],
    })

    expect(summary.paidEventIncomeTotal).toBe(500)
    expect(summary.hours).toBe(2)
    expect(summary.grossHourlyRate).toBe(250)
  })
})
