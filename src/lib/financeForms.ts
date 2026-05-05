import { parseDecimal } from './decimal'
import { markPaid, markUnpaid, type PaymentState } from './payment'

type FinanceForm = {
  amount: unknown
  [key: string]: unknown
}

type IncomeForm = FinanceForm & {
  tax_rate?: unknown
  is_paid?: boolean
  paid_date?: string | null
}

type FinanceValidationError = 'amount' | 'tax_rate'

type NormalizeResult<T> =
  | { payload: T; error: null }
  | { payload: null; error: FinanceValidationError }

export function normalizeExpenseForm<T extends FinanceForm>(form: T): NormalizeResult<T & { amount: number }> {
  const amount = parseDecimal(String(form.amount ?? ''))

  if (amount === null || amount <= 0) {
    return { payload: null, error: 'amount' }
  }

  return { payload: { ...form, amount }, error: null }
}

export function normalizeIncomeForm<T extends IncomeForm>(
  form: T,
  {
    defaultTaxRate = 15,
    existingIncome = null,
    paidAt = new Date(),
  }: {
    defaultTaxRate?: number
    existingIncome?: PaymentState | null
    paidAt?: Date
  } = {},
): NormalizeResult<T & { amount: number; tax_rate: number; is_paid: boolean; paid_date: string | null }> {
  const amount = parseDecimal(String(form.amount ?? ''))
  const rawTaxRate = String(form.tax_rate ?? '').trim()
  const taxRate = rawTaxRate === '' ? defaultTaxRate : parseDecimal(rawTaxRate)

  if (amount === null || amount <= 0) {
    return { payload: null, error: 'amount' }
  }

  if (taxRate === null || taxRate < 0 || taxRate > 100) {
    return { payload: null, error: 'tax_rate' }
  }

  const paymentSource = {
    is_paid: form.is_paid ?? existingIncome?.is_paid ?? false,
    paid_date: form.paid_date ?? existingIncome?.paid_date ?? null,
  }
  const paymentState = form.is_paid ? markPaid(paymentSource, paidAt) : markUnpaid(paymentSource)

  return {
    payload: {
      ...form,
      amount,
      tax_rate: taxRate,
      ...paymentState,
    },
    error: null,
  }
}
