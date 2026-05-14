import { CalendarDays, CalendarRange } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const items = [
  {
    to: '/calendar/events',
    label: 'Agenda de eventos',
    description: 'Fechas con hora exacta',
    icon: CalendarDays,
  },
  {
    to: '/calendar/projects',
    label: 'Plan anual',
    description: 'Proyectos por rango',
    icon: CalendarRange,
  },
]

export function CalendarPageNav() {
  const location = useLocation()

  return (
    <nav className="mb-4 grid gap-2 sm:grid-cols-2" aria-label="Calendarios">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.to || (item.to === '/calendar/events' && location.pathname === '/calendar')
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex min-h-16 items-center gap-3 rounded-lg border px-4 py-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
              isActive
                ? 'border-accent-primary bg-accent-soft text-accent-primary-hover'
                : 'border-border-subtle bg-surface-card text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} className="shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="block text-xs">{item.description}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
