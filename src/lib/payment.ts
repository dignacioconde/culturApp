import { formatInTimeZone } from 'date-fns-tz'
import { DEFAULT_TZ } from './datetime'

export type PaymentState = { is_paid?: boolean | null; paid_date?: string | null }

export type QuickPaidCandidate = { concept?: string | null }

export function isPaid(s: PaymentState): boolean {
  return Boolean(s.paid_date) || s.is_paid === true
}

export function paymentDate(when: Date, tz = DEFAULT_TZ): string {
  return formatInTimeZone(when, tz, 'yyyy-MM-dd')
}

export function markPaid<T extends PaymentState>(
  s: T,
  when = new Date(),
  tz = DEFAULT_TZ,
): T & { is_paid: true; paid_date: string } {
  return { ...s, is_paid: true, paid_date: s.paid_date || paymentDate(when, tz) }
}

export function markUnpaid<T extends PaymentState>(s: T): T & { is_paid: false; paid_date: null } {
  return { ...s, is_paid: false, paid_date: null }
}

export function needsQuickPaidConfirmation(income: QuickPaidCandidate | null | undefined): boolean {
  const concept = income?.concept?.trim().toLocaleLowerCase('es-ES') ?? ''
  return concept === '' || concept === 'ingreso'
}
