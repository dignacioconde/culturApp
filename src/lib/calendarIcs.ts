type CalendarEvent = {
  id?: string | null
  name?: string | null
  status?: string | null
  category?: string | null
  start_datetime?: string | Date | null
  end_datetime?: string | Date | null
  project_name?: string | null
}

type BuildEventsIcsOptions = {
  calendarName?: string
  events: CalendarEvent[]
  generatedAt?: string | Date
}

const STATUS_TO_ICS: Record<string, string> = {
  cancelled: 'CANCELLED',
  draft: 'TENTATIVE',
  confirmed: 'CONFIRMED',
  in_progress: 'CONFIRMED',
  completed: 'CONFIRMED',
}

function toDate(value: string | Date | null | undefined) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function escapeIcsText(value: unknown) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

export function formatIcsDateTime(value: string | Date) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

function foldLine(line: string) {
  if (line.length <= 75) return [line]
  const folded = []
  let remaining = line
  while (remaining.length > 75) {
    folded.push(remaining.slice(0, 75))
    remaining = ` ${remaining.slice(75)}`
  }
  folded.push(remaining)
  return folded
}

function descriptionForEvent(event: CalendarEvent) {
  const parts = [
    event.project_name ? `Proyecto: ${event.project_name}` : null,
    event.category ? `Categoría: ${event.category}` : null,
    event.status ? `Estado: ${event.status}` : null,
    'Edita este evento desde Cachés.',
  ].filter(Boolean)

  return parts.join('\n')
}

export function buildEventsIcs({
  calendarName = 'Cachés - Agenda',
  events,
  generatedAt = new Date(),
}: BuildEventsIcsOptions) {
  const generatedStamp = formatIcsDateTime(generatedAt)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Caches//Calendar Feed//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    'X-WR-TIMEZONE:Europe/Madrid',
  ]

  for (const event of events) {
    const start = toDate(event.start_datetime)
    if (!start) continue
    const end = toDate(event.end_datetime) ?? new Date(start.getTime() + 60 * 60 * 1000)
    const status = STATUS_TO_ICS[event.status ?? ''] ?? 'CONFIRMED'
    const uid = `${event.id ?? crypto.randomUUID()}@caches.es`

    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcsText(uid)}`,
      `DTSTAMP:${generatedStamp}`,
      `DTSTART:${formatIcsDateTime(start)}`,
      `DTEND:${formatIcsDateTime(end)}`,
      `SUMMARY:${escapeIcsText(event.name || 'Evento de Cachés')}`,
      `DESCRIPTION:${escapeIcsText(descriptionForEvent(event))}`,
      `STATUS:${status}`,
    )

    if (event.category) {
      lines.push(`CATEGORIES:${escapeIcsText(event.category)}`)
    }

    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return `${lines.flatMap(foldLine).join('\r\n')}\r\n`
}
