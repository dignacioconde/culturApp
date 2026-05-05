export type PaymentState = { paid_date: string | null }

export function isPaid(s: PaymentState): boolean {
  return Boolean(s.paid_date)
}

export function markPaid(s: PaymentState, when: Date): PaymentState {
  return { ...s, paid_date: when.toISOString() }
}

export function markUnpaid(s: PaymentState): PaymentState {
  return { ...s, paid_date: null }
}
