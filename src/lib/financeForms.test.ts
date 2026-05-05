import { describe, expect, it } from 'vitest'
import { normalizeExpenseForm, normalizeIncomeForm } from './financeForms'

describe('finance form payloads', () => {
  it('normaliza ingreso con coma decimal y paid_date coherente', () => {
    const { payload, error } = normalizeIncomeForm(
      {
        concept: 'Actuacion',
        amount: '1.234,56',
        tax_rate: '15,5',
        expected_date: '2026-05-20',
        is_paid: true,
      },
      { paidAt: new Date('2026-05-16T20:30:00Z') },
    )

    expect(error).toBeNull()
    expect(payload).toMatchObject({
      amount: 1234.56,
      tax_rate: 15.5,
      is_paid: true,
      paid_date: '2026-05-16',
    })
  })

  it('mantiene la fecha de cobro existente al editar un ingreso ya cobrado', () => {
    const { payload } = normalizeIncomeForm(
      {
        concept: 'Actuacion',
        amount: '900,00',
        tax_rate: '15',
        is_paid: true,
      },
      {
        existingIncome: { is_paid: true, paid_date: '2026-05-10' },
        paidAt: new Date('2026-05-16T20:30:00Z'),
      },
    )

    expect(payload?.paid_date).toBe('2026-05-10')
  })

  it('limpia paid_date si el ingreso queda pendiente', () => {
    const { payload } = normalizeIncomeForm(
      {
        concept: 'Actuacion',
        amount: '900,00',
        tax_rate: '',
        is_paid: false,
      },
      {
        defaultTaxRate: 21,
        existingIncome: { is_paid: true, paid_date: '2026-05-10' },
      },
    )

    expect(payload).toMatchObject({
      tax_rate: 21,
      is_paid: false,
      paid_date: null,
    })
  })

  it('normaliza gastos con coma decimal sin Number()', () => {
    const { payload, error } = normalizeExpenseForm({
      concept: 'Taxi',
      amount: ',5',
      category: 'transporte',
    })

    expect(error).toBeNull()
    expect(payload?.amount).toBe(0.5)
  })

  it('rechaza importes no positivos', () => {
    expect(normalizeIncomeForm({ amount: '-1,5', tax_rate: '15', is_paid: false }).error).toBe('amount')
    expect(normalizeExpenseForm({ amount: '0' }).error).toBe('amount')
  })
})
