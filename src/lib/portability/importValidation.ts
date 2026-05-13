import { parseDecimal } from '../decimal'
import { DEFAULT_TZ, fromLocalInputValue, toIsoUtc } from '../datetime'
import { isFormulaLike, parseCsv } from './csv'

export const REQUIRED_IMPORT_HEADERS = [
  'entity',
  'project_key',
  'event_key',
  'concept',
  'name',
  'client',
  'category',
  'status',
  'start_date',
  'end_date',
  'start_datetime',
  'end_datetime',
  'amount',
  'tax_rate',
  'expected_date',
  'paid_date',
  'is_paid',
  'expense_date',
  'is_deductible',
  'color',
  'notes',
] as const

export const OPTIONAL_IMPORT_HEADERS = [
  'contractor_key',
  'contractor_name',
  'billing_name',
  'tax_id',
  'email',
  'phone',
  'billing_address',
] as const

export const IMPORT_HEADERS = [
  ...REQUIRED_IMPORT_HEADERS,
  ...OPTIONAL_IMPORT_HEADERS,
] as const

export const FORBIDDEN_IMPORT_HEADERS = ['id', 'user_id', 'created_at', 'project_id', 'event_id', 'contractor_id'] as const
export const MAX_IMPORT_BYTES = 1024 * 1024
export const MAX_IMPORT_ROWS = 500
export const MAX_IMPORT_COLUMNS = 30
export const MAX_IMPORT_CELL_LENGTH = 5000
export const MAX_DISPLAYED_ERRORS = 100

type Entity = 'contractor' | 'project' | 'event' | 'income' | 'expense'
type ContractorLink = { type: 'key' | 'name'; value: string } | null

export type ImportError = {
  row: number
  column?: string
  message: string
}

export type ImportContractor = {
  row: number
  key: string
  payload: {
    name: string
    billing_name: string | null
    tax_id: string | null
    email: string | null
    phone: string | null
    billing_address: string | null
    notes: string | null
  }
}

export type ImportProject = {
  row: number
  key: string
  contractor: ContractorLink
  payload: {
    name: string
    client: string | null
    category: string
    status: string
    start_date: string
    end_date: string | null
    color: string
    notes: string | null
  }
}

export type ImportEvent = {
  row: number
  key: string
  project_key: string | null
  contractor: ContractorLink
  payload: {
    name: string
    client: string | null
    category: string
    status: string
    start_datetime: string
    end_datetime: string | null
    color: string
    notes: string | null
  }
}

export type ImportFinanceRow = {
  row: number
  link: { type: 'project' | 'event'; key: string }
  payload: {
    concept: string
    amount: number
    tax_rate?: number
    expected_date?: string | null
    paid_date?: string | null
    is_paid?: boolean
    category?: string
    expense_date?: string | null
    is_deductible?: boolean
  }
}

export type ImportPreview = {
  valid: boolean
  contractors: ImportContractor[]
  projects: ImportProject[]
  events: ImportEvent[]
  incomes: ImportFinanceRow[]
  expenses: ImportFinanceRow[]
  errors: ImportError[]
  hiddenErrorCount: number
  summary: Record<Entity, number>
}

type ParsedImportRow = {
  row: number
  values: string[]
  record: Record<string, string>
  entity: Entity | null
}

function emptyPreview(errors: ImportError[] = []): ImportPreview {
  return {
    valid: errors.length === 0,
    contractors: [],
    projects: [],
    events: [],
    incomes: [],
    expenses: [],
    errors: errors.slice(0, MAX_DISPLAYED_ERRORS),
    hiddenErrorCount: Math.max(0, errors.length - MAX_DISPLAYED_ERRORS),
    summary: { contractor: 0, project: 0, event: 0, income: 0, expense: 0 },
  }
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

function compact(value: string | null | undefined): string {
  return String(value ?? '').trim()
}

function normalizeContractorName(value: string | null | undefined): string {
  return compact(value).replace(/\s+/g, ' ').toLowerCase()
}

function optionalText(value: string | null | undefined): string | null {
  const trimmed = compact(value)
  return trimmed === '' ? null : trimmed
}

function withDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = compact(value)
  return trimmed === '' ? fallback : trimmed
}

function isValidDate(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const [, year, month, day] = match.map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function localDatetimeParts(value: string): { normalized: string; minutes: number } | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/)
  if (!match) return null
  const [, year, month, day, hour, minute] = match.map(Number)
  if (!isValidDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return {
    normalized: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    minutes: Date.UTC(year, month - 1, day, hour, minute),
  }
}

