export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)

export const formatCurrencyPerHour = (amount) => `${formatCurrency(amount)}/h`

export const formatHours = (hours) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(hours ?? 0)

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
  const date = new Date(isoStr)
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}
