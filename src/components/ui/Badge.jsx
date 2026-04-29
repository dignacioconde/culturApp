import { STATUS_COLORS, STATUS_LABELS } from '../../lib/constants'

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-none ring-1 ring-inset ring-black/5 ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <Badge className={STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
