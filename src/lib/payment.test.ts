import { describe, expect, it } from 'vitest'
import { isPaid, markPaid, markUnpaid, type PaymentState } from './payment'

describe('payment state', () => {
  it('deriva isPaid desde paid_date', () => {
    expect(isPaid({ paid_date: null })).toBe(false)
    expect(isPaid({ paid_date: '2026-05-16T10:00:00Z' })).toBe(true)
  })

  it('marca como cobrado con paid_date coherente', () => {
    expect(markPaid({ paid_date: null }, new Date('2026-05-16T10:00:00Z'))).toEqual({
      paid_date: '2026-05-16T10:00:00.000Z',
    })
  })

  it('marca como pendiente limpiando paid_date', () => {
    expect(markUnpaid({ paid_date: '2026-05-16T10:00:00.000Z' })).toEqual({ paid_date: null })
  })

  it('mantiene la propiedad derivada en cualquier estado base', () => {
    const states: PaymentState[] = [
      { paid_date: null },
      { paid_date: '2026-01-01T00:00:00.000Z' },
    ]
    const date = new Date('2026-05-16T10:00:00Z')

    for (const state of states) {
      expect(isPaid(markPaid(state, date))).toBe(true)
      expect(isPaid(markUnpaid(state))).toBe(false)
    }
  })
})
