import { describe, expect, it } from 'vitest'
import { formatDueDescription, formatDueText, getDueDays } from './dueDates'

const today = '2026-05-07'

describe('due date helpers', () => {
  it('calcula dias de vencimiento desde una fecha local base', () => {
    expect(getDueDays('2026-05-06', today)).toBe(-1)
    expect(getDueDays('2026-05-07', today)).toBe(0)
    expect(getDueDays('2026-05-08', today)).toBe(1)
    expect(getDueDays('2026-05-12', today)).toBe(5)
  })

  it('formatea el texto relativo de vencimiento igual que el dashboard', () => {
    expect(formatDueText('2026-05-06', today)).toBe('Vencido hace 1 d')
    expect(formatDueText('2026-05-07', today)).toBe('Vence hoy')
    expect(formatDueText('2026-05-08', today)).toBe('Vence mañana')
    expect(formatDueText('2026-05-12', today)).toBe('Vence en 5 d')
    expect(formatDueText(null, today)).toBe('Sin fecha prevista')
  })

  it('incluye la fecha formateada cuando hay fecha prevista', () => {
    expect(formatDueDescription('2026-05-08', today)).toBe('Vence mañana · 08/05/2026')
    expect(formatDueDescription(null, today)).toBe('Sin fecha prevista')
  })
})
