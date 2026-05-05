import { parseDecimal as parseDecimalValue } from './decimal.ts'
import { toLocalInputValue } from './datetime.ts'

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)

export const formatCurrencyPerHour = (amount) => `${formatCurrency(amount)}/h`

export const formatHours = (hours) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(hours ?? 0)

export const parseDecimal = (value) => parseDecimalValue(String(value ?? ''))

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateStr))
}

export const formatDateRange = (startDate, endDate) => {
  if (!endDate) return formatDate(startDate)
  return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

export const formatDatetime = (isoStr) => {
  if (!isoStr) return '—'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(isoStr))
}

export const toDatetimeLocal = (isoStr) => {
  if (!isoStr) return ''
  return toLocalInputValue(new Date(isoStr))
}
