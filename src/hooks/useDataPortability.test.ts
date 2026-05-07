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
  const ids = { projects: 0, events: 0 }

  return {
    inserts,
    from(table) {
      return {
        insert(payload) {
          inserts.push({ table, payload })

          if (table === 'projects' || table === 'events') {
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
      incomes: [{ id: 'i1', user_id: 'u1', amount: 100 }],
      expenses: [{ id: 'x1', user_id: 'u1', amount: 10 }],
    })

    const { data, error } = await exportPortableData(client, 'auth-user')

    expect(error).toBeNull()
    expect(data.summary).toEqual({ projects: 1, events: 1, incomes: 1, expenses: 1 })
    expect(client.calls.filter((call) => call.method === 'eq')).toEqual([
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
      projects: [{
        row: 2,
        key: 'p1',
        payload: {
          name: 'Proyecto',
          start_date: '2026-05-01',
          user_id: 'csv-user',
        },
      }],
      events: [{
        row: 3,
        key: 'e1',
        project_key: 'p1',
        payload: {
          name: 'Evento',
          start_datetime: '2026-05-02T06:00:00.000Z',
          project_id: 'raw-project-id',
          user_id: 'csv-user',
        },
      }],
      incomes: [{
        row: 4,
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
        row: 5,
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
    expect(data.inserted).toEqual({ projects: 1, events: 1, incomes: 1, expenses: 1 })
    expect(client.inserts).toEqual([
      {
        table: 'projects',
        payload: expect.objectContaining({ name: 'Proyecto', user_id: 'auth-user' }),
      },
      {
        table: 'events',
        payload: expect.objectContaining({ name: 'Evento', project_id: 'projects-1', user_id: 'auth-user' }),
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
})
