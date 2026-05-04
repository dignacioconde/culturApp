import { Card } from '../../components/ui/Card'

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'red', progress }) {
  const colors = {
    red: 'bg-[#F9EDEB] text-[#C94035] ring-[#F9EDEB]',
    green: 'bg-[#E8F4EF] text-[#2D6A4F] ring-[#E8F4EF]',
    amber: 'bg-[#FDF5E4] text-[#D4921A] ring-[#FDF5E4]',
    indigo: 'bg-[#eef2ff] text-[#6366f1] ring-[#eef2ff]',
  }

  const progressBg = {
    red: 'bg-[#C94035]',
    green: 'bg-[#2D6A4F]',
    amber: 'bg-[#D4921A]',
    indigo: 'bg-[#6366f1]',
  }

  const borderTop = {
    red: 'border-t-[#C94035]',
    green: 'border-t-[#2D6A4F]',
    amber: 'border-t-[#D4921A]',
    indigo: 'border-t-[#6366f1]',
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
        <p className="text-xs sm:text-sm font-medium text-[#5C5149] mb-1 truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-semibold text-[#211C18] leading-tight break-words">{value}</p>
        {subtitle && <p className="text-xs text-[#5C5149] mt-2 leading-snug">{subtitle}</p>}
        {progress != null && (
          <div className="mt-3 h-1 w-full rounded-full bg-[#E2D9C2] overflow-hidden">
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
