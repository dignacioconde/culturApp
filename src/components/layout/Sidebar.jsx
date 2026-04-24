import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarRange, Ticket, FolderOpen, Settings, Music } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar/events', icon: CalendarDays, label: 'Cal. eventos' },
  { to: '/calendar/projects', icon: CalendarRange, label: 'Cal. proyectos' },
  { to: '/events', icon: Ticket, label: 'Eventos' },
  { to: '/projects', icon: FolderOpen, label: 'Proyectos' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Music size={16} className="text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">CulturaApp</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
