import { describe, expect, it } from 'vitest'
import { formatDecimal, parseDecimal } from './decimal'

describe('parseDecimal', () => {
  it('acepta coma decimal espanola', () => {
    expect(parseDecimal('1234,56', 'es-ES')).toBe(1234.56)
  })

  it('acepta millares espanoles', () => {
    expect(parseDecimal('1.234,56', 'es-ES')).toBe(1234.56)
    expect(parseDecimal('1.234.567,89', 'es-ES')).toBe(1234567.89)
  })

  it('tolera pegado con punto decimal', () => {
    expect(parseDecimal('1234.56', 'es-ES')).toBe(1234.56)
  })

  it('rechaza entradas vacias o no numericas', () => {
    expect(parseDecimal('', 'es-ES')).toBeNull()
    expect(parseDecimal('abc', 'es-ES')).toBeNull()
    expect(parseDecimal('1,2,3', 'es-ES')).toBeNull()
    expect(parseDecimal('1,234.56', 'es-ES')).toBeNull()
  })

  it('soporta signos y decimales incompletos razonables', () => {
    expect(parseDecimal('-1,5', 'es-ES')).toBe(-1.5)
    expect(parseDecimal('1,', 'es-ES')).toBe(1)
    expect(parseDecimal(',5', 'es-ES')).toBe(0.5)
  })

  it('formatea en locale es-ES', () => {
    expect(formatDecimal(parseDecimal('1234,56', 'es-ES')!, 'es-ES')).toBe('1234,56')
    expect(formatDecimal(parseDecimal('-1,5', 'es-ES')!, 'es-ES')).toBe('-1,5')
    expect(formatDecimal(parseDecimal(',5', 'es-ES')!, 'es-ES')).toBe('0,5')
  })
})
