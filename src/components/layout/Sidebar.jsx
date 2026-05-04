import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarRange, Briefcase, Settings, Music } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar/events', icon: CalendarDays, label: 'Cal. eventos' },
  { to: '/calendar/projects', icon: CalendarRange, label: 'Cal. proyectos' },
  { to: '/work', icon: Briefcase, label: 'Trabajos' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-[rgba(245,239,224,.08)] bg-[#2C2420] lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-2 border-b border-[rgba(245,239,224,.08)] px-4 py-4 lg:px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C94035] shadow-sm">
          <Music size={16} className="text-[#F5EFE0]" />
        </div>
        <span className="truncate text-sm font-semibold text-[#F5EFE0]">Cachés</span>
      </div>

      <nav
        aria-label="Navegación principal"
        className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:py-4"
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2 lg:shrink
              ${isActive
                ? 'bg-[#C94035] text-[#F5EFE0]'
                : 'text-[rgba(245,239,224,.75)] hover:bg-[rgba(245,239,224,.08)] hover:text-[#F5EFE0]'
              }`
            }
            title={label}
          >
            <Icon size={18} className="shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
