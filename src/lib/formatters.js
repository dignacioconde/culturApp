export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('es-ES').format(new Date(dateStr))
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
  return new Date(isoStr).toISOString().slice(0, 16)
}
