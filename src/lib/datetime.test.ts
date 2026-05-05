import { describe, expect, it } from 'vitest'
import { fromLocalInputValue, toIsoUtc, toLocalInputValue } from './datetime'

describe('datetime local input conversion', () => {
  it('formatea un instante UTC como hora local de Madrid en CEST', () => {
    const instant = new Date('2026-05-16T20:00:00Z')
    expect(toLocalInputValue(instant, 'Europe/Madrid')).toBe('2026-05-16T22:00')
    expect(toLocalInputValue(instant, 'UTC')).toBe('2026-05-16T20:00')
  })

  it('convierte input local Madrid a instante UTC', () => {
    expect(fromLocalInputValue('2026-05-16T22:00', 'Europe/Madrid').toISOString())
      .toBe('2026-05-16T20:00:00.000Z')
  })

  it('normaliza la hora inexistente del cambio horario de primavera al siguiente instante valido', () => {
    const instant = fromLocalInputValue('2026-03-29T02:30', 'Europe/Madrid')
    expect(instant.toISOString()).toBe('2026-03-29T01:30:00.000Z')
    expect(toLocalInputValue(instant, 'Europe/Madrid')).toBe('2026-03-29T03:30')
  })

  it('elige la primera ocurrencia en la hora ambigua de otono', () => {
    const instant = fromLocalInputValue('2026-10-25T02:30', 'Europe/Madrid')
    expect(instant.toISOString()).toBe('2026-10-25T00:30:00.000Z')
    expect(toLocalInputValue(instant, 'Europe/Madrid')).toBe('2026-10-25T02:30')
  })

  it('serializa a ISO UTC para Supabase', () => {
    expect(toIsoUtc(new Date('2026-05-16T20:00:00Z'))).toBe('2026-05-16T20:00:00.000Z')
  })
})
