import { Card } from '../../components/ui/Card'

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'red', progress }) {
  const colors = {
    red: 'bg-danger-soft text-danger ring-danger-soft',
    green: 'bg-success-soft text-success ring-success-soft',
    amber: 'bg-warning-soft text-[var(--color-warning-600)] ring-warning-soft',
  }

  const progressBg = {
    red: 'bg-danger',
    green: 'bg-success',
    amber: 'bg-warning',
  }

  const borderColors = {
    red: 'border-t-danger',
    green: 'border-t-success',
    amber: 'border-t-warning',
  }

  return (
    <Card className={`card-lift min-w-0 border-border-subtle bg-surface-card p-4 sm:p-5 border-t-2 ${borderColors[color] ?? borderColors.red}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {Icon && (
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ring-1 ${colors[color] ?? colors.red}`}>
            <Icon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="mb-1 truncate text-xs font-medium text-text-secondary sm:text-sm">{title}</p>
          <p className="break-words font-data text-xl font-semibold leading-tight text-text-primary tabular-nums tracking-normal sm:text-2xl">{value}</p>
          {subtitle && <p className="mt-2 text-xs leading-snug text-text-secondary">{subtitle}</p>}
          {progress != null && (
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border-subtle">
              <div
                className={`h-full rounded-full ${progressBg[color] ?? progressBg.red}`}
                style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
