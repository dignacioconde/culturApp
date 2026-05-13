import { describe, expect, it } from 'vitest'
import { buildBackupJson, buildCsvFiles, buildExportSummary } from './exportData'

describe('export portability helpers', () => {
  it('crea backup JSON sin user_id y con ids de fila', () => {
    const backup = JSON.parse(buildBackupJson({
      projects: [{ id: 'p1', user_id: 'u1', name: 'Proyecto', start_date: '2026-05-01' }],
      events: [],
      incomes: [],
      expenses: [],
    }, new Date('2026-05-07T10:00:00.000Z')))

    expect(backup.version).toBe(2)
    expect(backup.exported_at).toBe('2026-05-07T10:00:00.000Z')
    expect(backup.entities.projects[0]).toEqual({ id: 'p1', name: 'Proyecto', start_date: '2026-05-01' })
  })

  it('crea CSVs por entidad sin user_id y con texto formula-safe', () => {
    const csvFiles = buildCsvFiles({
      contractors: [{ id: 'c1', user_id: 'u1', name: 'Contratante' }],
      projects: [{ id: 'p1', user_id: 'u1', name: '+Proyecto', start_date: '2026-05-01' }],
      events: [{ id: 'e1', user_id: 'u1', project_id: 'p1', name: 'Evento', start_datetime: '2026-05-10T06:00:00.000Z' }],
      incomes: [{ id: 'i1', user_id: 'u1', event_id: 'e1', concept: 'Caché', amount: 100 }],
      expenses: [{ id: 'x1', user_id: 'u1', project_id: 'p1', concept: 'Material', amount: 10 }],
    })

    expect(csvFiles.projects.content).not.toContain('user_id')
    expect(csvFiles.contractors.content).toContain('Contratante')
    expect(csvFiles.projects.content).toContain("'+Proyecto")
    expect(csvFiles.events.content).toContain('project_id')
    expect(csvFiles.incomes.content).toContain('event_id')
  })

  it('resume recuentos por entidad', () => {
    expect(buildExportSummary({
      contractors: [{ id: 'c1' }],
      projects: [{ id: 'p1' }],
      events: [{ id: 'e1' }, { id: 'e2' }],
      incomes: [],
      expenses: [{ id: 'x1' }],
    })).toEqual({ contractors: 1, projects: 1, events: 2, incomes: 0, expenses: 1 })
  })
})
