import { afterEach, beforeEach, vi } from 'vitest'

const RealDateTimeFormat = Intl.DateTimeFormat

export function mockNow(iso: string, tz?: string) {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(iso))

    if (tz) {
      vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(((...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => {
        const formatter = new RealDateTimeFormat(...args)
        const resolvedOptions = formatter.resolvedOptions.bind(formatter)
        formatter.resolvedOptions = () => ({ ...resolvedOptions(), timeZone: tz })
        return formatter
      }) as typeof Intl.DateTimeFormat)
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })
}
