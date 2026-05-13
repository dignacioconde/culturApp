import { NavLink, useLocation } from 'react-router-dom'
import { Drama } from 'lucide-react'
import { isNavigationItemActive, navItems } from './navigation'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-fg/10 bg-sidebar-bg">
      <div className="flex items-center gap-2 border-b border-sidebar-fg/10 px-4 py-4 lg:px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-text-primary shadow-sm">
          <Drama size={24} strokeWidth={1.5} className="text-accent-primary" />
        </div>
        <span className="truncate text-sm font-semibold text-sidebar-fg">Cachés</span>
      </div>

      <nav
        aria-label="Navegación principal"
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 lg:shrink
              ${isNavigationItemActive(item, location.pathname, isActive)
                ? 'bg-accent-primary text-sidebar-fg'
                : 'text-sidebar-muted hover:bg-sidebar-fg/10 hover:text-sidebar-fg'
              }`
            }
            title={item.label}
          >
            <item.icon size={18} className="shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
