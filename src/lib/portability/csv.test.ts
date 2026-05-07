import { describe, expect, it } from 'vitest'
import { escapeFormulaText, isFormulaLike, parseCsv, serializeCsv } from './csv'

describe('parseCsv', () => {
  it('parsea punto y coma, comillas, BOM, CRLF y campos multilínea', () => {
    const csv = '\uFEFFname;notes\r\n"Proyecto; especial";"Línea 1\r\nLínea ""dos"""\r\n'

    const parsed = parseCsv(csv)

    expect(parsed.headers).toEqual(['name', 'notes'])
    expect(parsed.rows).toHaveLength(1)
    expect(parsed.rows[0].values).toEqual(['Proyecto; especial', 'Línea 1\nLínea "dos"'])
  })
})

describe('serializeCsv', () => {
  it('escapa punto y coma, comillas y saltos de línea', () => {
    const csv = serializeCsv(['name', 'notes'], [
      { name: 'Proyecto; especial', notes: 'Línea 1\nLínea "dos"' },
    ])

    expect(csv).toBe('name;notes\r\n"Proyecto; especial";"Línea 1\nLínea ""dos"""\r\n')
  })

  it('protege textos con aspecto de fórmula en exportación', () => {
    expect(isFormulaLike(' =1+1')).toBe(true)
    expect(isFormulaLike('\tSUM(A1:A2)')).toBe(true)
    expect(escapeFormulaText('-10')).toBe("'-10")
    expect(serializeCsv(['name'], [{ name: '@usuario' }])).toContain("'@usuario")
  })
})
