import { describe, expect, it } from 'vitest'
import {
  clampProjectRangeToYear,
  getBusiestMonth,
  getDefaultSelectedMonth,
  getNextProjectStart,
  getProjectActiveMonths,
  getProjectTimelineRows,
  getProjectsByMonth,
  getProjectsForMonth,
} from './projectYearCalendar'

describe('project year planning helpers', () => {
  it('detecta un proyecto que empieza y termina dentro del mismo mes', () => {
    expect(getProjectActiveMonths(
      { id: 'p1', name: 'Proyecto', start_date: '2026-05-15', end_date: '2026-05-20' },
      2026
    )).toEqual([4])
  })

  it('detecta todos los meses activos de un proyecto multi-mes', () => {
    expect(getProjectActiveMonths(
      { id: 'p1', name: 'Residencia', start_date: '2026-03-20', end_date: '2026-06-02' },
      2026
    )).toEqual([2, 3, 4, 5])
  })

  it('recorta un proyecto que viene de un ano anterior', () => {
    expect(clampProjectRangeToYear(
      { id: 'p1', name: 'Temporada', start_date: '2025-11-01', end_date: '2026-02-15' },
      2026
    )).toMatchObject({
      visibleStart: '2026-01-01',
      visibleEnd: '2026-02-15',
      startMonthIndex: 0,
      endMonthIndex: 1,
      startsBeforeYear: true,
      endsAfterYear: false,
    })
  })

  it('recorta un proyecto que termina en un ano posterior', () => {
    expect(clampProjectRangeToYear(
      { id: 'p1', name: 'Festival', start_date: '2026-11-20', end_date: '2027-01-10' },
      2026
    )).toMatchObject({
      visibleStart: '2026-11-20',
      visibleEnd: '2026-12-31',
      startMonthIndex: 10,
      endMonthIndex: 11,
      startsBeforeYear: false,
      endsAfterYear: true,
    })
  })

  it('trata proyectos sin fecha final como activos en su mes de inicio', () => {
    const [project] = getProjectsForMonth(
      [{ id: 'p1', name: 'Investigacion', start_date: '2026-04-08', end_date: null }],
      2026,
      3
    )

    expect(project).toMatchObject({
      title: 'Investigacion',
      startDate: '2026-04-08',
      endDate: null,
      visibleStart: '2026-04-08',
      visibleEnd: '2026-04-08',
    })
  })

  it('agrupa proyectos por mes y deja vacios los meses sin proyectos', () => {
    const months = getProjectsByMonth(
      [{ id: 'p1', name: 'Expo', start_date: '2026-04-01', end_date: '2026-04-30' }],
      2026
    )

    expect(months[2].projects).toHaveLength(0)
    expect(months[3].projects.map((project) => project.title)).toEqual(['Expo'])
  })

  it('calcula el mes mas cargado', () => {
    const busiestMonth = getBusiestMonth(
      [
        { id: 'p1', name: 'A', start_date: '2026-04-01', end_date: '2026-04-30' },
        { id: 'p2', name: 'B', start_date: '2026-04-20', end_date: '2026-05-02' },
        { id: 'p3', name: 'C', start_date: '2026-05-01', end_date: '2026-05-03' },
      ],
      2026
    )

    expect(busiestMonth?.monthLabel).toBe('Abril')
    expect(busiestMonth?.projects).toHaveLength(2)
  })

  it('calcula el proximo inicio desde una fecha dada', () => {
    const nextProject = getNextProjectStart(
      [
        { id: 'p1', name: 'Pasado', start_date: '2026-03-01', end_date: '2026-03-03' },
        { id: 'p2', name: 'Siguiente', start_date: '2026-05-10', end_date: '2026-05-12' },
        { id: 'p3', name: 'Despues', start_date: '2026-06-01', end_date: '2026-06-02' },
      ],
      '2026-05-01'
    )

    expect(nextProject).toMatchObject({ title: 'Siguiente', startDate: '2026-05-10' })
  })

  it('limita el proximo inicio al ano visible cuando se indica', () => {
    const nextProject = getNextProjectStart(
      [
        { id: 'p1', name: 'Cruza', start_date: '2025-12-20', end_date: '2026-01-10' },
        { id: 'p2', name: 'Visible', start_date: '2026-02-01', end_date: '2026-02-03' },
        { id: 'p3', name: 'Futuro', start_date: '2027-01-01', end_date: '2027-01-02' },
      ],
      '2026-01-01',
      { year: 2026 }
    )

    expect(nextProject).toMatchObject({ title: 'Visible', startDate: '2026-02-01' })
  })

  it('ordena las filas por fecha de inicio e ignora fechas invalidas', () => {
    const rows = getProjectTimelineRows(
      [
        { id: 'invalid', name: 'Sin fecha', start_date: null, end_date: null },
        { id: 'p2', name: 'B', start_date: '2026-05-01', end_date: '2026-05-02' },
        { id: 'p1', name: 'A', start_date: '2026-04-01', end_date: '2026-04-02' },
      ],
      2026
    )

    expect(rows.map((row) => row.id)).toEqual(['p1', 'p2'])
  })

  it('selecciona el mes actual si pertenece al ano visible', () => {
    expect(getDefaultSelectedMonth([], 2026, '2026-05-06')).toBe(4)
  })

  it('selecciona el primer mes con proyectos si el ano visible no es el actual', () => {
    expect(getDefaultSelectedMonth(
      [{ id: 'p1', name: 'Abril', start_date: '2026-04-01', end_date: '2026-04-30' }],
      2026,
      '2025-05-06'
    )).toBe(3)
  })
})
