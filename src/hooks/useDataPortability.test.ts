import { describe, expect, it, vi } from 'vitest'

vi.mock('../supabaseClient', () => ({ supabase: {} }))

const { commitPortableImport, exportPortableData } = await import('./useDataPortability.js')

function createExportClient(rowsByTable = {}) {
  const calls = []

  return {
    calls,
    from(table) {
      const chain = {
        select(columns) {
          calls.push({ table, method: 'select', columns })
          return chain
        },
        eq(column, value) {
          calls.push({ table, method: 'eq', column, value })
          return chain
        },
        order(column, options) {
          calls.push({ table, method: 'order', column, options })
          return Promise.resolve({ data: rowsByTable[table] ?? [], error: null })
        },
      }
      return chain
    },
  }
}

function createImportClient() {
  const inserts = []
  const ids = { contractors: 0, projects: 0, events: 0 }

  return {
    inserts,
    from(table) {
      return {
        select(columns) {
          if (table === 'contractors') {
            return {
              async eq() {
                return { data: [], error: null, columns }
              },
            }
          }
          return this
        },
        insert(payload) {
          inserts.push({ table, payload })

          if (table === 'contractors' || table === 'projects' || table === 'events') {
            ids[table] += 1
            const id = `${table}-${ids[table]}`
            return {
              select(columns) {
                return {
                  async single() {
                    return { data: { id, columns }, error: null }
                  },
                }
              },
            }
          }

          return Promise.resolve({ error: null })
        },
      }
    },
  }
}

describe('data portability Supabase contract', () => {
  it('exporta cada entidad filtrando siempre por user_id autenticado', async () => {
    const client = createExportClient({
      projects: [{ id: 'p1', user_id: 'u1', name: 'Proyecto' }],
      events: [{ id: 'e1', user_id: 'u1', name: 'Evento' }],
      contractors: [{ id: 'c1', user_id: 'u1', name: 'Contratante' }],
      incomes: [{ id: 'i1', user_id: 'u1', amount: 100 }],
      expenses: [{ id: 'x1', user_id: 'u1', amount: 10 }],
    })

    const { data, error } = await exportPortableData(client, 'auth-user')

    expect(error).toBeNull()
    expect(data.summary).toEqual({ contractors: 1, projects: 1, events: 1, incomes: 1, expenses: 1 })
    expect(client.calls.filter((call) => call.method === 'eq')).toEqual([
      { table: 'contractors', method: 'eq', column: 'user_id', value: 'auth-user' },
      { table: 'projects', method: 'eq', column: 'user_id', value: 'auth-user' },
      { table: 'events', method: 'eq', column: 'user_id', value: 'auth-user' },
      { table: 'incomes', method: 'eq', column: 'user_id', value: 'auth-user' },
      { table: 'expenses', method: 'eq', column: 'user_id', value: 'auth-user' },
    ])
  })

  it('importa create-only sobreescribiendo ownership y resolviendo claves locales', async () => {
    const client = createImportClient()
    const preview = {
      valid: true,
      errors: [],
      hiddenErrorCount: 0,
      contractors: [{
        row: 2,
        key: 'c1',
        payload: {
          name: 'Contratante',
          user_id: 'csv-user',
        },
      }],
      projects: [{
        row: 3,
        key: 'p1',
        contractor: { type: 'key', value: 'c1' },
        payload: {
          name: 'Proyecto',
          start_date: '2026-05-01',
          user_id: 'csv-user',
        },
      }],
      events: [{
        row: 4,
        key: 'e1',
        project_key: 'p1',
        contractor: { type: 'name', value: 'Sala nueva' },
        payload: {
          name: 'Evento',
          start_datetime: '2026-05-02T06:00:00.000Z',
          project_id: 'raw-project-id',
          user_id: 'csv-user',
        },
      }],
      incomes: [{
        row: 5,
        link: { type: 'event', key: 'e1' },
        payload: {
          concept: 'Caché',
          amount: 100,
          project_id: 'raw-project-id',
          event_id: 'raw-event-id',
          user_id: 'csv-user',
        },
      }],
      expenses: [{
        row: 6,
        link: { type: 'project', key: 'p1' },
        payload: {
          concept: 'Material',
          amount: 10,
          project_id: 'raw-project-id',
          event_id: 'raw-event-id',
          user_id: 'csv-user',
        },
      }],
    }

    const { data, error } = await commitPortableImport(client, 'auth-user', preview)

    expect(error).toBeNull()
    expect(data.inserted).toEqual({ contractors: 2, projects: 1, events: 1, incomes: 1, expenses: 1 })
    expect(client.inserts).toEqual([
      {
        table: 'contractors',
        payload: expect.objectContaining({ name: 'Contratante', user_id: 'auth-user' }),
      },
      {
        table: 'projects',
        payload: expect.objectContaining({ name: 'Proyecto', contractor_id: 'contractors-1', user_id: 'auth-user' }),
      },
      {
        table: 'contractors',
        payload: expect.objectContaining({ name: 'Sala nueva', user_id: 'auth-user' }),
      },
      {
        table: 'events',
        payload: expect.objectContaining({ name: 'Evento', project_id: 'projects-1', contractor_id: 'contractors-2', user_id: 'auth-user' }),
      },
      {
        table: 'incomes',
        payload: expect.objectContaining({ concept: 'Caché', project_id: null, event_id: 'events-1', user_id: 'auth-user' }),
      },
      {
        table: 'expenses',
        payload: expect.objectContaining({ concept: 'Material', project_id: 'projects-1', event_id: null, user_id: 'auth-user' }),
      },
    ])
  })

  it('hereda contractor_id del proyecto al importar eventos sin contratante propio', async () => {
    const client = createImportClient()
    const preview = {
      valid: true,
      errors: [],
      hiddenErrorCount: 0,
      contractors: [{
        row: 2,
        key: 'c1',
        payload: {
          name: 'Contratante',
        },
      }],
      projects: [{
        row: 3,
        key: 'p1',
        contractor: { type: 'key', value: 'c1' },
        payload: {
          name: 'Proyecto',
          start_date: '2026-05-01',
        },
      }],
      events: [{
        row: 4,
        key: 'e1',
        project_key: 'p1',
        contractor: null,
        payload: {
          name: 'Evento heredado',
          start_datetime: '2026-05-02T06:00:00.000Z',
        },
      }],
      incomes: [],
      expenses: [],
    }

    const { data, error } = await commitPortableImport(client, 'auth-user', preview)

    expect(error).toBeNull()
    expect(data.inserted).toEqual({ contractors: 1, projects: 1, events: 1, incomes: 0, expenses: 0 })
    expect(client.inserts).toContainEqual({
      table: 'events',
      payload: expect.objectContaining({
        name: 'Evento heredado',
        project_id: 'projects-1',
        contractor_id: 'contractors-1',
        user_id: 'auth-user',
      }),
    })
  })
})
