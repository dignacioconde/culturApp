import { describe, expect, it } from 'vitest'
import { buildEventPayload } from './eventPayload'

describe('buildEventPayload', () => {
  it('convierte un input local Madrid a ISO UTC antes de persistir', () => {
    const payload = buildEventPayload({
      name: 'Cache nocturno',
      start_datetime: '2026-05-16T22:00',
      end_datetime: '2026-05-16T23:00',
    }, 'Europe/Madrid')

    expect(payload.start_datetime).toBe('2026-05-16T20:00:00.000Z')
    expect(payload.end_datetime).toBe('2026-05-16T21:00:00.000Z')
  })

  it('mantiene end_datetime nulo si no hay fin', () => {
    const payload = buildEventPayload({
      name: 'Cache sin fin',
      start_datetime: '2026-01-10T08:00',
      end_datetime: null,
    }, 'Europe/Madrid')

    expect(payload.start_datetime).toBe('2026-01-10T07:00:00.000Z')
    expect(payload.end_datetime).toBeNull()
  })
})