function toMadridIso(value: string): string | null {
  const parts = localDatetimeParts(value)
  if (!parts) return null
  return toIsoUtc(fromLocalInputValue(parts.normalized, DEFAULT_TZ))
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean | null {
  const raw = compact(value).toLowerCase()
  if (raw === '') return fallback
  if (['true', '1', 'yes', 'si', 'sí', 'paid', 'pagado'].includes(raw)) return true
  if (['false', '0', 'no', 'unpaid', 'pendiente'].includes(raw)) return false
  return null
}

function addError(errorsByRow: Map<number, ImportError[]>, row: number, column: string | undefined, message: string) {
  const errors = errorsByRow.get(row) ?? []
  errors.push({ row, column, message })
  errorsByRow.set(row, errors)
}

function rowHasErrors(errorsByRow: Map<number, ImportError[]>, row: number): boolean {
  return (errorsByRow.get(row)?.length ?? 0) > 0
}

function allErrors(errorsByRow: Map<number, ImportError[]>): ImportError[] {
  return [...errorsByRow.values()].flat().slice(0, MAX_DISPLAYED_ERRORS)
}

function countHiddenErrors(errorsByRow: Map<number, ImportError[]>): number {
  const count = [...errorsByRow.values()].reduce((total, errors) => total + errors.length, 0)
  return Math.max(0, count - MAX_DISPLAYED_ERRORS)
}

function validateDateField(
  errorsByRow: Map<number, ImportError[]>,
  row: number,
  record: Record<string, string>,
  column: string,
  required = false,
): string | null {
  const value = compact(record[column])
  if (value === '') {
    if (required) addError(errorsByRow, row, column, 'Campo obligatorio.')
    return null
  }
  if (!isValidDate(value)) {
    addError(errorsByRow, row, column, 'Usa una fecha YYYY-MM-DD válida.')
    return null
  }
  return value
}

function validateAmount(errorsByRow: Map<number, ImportError[]>, row: number, rawAmount: string | undefined): number | null {
  const amount = parseDecimal(compact(rawAmount), 'es-ES')
  if (amount === null || amount <= 0) {
    addError(errorsByRow, row, 'amount', 'El importe debe ser un número positivo.')
    return null
  }
  return amount
}

function validateTaxRate(errorsByRow: Map<number, ImportError[]>, row: number, rawRate: string | undefined): number {
  const value = compact(rawRate)
  if (value === '') return 15
  const taxRate = parseDecimal(value, 'es-ES')
  if (taxRate === null || taxRate < 0 || taxRate > 100) {
    addError(errorsByRow, row, 'tax_rate', 'La retención debe estar entre 0 y 100.')
    return 15
  }
  return taxRate
}

function contractorLink(record: Record<string, string>): ContractorLink {
  const key = optionalText(record.contractor_key)
  if (key) return { type: 'key', value: key }

  const name = optionalText(record.contractor_name)
  if (name) return { type: 'name', value: name }

  return null
}

export function validateCsvImport(text: string, options: { fileSize?: number } = {}): { preview: ImportPreview; error: Error | null } {
  const byteSize = options.fileSize ?? new Blob([text]).size
  if (byteSize > MAX_IMPORT_BYTES) {
    return { preview: emptyPreview(), error: new Error('El archivo supera el límite de 1 MB.') }
  }

  const parsed = parseCsv(text)
  const headers = parsed.headers.map(normalizeHeader)
  const errorsByRow = new Map<number, ImportError[]>()

  if (headers.length === 0) {
    return { preview: emptyPreview(), error: new Error('El CSV no tiene cabecera.') }
  }

  if (headers.length > MAX_IMPORT_COLUMNS) {
    addError(errorsByRow, 1, undefined, `El archivo no puede tener más de ${MAX_IMPORT_COLUMNS} columnas.`)
  }

  if (parsed.rows.length > MAX_IMPORT_ROWS) {
    return { preview: emptyPreview(), error: new Error(`El archivo no puede tener más de ${MAX_IMPORT_ROWS} filas.`) }
  }

  for (const forbiddenHeader of FORBIDDEN_IMPORT_HEADERS) {
    if (headers.includes(forbiddenHeader)) {
      addError(errorsByRow, 1, forbiddenHeader, `La cabecera ${forbiddenHeader} no se puede importar.`)
    }
  }

  for (const requiredHeader of REQUIRED_IMPORT_HEADERS) {
    if (!headers.includes(requiredHeader)) {
      addError(errorsByRow, 1, requiredHeader, `Falta la cabecera ${requiredHeader}.`)
    }
  }

  for (const header of headers) {
    if (![...IMPORT_HEADERS, ...FORBIDDEN_IMPORT_HEADERS].includes(header as never)) {
      addError(errorsByRow, 1, header, `Cabecera no reconocida: ${header}.`)
    }
  }

  if (rowHasErrors(errorsByRow, 1)) {
    const preview = emptyPreview(allErrors(errorsByRow))
    preview.hiddenErrorCount = countHiddenErrors(errorsByRow)
    preview.valid = false
    return { preview, error: new Error('El CSV no cumple la plantilla de importación.') }
  }

  const rows: ParsedImportRow[] = parsed.rows.map(({ rowNumber, values }) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
    return {
      row: rowNumber,
      values,
      record,
      entity: compact(record.entity) as Entity,
    }
  })

  const summary: Record<Entity, number> = { contractor: 0, project: 0, event: 0, income: 0, expense: 0 }
  const contractorKeyRows = new Map<string, number[]>()
  const projectKeyRows = new Map<string, number[]>()
  const eventKeyRows = new Map<string, number[]>()

  rows.forEach((row) => {
    if (row.values?.length > MAX_IMPORT_COLUMNS) {
      addError(errorsByRow, row.row, undefined, `La fila no puede tener más de ${MAX_IMPORT_COLUMNS} columnas.`)
    }
    if (row.values.length > headers.length) {
      addError(errorsByRow, row.row, undefined, 'La fila tiene más celdas que cabeceras.')
    }
  })

  for (const row of rows) {
    for (const [column, value] of Object.entries(row.record)) {
      if (value.length > MAX_IMPORT_CELL_LENGTH) {
        addError(errorsByRow, row.row, column, `La celda supera ${MAX_IMPORT_CELL_LENGTH} caracteres.`)
      }
      if (value !== '' && isFormulaLike(value)) {
        addError(errorsByRow, row.row, column, 'No se aceptan valores que parezcan fórmulas.')
      }
    }

    if (!['contractor', 'project', 'event', 'income', 'expense'].includes(compact(row.record.entity))) {
      addError(errorsByRow, row.row, 'entity', 'Entidad no reconocida.')
      row.entity = null
      continue
    }

    summary[row.entity as Entity] += 1

    if (row.entity === 'contractor') {
      const contractorKey = compact(row.record.contractor_key)
      if (contractorKey === '') addError(errorsByRow, row.row, 'contractor_key', 'contractor_key es obligatorio.')
      else contractorKeyRows.set(contractorKey, [...(contractorKeyRows.get(contractorKey) ?? []), row.row])
    }

    if (row.entity === 'project') {
      const projectKey = compact(row.record.project_key)
      if (projectKey === '') addError(errorsByRow, row.row, 'project_key', 'project_key es obligatorio.')
      else projectKeyRows.set(projectKey, [...(projectKeyRows.get(projectKey) ?? []), row.row])
    }

    if (row.entity === 'event') {
      const eventKey = compact(row.record.event_key)
      if (eventKey === '') addError(errorsByRow, row.row, 'event_key', 'event_key es obligatorio.')
      else eventKeyRows.set(eventKey, [...(eventKeyRows.get(eventKey) ?? []), row.row])
    }
  }

  const duplicateContractorKeys = new Set([...contractorKeyRows.entries()].filter(([, rowNumbers]) => rowNumbers.length > 1).map(([key]) => key))
  const duplicateProjectKeys = new Set([...projectKeyRows.entries()].filter(([, rowNumbers]) => rowNumbers.length > 1).map(([key]) => key))
  const duplicateEventKeys = new Set([...eventKeyRows.entries()].filter(([, rowNumbers]) => rowNumbers.length > 1).map(([key]) => key))

  for (const key of duplicateContractorKeys) {
    for (const row of contractorKeyRows.get(key) ?? []) {
      addError(errorsByRow, row, 'contractor_key', `contractor_key duplicado: ${key}.`)
    }
  }

  for (const key of duplicateProjectKeys) {
    for (const row of projectKeyRows.get(key) ?? []) {
      addError(errorsByRow, row, 'project_key', `project_key duplicado: ${key}.`)
    }
  }

  for (const key of duplicateEventKeys) {
    for (const row of eventKeyRows.get(key) ?? []) {
      addError(errorsByRow, row, 'event_key', `event_key duplicado: ${key}.`)
    }
  }

  for (const row of rows) {
    if (row.entity === 'contractor') {
      if (compact(row.record.name) === '') addError(errorsByRow, row.row, 'name', 'El nombre es obligatorio.')
    }

    if (row.entity === 'project') {
      if (compact(row.record.name) === '') addError(errorsByRow, row.row, 'name', 'El nombre es obligatorio.')
      const startDate = validateDateField(errorsByRow, row.row, row.record, 'start_date', true)
      const endDate = validateDateField(errorsByRow, row.row, row.record, 'end_date')
      if (startDate && endDate && endDate < startDate) {
        addError(errorsByRow, row.row, 'end_date', 'La fecha de fin no puede ser anterior al inicio.')
      }
      if (compact(row.record.contractor_key) && compact(row.record.contractor_name)) {
        addError(errorsByRow, row.row, 'contractor_key', 'Indica contractor_key o contractor_name, no ambos.')
      }
    }

    if (row.entity === 'event') {
      if (compact(row.record.name) === '') addError(errorsByRow, row.row, 'name', 'El nombre es obligatorio.')
      const start = localDatetimeParts(compact(row.record.start_datetime))
      const end = compact(row.record.end_datetime) ? localDatetimeParts(compact(row.record.end_datetime)) : null
      if (!start) addError(errorsByRow, row.row, 'start_datetime', 'Usa fecha y hora local YYYY-MM-DD HH:mm.')
      if (compact(row.record.end_datetime) && !end) addError(errorsByRow, row.row, 'end_datetime', 'Usa fecha y hora local YYYY-MM-DD HH:mm.')
      if (start && end && end.minutes < start.minutes) addError(errorsByRow, row.row, 'end_datetime', 'La fecha de fin no puede ser anterior al inicio.')
      if (compact(row.record.contractor_key) && compact(row.record.contractor_name)) {
        addError(errorsByRow, row.row, 'contractor_key', 'Indica contractor_key o contractor_name, no ambos.')
      }
    }

    if (row.entity === 'income' || row.entity === 'expense') {
      if (compact(row.record.concept) === '') addError(errorsByRow, row.row, 'concept', 'El concepto es obligatorio.')
      validateAmount(errorsByRow, row.row, row.record.amount)
      const hasProjectKey = compact(row.record.project_key) !== ''
      const hasEventKey = compact(row.record.event_key) !== ''
      if (hasProjectKey === hasEventKey) {
        addError(errorsByRow, row.row, 'project_key', 'Indica exactamente un project_key o un event_key.')
      }
      if (row.entity === 'income') {
        validateTaxRate(errorsByRow, row.row, row.record.tax_rate)
        validateDateField(errorsByRow, row.row, row.record, 'expected_date')
        validateDateField(errorsByRow, row.row, row.record, 'paid_date')
        if (parseBoolean(row.record.is_paid, false) === null) addError(errorsByRow, row.row, 'is_paid', 'Usa true/false, sí/no o 1/0.')
      }
      if (row.entity === 'expense') {
        validateDateField(errorsByRow, row.row, row.record, 'expense_date')
        if (parseBoolean(row.record.is_deductible, true) === null) addError(errorsByRow, row.row, 'is_deductible', 'Usa true/false, sí/no o 1/0.')
      }
    }
  }

  const validContractorKeys = new Set(
    rows
      .filter((row) => row.entity === 'contractor' && !rowHasErrors(errorsByRow, row.row))
      .map((row) => compact(row.record.contractor_key)),
  )

  const validProjectKeys = new Set(
    rows
      .filter((row) => row.entity === 'project' && !rowHasErrors(errorsByRow, row.row))
      .map((row) => compact(row.record.project_key)),
  )

  for (const row of rows) {
    if (row.entity === 'project' || row.entity === 'event') {
      const contractorKey = compact(row.record.contractor_key)
      if (contractorKey && !validContractorKeys.has(contractorKey)) {
        addError(errorsByRow, row.row, 'contractor_key', `No existe un contractor_key válido en el archivo: ${contractorKey}.`)
      }
    }

    if (row.entity === 'event') {
      const projectKey = compact(row.record.project_key)
      if (projectKey && !validProjectKeys.has(projectKey)) {
        addError(errorsByRow, row.row, 'project_key', `No existe un project_key válido en el archivo: ${projectKey}.`)
      }
    }
  }

  const validEventKeys = new Set(
    rows
      .filter((row) => row.entity === 'event' && !rowHasErrors(errorsByRow, row.row))
      .map((row) => compact(row.record.event_key)),
  )

  for (const row of rows) {
    if (row.entity !== 'income' && row.entity !== 'expense') continue
    const projectKey = compact(row.record.project_key)
    const eventKey = compact(row.record.event_key)
    if (projectKey && !validProjectKeys.has(projectKey)) {
      addError(errorsByRow, row.row, 'project_key', `No existe un project_key válido en el archivo: ${projectKey}.`)
    }
    if (eventKey && !validEventKeys.has(eventKey)) {
      addError(errorsByRow, row.row, 'event_key', `No existe un event_key válido en el archivo: ${eventKey}.`)
    }
  }

  const preview: ImportPreview = {
    valid: false,
    contractors: [],
    projects: [],
    events: [],
    incomes: [],
    expenses: [],
    errors: allErrors(errorsByRow),
    hiddenErrorCount: countHiddenErrors(errorsByRow),
    summary,
  }

  for (const row of rows) {
    if (!row.entity || rowHasErrors(errorsByRow, row.row)) continue
    if (row.entity === 'contractor') {
      preview.contractors.push({
        row: row.row,
        key: compact(row.record.contractor_key),
        payload: {
          name: compact(row.record.name),
          billing_name: optionalText(row.record.billing_name),
          tax_id: optionalText(row.record.tax_id),
          email: optionalText(row.record.email),
          phone: optionalText(row.record.phone),
          billing_address: optionalText(row.record.billing_address),
          notes: optionalText(row.record.notes),
        },
      })
    }

    if (row.entity === 'project') {
      preview.projects.push({
        row: row.row,
        key: compact(row.record.project_key),
        contractor: contractorLink(row.record),
        payload: {
          name: compact(row.record.name),
          client: optionalText(row.record.client),
          category: withDefault(row.record.category, 'otros'),
          status: withDefault(row.record.status, 'draft'),
          start_date: compact(row.record.start_date),
          end_date: optionalText(row.record.end_date),
          color: withDefault(row.record.color, '#4f98a3'),
          notes: optionalText(row.record.notes),
        },
      })
    }

    if (row.entity === 'event') {
      preview.events.push({
        row: row.row,
        key: compact(row.record.event_key),
        project_key: optionalText(row.record.project_key),
        contractor: contractorLink(row.record),
        payload: {
          name: compact(row.record.name),
          client: optionalText(row.record.client),
          category: withDefault(row.record.category, 'otros'),
          status: withDefault(row.record.status, 'draft'),
          start_datetime: toMadridIso(compact(row.record.start_datetime)) as string,
          end_datetime: compact(row.record.end_datetime) ? toMadridIso(compact(row.record.end_datetime)) : null,
          color: withDefault(row.record.color, '#4f98a3'),
          notes: optionalText(row.record.notes),
        },
      })
    }

    if (row.entity === 'income') {
      const projectKey = optionalText(row.record.project_key)
      const eventKey = optionalText(row.record.event_key)
      preview.incomes.push({
        row: row.row,
        link: projectKey ? { type: 'project', key: projectKey } : { type: 'event', key: eventKey as string },
        payload: {
          concept: compact(row.record.concept),
          amount: validateAmount(errorsByRow, row.row, row.record.amount) as number,
          tax_rate: validateTaxRate(errorsByRow, row.row, row.record.tax_rate),
          expected_date: optionalText(row.record.expected_date),
          paid_date: optionalText(row.record.paid_date),
          is_paid: parseBoolean(row.record.is_paid, false) as boolean,
        },
      })
    }

    if (row.entity === 'expense') {
      const projectKey = optionalText(row.record.project_key)
      const eventKey = optionalText(row.record.event_key)
      preview.expenses.push({
        row: row.row,
        link: projectKey ? { type: 'project', key: projectKey } : { type: 'event', key: eventKey as string },
        payload: {
          concept: compact(row.record.concept),
          amount: validateAmount(errorsByRow, row.row, row.record.amount) as number,
          category: withDefault(row.record.category, 'otros'),
          expense_date: optionalText(row.record.expense_date),
          is_deductible: parseBoolean(row.record.is_deductible, true) as boolean,
        },
      })
    }
  }

  preview.valid = preview.errors.length === 0 && preview.hiddenErrorCount === 0
  return {
    preview,
    error: preview.valid ? null : new Error('El CSV contiene errores de validación.'),
  }
}

export function hasImportErrors(preview: ImportPreview | null | undefined): boolean {
  return !preview || !preview.valid || preview.errors.length > 0 || preview.hiddenErrorCount > 0
}
