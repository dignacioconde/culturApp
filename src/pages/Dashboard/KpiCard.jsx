import { Card } from '../../components/ui/Card'

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'indigo', progress }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    green: 'bg-green-50 text-green-600 ring-green-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
  }

  const progressBg = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  return (
    <Card className="p-4 sm:p-5 min-w-0">
      <div className="flex items-start gap-3 sm:gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight break-words">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-2 leading-snug">{subtitle}</p>}
        {progress != null && (
          <div className="mt-3 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
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
