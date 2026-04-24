import { STATUS_COLORS, STATUS_LABELS } from '../../lib/constants'

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <Badge className={STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
