import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarRange, Briefcase, Settings } from 'lucide-react'

function TheaterMasksLogo({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 24"
      className={className}
      fill="none"
    >
      {/* Máscara tragedia (izquierda) - roja */}
      <g transform="translate(0, 0)">
        <ellipse cx="9" cy="12" rx="7" ry="9" fill="#C94035"/>
        {/* Ojos tragedia */}
        <circle cx="6.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <circle cx="11.5" cy="10" r="1.5" fill="#F5EFE0"/>
        {/* Ceja tragedia */}
        <path d="M4 7 L7 8 L10 7" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        {/* Boca tragedia */}
        <path d="M5 15 Q9 13 13 15" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </g>
      {/* Máscara comedia (derecha) - púrpura */}
      <g transform="translate(18, 0)">
        <ellipse cx="9" cy="12" rx="7" ry="9" fill="#863bff"/>
        {/* Ojos comedia */}
        <circle cx="6.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <circle cx="11.5" cy="10" r="1.5" fill="#F5EFE0"/>
        {/* Ceja comedia */}
        <path d="M5 8 Q9 10 13 8" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        {/* Boca comedia sonriente */}
        <path d="M5 15 Q9 19 13 15" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </g>
    </svg>
  )
}

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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#211C18] shadow-sm">
          <TheaterMasksLogo className="h-6 w-auto" />
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
