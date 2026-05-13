import { serializeCsv } from './csv'

export const BACKUP_VERSION = 2

export const CONTRACTOR_CSV_HEADERS = [
  'id',
  'name',
  'billing_name',
  'tax_id',
  'email',
  'phone',
  'billing_address',
  'notes',
  'created_at',
] as const

export const PROJECT_CSV_HEADERS = [
  'id',
  'contractor_id',
  'name',
  'client',
  'category',
  'status',
  'start_date',
  'end_date',
  'color',
  'notes',
  'created_at',
] as const

export const EVENT_CSV_HEADERS = [
  'id',
  'project_id',
  'contractor_id',
  'name',
  'client',
  'category',
  'status',
  'start_datetime',
  'end_datetime',
  'color',
  'notes',
  'created_at',
] as const

export const INCOME_CSV_HEADERS = [
  'id',
  'project_id',
  'event_id',
  'concept',
  'amount',
  'tax_rate',
  'expected_date',
  'paid_date',
  'is_paid',
  'created_at',
] as const

export const EXPENSE_CSV_HEADERS = [
  'id',
  'project_id',
  'event_id',
  'concept',
  'amount',
  'category',
  'expense_date',
  'is_deductible',
  'created_at',
] as const

type EntityRows = {
  contractors?: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  events: Record<string, unknown>[]
  incomes: Record<string, unknown>[]
  expenses: Record<string, unknown>[]
}

function withoutUserId(row: Record<string, unknown>): Record<string, unknown> {
  const { user_id: _userId, ...rest } = row
  return rest
}

function pick(headers: readonly string[], row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(headers.map((header) => [header, row[header] ?? '']))
}

export function buildBackupJson(entities: EntityRows, exportedAt = new Date()): string {
  return JSON.stringify({
    version: BACKUP_VERSION,
    exported_at: exportedAt.toISOString(),
    entities: {
      contractors: (entities.contractors ?? []).map(withoutUserId),
      projects: entities.projects.map(withoutUserId),
      events: entities.events.map(withoutUserId),
      incomes: entities.incomes.map(withoutUserId),
      expenses: entities.expenses.map(withoutUserId),
    },
  }, null, 2)
}

export function buildCsvFiles(entities: EntityRows) {
  return {
    contractors: {
      filename: 'caches-contractors.csv',
      headers: [...CONTRACTOR_CSV_HEADERS],
      content: serializeCsv([...CONTRACTOR_CSV_HEADERS], (entities.contractors ?? []).map((row) => pick(CONTRACTOR_CSV_HEADERS, row))),
    },
    projects: {
      filename: 'caches-projects.csv',
      headers: [...PROJECT_CSV_HEADERS],
      content: serializeCsv([...PROJECT_CSV_HEADERS], entities.projects.map((row) => pick(PROJECT_CSV_HEADERS, row))),
    },
    events: {
      filename: 'caches-events.csv',
      headers: [...EVENT_CSV_HEADERS],
      content: serializeCsv([...EVENT_CSV_HEADERS], entities.events.map((row) => pick(EVENT_CSV_HEADERS, row))),
    },
    incomes: {
      filename: 'caches-incomes.csv',
      headers: [...INCOME_CSV_HEADERS],
      content: serializeCsv([...INCOME_CSV_HEADERS], entities.incomes.map((row) => pick(INCOME_CSV_HEADERS, row))),
    },
    expenses: {
      filename: 'caches-expenses.csv',
      headers: [...EXPENSE_CSV_HEADERS],
      content: serializeCsv([...EXPENSE_CSV_HEADERS], entities.expenses.map((row) => pick(EXPENSE_CSV_HEADERS, row))),
    },
  }
}

export function buildExportSummary(entities: EntityRows) {
  return {
    contractors: (entities.contractors ?? []).length,
    projects: entities.projects.length,
    events: entities.events.length,
    incomes: entities.incomes.length,
    expenses: entities.expenses.length,
  }
}
