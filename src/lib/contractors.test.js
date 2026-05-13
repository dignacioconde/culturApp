import { describe, expect, it } from 'vitest'
import { getEventContractor, getProjectContractor, normalizeContractorName } from './contractors'

describe('contractor helpers', () => {
  const contractors = [
    { id: 'c1', name: 'Ayuntamiento' },
    { id: 'c2', name: 'Sala privada' },
  ]

  it('normaliza nombres para deduplicar espacios y mayúsculas', () => {
    expect(normalizeContractorName('  Ayuntamiento   de Madrid ')).toBe('ayuntamiento de madrid')
  })

  it('resuelve contratante de proyecto o client legacy', () => {
    expect(getProjectContractor({ contractor_id: 'c1', client: 'Legacy' }, contractors)).toMatchObject({
      name: 'Ayuntamiento',
      source: 'contractor',
    })
    expect(getProjectContractor({ client: 'Legacy' }, contractors)).toMatchObject({
      name: 'Legacy',
      source: 'legacy',
    })
  })

  it('marca como heredado el contratante persistido desde proyecto', () => {
    const projects = [{ id: 'p1', contractor_id: 'c1' }]
    const event = { project_id: 'p1', contractor_id: 'c1', client: 'Legacy' }

    expect(getEventContractor(event, projects, contractors)).toMatchObject({
      name: 'Ayuntamiento',
      source: 'project',
    })
  })

  it('permite override de contratante propio en evento', () => {
    const projects = [{ id: 'p1', contractor_id: 'c1' }]
    const event = { project_id: 'p1', contractor_id: 'c2' }

    expect(getEventContractor(event, projects, contractors)).toMatchObject({
      name: 'Sala privada',
      source: 'contractor',
    })
  })
})
