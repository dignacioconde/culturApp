import { describe, expect, it } from 'vitest'
import { IMPORT_HEADERS, MAX_DISPLAYED_ERRORS, validateCsvImport } from './importValidation'

function csvRow(values: Record<string, string> = {}) {
  return IMPORT_HEADERS.map((header) => values[header] ?? '').join(';')
}

function importCsv(rows: string[]) {
  return `${IMPORT_HEADERS.join(';')}\n${rows.join('\n')}\n`
}

describe('validateCsvImport', () => {
  it('genera un preview válido con payloads saneados y fechas Madrid en ISO UTC', () => {
    const { preview, error } = validateCsvImport(importCsv([
      csvRow({
        entity: 'project',
        project_key: 'p1',
        name: '  Proyecto  ',
        start_date: '2026-05-01',
        end_date: '2026-05-20',
      }),
      csvRow({
        entity: 'event',
        project_key: 'p1',
        event_key: 'e1',
        name: 'Evento',
        start_datetime: '2026-05-16 22:00',
        end_datetime: '2026-05-16 23:30',
      }),
      csvRow({
        entity: 'income',
        event_key: 'e1',
        concept: 'Caché',
        amount: '1.234,56',
        tax_rate: '15,5',
        expected_date: '2026-05-30',
        is_paid: 'sí',
      }),
      csvRow({
        entity: 'expense',
        project_key: 'p1',
        concept: 'Transporte',
        amount: '45,10',
        expense_date: '2026-05-12',
        is_deductible: 'no',
      }),
    ]))

    expect(error).toBeNull()
    expect(preview.valid).toBe(true)
    expect(preview.summary).toEqual({ project: 1, event: 1, income: 1, expense: 1 })
    expect(preview.projects[0].payload).not.toHaveProperty('user_id')
    expect(preview.events[0].payload.start_datetime).toBe('2026-05-16T20:00:00.000Z')
    expect(preview.incomes[0].payload.amount).toBe(1234.56)
    expect(preview.incomes[0].payload.tax_rate).toBe(15.5)
    expect(preview.incomes[0]).not.toHaveProperty('project_id')
    expect(preview.expenses[0].payload.is_deductible).toBe(false)
  })

  it('rechaza cabeceras prohibidas antes de planificar filas', () => {
    const headers = [...IMPORT_HEADERS, 'id'].join(';')
    const { preview, error } = validateCsvImport(`${headers}\n${csvRow({ entity: 'project', project_key: 'p1', name: 'Proyecto', start_date: '2026-05-01' })};raw-id\n`)

    expect(error?.message).toContain('plantilla')
    expect(preview.valid).toBe(false)
    expect(preview.errors.some((item) => item.column === 'id')).toBe(true)
    expect(preview.projects).toHaveLength(0)
  })

  it('rechaza valores con aspecto de fórmula en importación', () => {
    const { preview, error } = validateCsvImport(importCsv([
      csvRow({
        entity: 'project',
        project_key: 'p1',
        name: '=IMPORTXML("https://example.com")',
        start_date: '2026-05-01',
      }),
    ]))

    expect(error).toBeTruthy()
    expect(preview.valid).toBe(false)
    expect(preview.errors[0].message).toContain('fórmulas')
  })

  it('valida claves únicas y relaciones sin aceptar FKs crudas', () => {
    const { preview } = validateCsvImport(importCsv([
      csvRow({ entity: 'project', project_key: 'p1', name: 'Uno', start_date: '2026-05-01' }),
      csvRow({ entity: 'project', project_key: 'p1', name: 'Dos', start_date: '2026-05-02' }),
      csvRow({ entity: 'event', event_key: 'e1', project_key: 'missing', name: 'Evento', start_datetime: '2026-05-10 08:00' }),
      csvRow({ entity: 'income', project_key: 'p1', event_key: 'e1', concept: 'Caché', amount: '100' }),
      csvRow({ entity: 'expense', project_key: '00000000-0000-0000-0000-000000000000', concept: 'Gasto', amount: '10' }),
    ]))

    expect(preview.valid).toBe(false)
    expect(preview.errors.some((item) => item.message.includes('duplicado'))).toBe(true)
    expect(preview.errors.some((item) => item.message.includes('exactamente un'))).toBe(true)
    expect(preview.errors.some((item) => item.message.includes('00000000-0000-0000-0000-000000000000'))).toBe(true)
  })

  it('rechaza fechas, datetimes y decimales inválidos', () => {
    const { preview } = validateCsvImport(importCsv([
      csvRow({ entity: 'project', project_key: 'p1', name: 'Proyecto', start_date: '2026-02-30' }),
      csvRow({ entity: 'event', event_key: 'e1', name: 'Evento', start_datetime: '2026-05-10T08:00' }),
      csvRow({ entity: 'income', project_key: 'p1', concept: 'Caché', amount: '0', tax_rate: '120' }),
    ]))

    expect(preview.valid).toBe(false)
    expect(preview.errors.some((item) => item.column === 'start_date')).toBe(true)
    expect(preview.errors.some((item) => item.column === 'start_datetime')).toBe(true)
    expect(preview.errors.some((item) => item.column === 'amount')).toBe(true)
    expect(preview.errors.some((item) => item.column === 'tax_rate')).toBe(true)
  })

  it('aplica límites de tamaño, filas, columnas, celda y errores visibles', () => {
    const tooLarge = validateCsvImport(importCsv([]), { fileSize: 1024 * 1024 + 1 })
    expect(tooLarge.error?.message).toContain('1 MB')

    const tooManyRows = validateCsvImport(importCsv(Array.from({ length: 501 }, (_, index) =>
      csvRow({ entity: 'project', project_key: `p${index}`, name: 'Proyecto', start_date: '2026-05-01' }),
    )))
    expect(tooManyRows.error?.message).toContain('500')

    const manyFormulaRows = validateCsvImport(importCsv(Array.from({ length: MAX_DISPLAYED_ERRORS + 5 }, (_, index) =>
      csvRow({ entity: 'project', project_key: `p${index}`, name: '=x', start_date: '2026-05-01' }),
    )))
    expect(manyFormulaRows.preview.errors).toHaveLength(MAX_DISPLAYED_ERRORS)
    expect(manyFormulaRows.preview.hiddenErrorCount).toBeGreaterThan(0)

    const longCell = validateCsvImport(importCsv([
      csvRow({ entity: 'project', project_key: 'p1', name: 'x'.repeat(5001), start_date: '2026-05-01' }),
    ]))
    expect(longCell.preview.errors.some((item) => item.message.includes('5000'))).toBe(true)

    const headers = [...IMPORT_HEADERS, ...Array.from({ length: 10 }, (_, index) => `extra_${index}`)]
    const tooManyColumns = validateCsvImport(`${headers.join(';')}\n${headers.map(() => '').join(';')}\n`)
    expect(tooManyColumns.preview.errors.some((item) => item.message.includes('30 columnas'))).toBe(true)
  })
})
