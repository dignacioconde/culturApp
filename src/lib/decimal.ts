export function parseDecimal(input: string, locale = 'es-ES'): number | null {
  const raw = String(input ?? '').trim().replace(/\s+/g, '')
  if (raw === '') return null

  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  const localeDecimal = parts.find((part) => part.type === 'decimal')?.value ?? ','
  const localeGroup = parts.find((part) => part.type === 'group')?.value ?? '.'

  const separators = [...raw].filter((char) => char === ',' || char === '.')
  const decimalSeparators = [...raw].filter((char) => char === localeDecimal)
  if (decimalSeparators.length > 1) return null

  const lastComma = raw.lastIndexOf(',')
  const lastDot = raw.lastIndexOf('.')
  const hasComma = lastComma !== -1
  const hasDot = lastDot !== -1

  let decimal = localeDecimal
  let group = localeGroup

  if (hasComma && hasDot) {
    if (localeDecimal === ',' && lastComma < lastDot) return null
    if (localeDecimal === '.' && lastDot < lastComma) return null
  } else if (separators.length === 1) {
    const sep = separators[0]
    const decimals = raw.length - raw.lastIndexOf(sep) - 1
    if (sep !== localeDecimal && decimals > 0 && decimals <= 2) {
      decimal = sep
      group = sep === '.' ? ',' : '.'
    }
  }

  const groupPattern = new RegExp(`\\${group}`, 'g')
  const normalized = raw
    .replace(groupPattern, '')
    .replace(decimal, '.')

  if (!/^-?(?:\d+|\d*\.\d+|\d+\.)$/.test(normalized)) return null

  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatDecimal(n: number, locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: Number.isInteger(n) ? 0 : undefined,
    maximumFractionDigits: 2,
  }).format(n)
}
