import { DEFAULT_TZ, fromLocalInputValue, toIsoUtc } from './datetime'

type EventFormValues = {
  start_datetime: string
  end_datetime?: string | null
  [key: string]: unknown
}

export function buildEventPayload<T extends EventFormValues>(form: T, tz = DEFAULT_TZ): T {
  return {
    ...form,
    start_datetime: toIsoUtc(fromLocalInputValue(form.start_datetime, tz)),
    end_datetime: form.end_datetime ? toIsoUtc(fromLocalInputValue(form.end_datetime, tz)) : null,
  }
}
