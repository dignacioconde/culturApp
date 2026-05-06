import dayjs from 'dayjs'
import { formatDate } from './formatters'

export const getDueDays = (date, today = dayjs()) =>
  dayjs(date).startOf('day').diff(dayjs(today).startOf('day'), 'day')

export const formatDueText = (date, today) => {
  if (!date) return 'Sin fecha prevista'

  const days = getDueDays(date, today)
  if (days < 0) return `Vencido hace ${Math.abs(days)} d`
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  return `Vence en ${days} d`
}

export const formatDueDescription = (date, today) =>
  date ? `${formatDueText(date, today)} · ${formatDate(date)}` : formatDueText(date, today)
