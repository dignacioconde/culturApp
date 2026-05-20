import { isPaid } from './payment'

export const EXPENSE_KIND_INTERNAL = 'internal'
export const EXPENSE_KIND_REIMBURSABLE = 'reimbursable'

type IncomeRow = {
  id?: string | null
  event_id?: string | null
  amount?: unknown
  tax_rate?: unknown
  is_paid?: boolean | null
  paid_date?: string | null
}

type ExpenseRow = {
  id?: string | null
  amount?: unknown
  expense_kind?: string | null
  reimbursed_by_income_id?: string | null
}

type EventRow = {
  id?: string | null
  start_datetime?: string | null
  end_datetime?: string | null
}

function amount(row: { amount?: unknown }): number {
  const value = Number(row.amount)
  return Number.isFinite(value) ? value : 0
}

function taxRate(row: { tax_rate?: unknown }): number {
  const value = Number(row.tax_rate)
  return Number.isFinite(value) ? value : 0
}

function sumAmounts<T extends { amount?: unknown }>(rows: T[]): number {
  return rows.reduce((total, row) => total + amount(row), 0)
}

function getEventHours(event: EventRow): number {
  if (!event.start_datetime || !event.end_datetime) return 0
  const minutes = (new Date(event.end_datetime).getTime() - new Date(event.start_datetime).getTime()) / 60000
  return minutes > 0 ? minutes / 60 : 0
}

export function isReimbursableExpense(expense: ExpenseRow): boolean {
  return expense.expense_kind === EXPENSE_KIND_REIMBURSABLE
}

export function getNetSettlementSummary({
  incomes = [],
  expenses = [],
}: {
  incomes?: IncomeRow[]
  expenses?: ExpenseRow[]
}) {
  const paidIncomes = incomes.filter((income) => isPaid(income))
  const internalExpenses = expenses.filter((expense) => !isReimbursableExpense(expense))
  const reimbursableExpenses = expenses.filter(isReimbursableExpense)
  const linkedReimbursableExpenses = reimbursableExpenses.filter((expense) => Boolean(expense.reimbursed_by_income_id))
  const unlinkedReimbursableExpenses = reimbursableExpenses.filter((expense) => !expense.reimbursed_by_income_id)
  const grossTotal = sumAmounts(incomes)
  const paidTotal = sumAmounts(paidIncomes)
  const retentionTotal = paidIncomes.reduce((total, income) => total + amount(income) * (taxRate(income) / 100), 0)
  const internalExpensesTotal = sumAmounts(internalExpenses)
  const reimbursableExpensesTotal = sumAmounts(reimbursableExpenses)
  const totalExpenses = internalExpensesTotal + reimbursableExpensesTotal

  return {
    grossTotal,
    paidTotal,
    pendingTotal: grossTotal - paidTotal,
    retentionTotal,
    internalExpenses,
    internalExpensesTotal,
    reimbursableExpenses,
    reimbursableExpensesTotal,
    linkedReimbursableExpenses,
    linkedReimbursableExpensesTotal: sumAmounts(linkedReimbursableExpenses),
    unlinkedReimbursableExpenses,
    unlinkedReimbursableExpensesTotal: sumAmounts(unlinkedReimbursableExpenses),
    totalExpenses,
    operationalNet: paidTotal - retentionTotal - totalExpenses,
  }
}

export function getGrossHourlyRateSummary({
  incomes = [],
  events = [],
}: {
  incomes?: IncomeRow[]
  events?: EventRow[]
}) {
  const paidEventIncomes = incomes.filter((income) => isPaid(income) && Boolean(income.event_id))
  const paidEventIds = new Set(paidEventIncomes.map((income) => income.event_id))
  const hours = events
    .filter((event) => event.id && paidEventIds.has(event.id))
    .reduce((total, event) => total + getEventHours(event), 0)
  const paidEventIncomeTotal = sumAmounts(paidEventIncomes)

  return {
    paidEventIncomeTotal,
    hours,
    grossHourlyRate: hours > 0 ? paidEventIncomeTotal / hours : 0,
  }
}
