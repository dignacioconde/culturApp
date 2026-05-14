import { describe, expect, it } from 'vitest'
import { buildEventsIcs, escapeIcsText, formatIcsDateTime } from './calendarIcs'

describe('calendar ICS feed', () => {
  it('escapa texto iCalendar sensible', () => {
    expect(escapeIcsText('Sala, A; línea\\nueva\nok')).toBe('Sala\\, A\\; línea\\\\nueva\\nok')
  })

  it('formatea fechas UTC estables', () => {
    expect(formatIcsDateTime('2026-05-14T08:30:00.000Z')).toBe('20260514T083000Z')
  })

  it('genera un VEVENT por evento sin exponer campos privados', () => {
    const ics = buildEventsIcs({
      calendarName: 'Agenda privada',
      generatedAt: '2026-05-14T10:00:00.000Z',
      events: [
        {
          id: 'event-1',
          name: 'Concierto, Sala A',
          status: 'confirmed',
          category: 'concierto',
          project_name: 'Gira norte',
          start_datetime: '2026-05-20T18:00:00.000Z',
          end_datetime: '2026-05-20T19:30:00.000Z',
          // @ts-expect-error deliberately proving extra private fields are ignored
          user_id: 'user-1',
          notes: 'Privado',
          amount: 987654,
        },
      ],
    })

    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('UID:event-1@caches.es')
    expect(ics).toContain('SUMMARY:Concierto\\, Sala A')
    expect(ics).toContain('DTSTART:20260520T180000Z')
    expect(ics).toContain('DTEND:20260520T193000Z')
    expect(ics).toContain('Proyecto: Gira norte')
    expect(ics).not.toContain('user-1')
    expect(ics).not.toContain('Privado')
    expect(ics).not.toContain('987654')
  })

  it('usa fin por defecto de una hora cuando falta end_datetime', () => {
    const ics = buildEventsIcs({
      generatedAt: '2026-05-14T10:00:00.000Z',
      events: [
        {
          id: 'event-2',
          name: 'Ensayo',
          start_datetime: '2026-05-20T18:00:00.000Z',
          end_datetime: null,
        },
      ],
    })

    expect(ics).toContain('DTSTART:20260520T180000Z')
    expect(ics).toContain('DTEND:20260520T190000Z')
  })
})
