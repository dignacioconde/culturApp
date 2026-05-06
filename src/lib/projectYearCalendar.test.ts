import { describe, expect, it } from 'vitest'
import { buildProjectYearMonths, getProjectMonthSegments } from './projectYearCalendar'

describe('project year calendar helper', () => {
  it('segmenta un proyecto de un solo dia en una unica celda', () => {
    const [segment] = getProjectMonthSegments(
      { id: 'p1', name: 'Proyecto', color: '#123456', start_date: '2026-05-15', end_date: '2026-05-15' },
      '2026-05-01',
      '2026-05-31'
    )

    expect(segment).toMatchObject({
      projectId: 'p1',
      title: 'Proyecto',
      color: '#123456',
      visibleStart: '2026-05-15',
      visibleEnd: '2026-05-15',
      startColumn: 5,
      endColumn: 5,
      span: 1,
      startsInCell: true,
      endsInCell: true,
    })
  })

  it('parte un proyecto largo en segmentos semanales dentro del mismo mes', () => {
    const segments = getProjectMonthSegments(
      { id: 'p1', name: 'Residencia', start_date: '2026-05-10', end_date: '2026-05-20' },
      '2026-05-01',
      '2026-05-31'
    )

    expect(segments).toHaveLength(2)
    expect(segments[0]).toMatchObject({
      visibleStart: '2026-05-10',
      visibleEnd: '2026-05-16',
      startColumn: 0,
      endColumn: 6,
      span: 7,
      startsInCell: true,
      endsInCell: false,
    })
    expect(segments[1]).toMatchObject({
      visibleStart: '2026-05-17',
      visibleEnd: '2026-05-20',
      startColumn: 0,
      endColumn: 3,
      span: 4,
      startsInCell: false,
      endsInCell: true,
    })
  })

  it('recorta correctamente el inicio visible cuando el proyecto viene del mes anterior', () => {
    const segments = getProjectMonthSegments(
      { id: 'p1', name: 'Gira', start_date: '2026-04-29', end_date: '2026-05-03' },
      '2026-05-01',
      '2026-05-31'
    )

    expect(segments).toHaveLength(2)
    expect(segments[0]).toMatchObject({
      visibleStart: '2026-05-01',
      visibleEnd: '2026-05-02',
      startColumn: 5,
      endColumn: 6,
      span: 2,
      startsInCell: false,
      endsInCell: false,
    })
    expect(segments[1]).toMatchObject({
      visibleStart: '2026-05-03',
      visibleEnd: '2026-05-03',
      startColumn: 0,
      endColumn: 0,
      span: 1,
      startsInCell: false,
      endsInCell: true,
    })
  })

  it('recorta diciembre a enero por el mes visible sin perder el final real', () => {
    const segments = getProjectMonthSegments(
      { id: 'p1', name: 'Temporada', start_date: '2026-12-28', end_date: '2027-01-04' },
      '2027-01-01',
      '2027-01-31'
    )

    expect(segments).toHaveLength(2)
    expect(segments[0]).toMatchObject({
      visibleStart: '2027-01-01',
      visibleEnd: '2027-01-02',
      startsInCell: false,
      endsInCell: false,
      span: 2,
    })
    expect(segments[1]).toMatchObject({
      visibleStart: '2027-01-03',
      visibleEnd: '2027-01-04',
      startsInCell: false,
      endsInCell: true,
      span: 2,
    })
  })

  it('respeta febrero bisiesto en el ano construido', () => {
    const months = buildProjectYearMonths(
      [{ id: 'p1', name: 'Expo', start_date: '2028-02-28', end_date: '2028-03-01' }],
      2028,
      { today: '2028-02-15' }
    )

    const february = months[1]
    const februarySegments = february.weeks.flatMap((week) => week.segments)

    expect(february.monthEnd).toBe('2028-02-29')
    expect(februarySegments.some((segment) => segment.visibleEnd === '2028-02-29')).toBe(true)
  })

  it('asigna lanes distintas cuando dos proyectos se solapan en la misma semana', () => {
    const months = buildProjectYearMonths(
      [
        { id: 'p1', name: 'Proyecto A', start_date: '2026-05-11', end_date: '2026-05-14' },
        { id: 'p2', name: 'Proyecto B', start_date: '2026-05-12', end_date: '2026-05-15' },
      ],
      2026
    )

    const mayWeek = months[4].weeks.find((week) => week.start === '2026-05-10')

    expect(mayWeek?.segments.map((segment) => [segment.projectId, segment.lane])).toEqual([
      ['p1', 0],
      ['p2', 1],
    ])
  })
})
