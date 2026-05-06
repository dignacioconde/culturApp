import { describe, expect, it } from 'vitest'
import { isPaid, markPaid, markUnpaid, needsQuickPaidConfirmation, type PaymentState } from './payment'

describe('payment state', () => {
  it('deriva isPaid desde paid_date y mantiene compatibilidad con is_paid legacy', () => {
    expect(isPaid({ paid_date: null, is_paid: false })).toBe(false)
    expect(isPaid({ paid_date: '2026-05-16', is_paid: false })).toBe(true)
    expect(isPaid({ paid_date: null, is_paid: true })).toBe(true)
  })

  it('marca como cobrado con is_paid y paid_date coherentes', () => {
    expect(markPaid({ paid_date: null, is_paid: false }, new Date('2026-05-16T10:00:00Z'))).toEqual({
      paid_date: '2026-05-16',
      is_paid: true,
    })
  })

  it('marca como pendiente limpiando paid_date e is_paid', () => {
    expect(markUnpaid({ paid_date: '2026-05-16', is_paid: true })).toEqual({ paid_date: null, is_paid: false })
  })

  it('mantiene la propiedad derivada en cualquier estado base', () => {
    const states: PaymentState[] = [
      { paid_date: null, is_paid: false },
      { paid_date: '2026-01-01', is_paid: true },
    ]
    const date = new Date('2026-05-16T10:00:00Z')

    for (const state of states) {
      expect(isPaid(markPaid(state, date))).toBe(true)
      expect(isPaid(markUnpaid(state))).toBe(false)
    }
  })

  it('pide confirmacion para conceptos debiles en cobro rapido', () => {
    expect(needsQuickPaidConfirmation(null)).toBe(true)
    expect(needsQuickPaidConfirmation(undefined)).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: null })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: undefined })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: '' })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: '   ' })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: 'Ingreso' })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: ' ingreso ' })).toBe(true)
    expect(needsQuickPaidConfirmation({ concept: 'INGRESO' })).toBe(true)
  })

  it('no pide confirmacion para conceptos claros en cobro rapido', () => {
    expect(needsQuickPaidConfirmation({ concept: 'Actuación agosto' })).toBe(false)
  })
})
