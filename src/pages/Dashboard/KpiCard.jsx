import { Card } from '../../components/ui/Card'

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'red', progress }) {
  const colors = {
    red: 'bg-[var(--color-red-light)] text-[var(--color-red)] ring-[var(--color-red-light)]',
    green: 'bg-[var(--color-green-light)] text-[var(--color-green)] ring-[var(--color-green-light)]',
    amber: 'bg-[var(--color-amber-light)] text-[var(--color-amber)] ring-[var(--color-amber-light)]',
  }

  const progressBg = {
    red: 'bg-[var(--color-red)]',
    green: 'bg-[var(--color-green)]',
    amber: 'bg-[var(--color-amber)]',
  }

  return (
    <Card className="p-4 sm:p-5 min-w-0 border-t-2">
      <div className="flex items-start gap-3 sm:gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-[var(--color-ink-muted)] mb-1 truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-semibold text-[var(--color-ink)] leading-tight break-words">{value}</p>
        {subtitle && <p className="text-xs text-[var(--color-ink-muted)] mt-2 leading-snug">{subtitle}</p>}
        {progress != null && (
          <div className="mt-3 h-1 w-full rounded-full bg-[var(--color-paper-mid)] overflow-hidden">
            <div
              className={`h-full rounded-full ${progressBg[color]}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
            />
          </div>
        )}
      </div>
      </div>
    </Card>
  )
}
