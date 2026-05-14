import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

const toneStyles = {
  info: {
    icon: Info,
    className: 'border-border-subtle bg-surface-muted text-text-primary',
    iconClassName: 'text-text-secondary',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-success-soft bg-success-soft text-success',
    iconClassName: 'text-success',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-warning-soft bg-warning-soft text-warning',
    iconClassName: 'text-warning',
  },
  error: {
    icon: AlertCircle,
    className: 'border-danger-soft bg-danger-soft text-danger',
    iconClassName: 'text-danger',
  },
}

export function Notice({ tone = 'info', title, children, action, className = '', icon: IconOverride }) {
  const toneStyle = toneStyles[tone] ?? toneStyles.info
  const Icon = IconOverride ?? toneStyle.icon

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${toneStyle.className} ${className}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${toneStyle.iconClassName}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold leading-5">{title}</p>}
        {children && <div className={title ? 'mt-1 leading-5' : 'leading-5'}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
