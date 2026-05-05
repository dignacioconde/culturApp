import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'

export const DEFAULT_TZ = 'Europe/Madrid'

function localMinuteValue(value: string): number {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!match) return Number.NaN
  const [, year, month, day, hour, minute] = match.map(Number)
  return Date.UTC(year, month - 1, day, hour, minute)
}

export function toLocalInputValue(d: Date, tz = DEFAULT_TZ): string {
  return formatInTimeZone(d, tz, "yyyy-MM-dd'T'HH:mm")
}

export function fromLocalInputValue(v: string, tz = DEFAULT_TZ): Date {
  const candidate = fromZonedTime(v, tz)

  const earlier = new Date(candidate.getTime() - 60 * 60 * 1000)
  if (toLocalInputValue(earlier, tz) === v) return earlier

  const roundTrip = toLocalInputValue(candidate, tz)
  if (roundTrip === v) return candidate

  const drift = localMinuteValue(v) - localMinuteValue(roundTrip)
  return new Date(candidate.getTime() + drift)
}

export function toIsoUtc(d: Date): string {
  return d.toISOString()
}
