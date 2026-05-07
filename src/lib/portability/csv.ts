export const CSV_DELIMITER = ';'

export type CsvRow = {
  rowNumber: number
  values: string[]
}

export type CsvParseResult = {
  headers: string[]
  rows: CsvRow[]
}

export function isFormulaLike(value: unknown): boolean {
  const raw = String(value ?? '')
  if (raw.startsWith('\t') || raw.startsWith('\r')) return true
  return /^[=+\-@]/.test(raw.trimStart())
}

export function escapeFormulaText(value: unknown): string {
  const raw = String(value ?? '')
  return isFormulaLike(raw) ? `'${raw}` : raw
}

export function parseCsv(text: string): CsvParseResult {
  const input = String(text ?? '').replace(/^\uFEFF/, '')
  const records: string[][] = []
  let field = ''
  let record: string[] = []
  let inQuotes = false
  let line = 1

  const pushRecord = () => {
    record.push(field)
    field = ''
    records.push(record)
    record = []
  }

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    const next = input[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        if (char === '\n') line += 1
        if (char === '\r') {
          line += 1
          if (next === '\n') i += 1
          field += '\n'
        } else {
          field += char
        }
      }
      continue
    }

    if (char === '"' && field === '') {
      inQuotes = true
    } else if (char === CSV_DELIMITER) {
      record.push(field)
      field = ''
    } else if (char === '\n') {
      pushRecord()
      line += 1
    } else if (char === '\r') {
      pushRecord()
      line += 1
      if (next === '\n') i += 1
    } else {
      field += char
    }
  }

  if (field !== '' || record.length > 0 || input.length > 0) {
    record.push(field)
    records.push(record)
  }

  while (records.length > 0 && records[records.length - 1].every((cell) => cell === '')) {
    records.pop()
  }

  const [headers = [], ...dataRows] = records
  return {
    headers,
    rows: dataRows.map((values, index) => ({
      rowNumber: index + 2,
      values,
    })),
  }
}

function serializeCell(value: unknown): string {
  const raw = escapeFormulaText(value)
  if (raw.includes(CSV_DELIMITER) || raw.includes('"') || raw.includes('\n') || raw.includes('\r')) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

export function serializeCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const lines = [
    headers.map(serializeCell).join(CSV_DELIMITER),
    ...rows.map((row) => headers.map((header) => serializeCell(row[header])).join(CSV_DELIMITER)),
  ]
  return `${lines.join('\r\n')}\r\n`
}
