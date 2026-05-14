import { NavLink, useLocation } from 'react-router-dom'
import { Drama } from 'lucide-react'
import { isNavigationItemActive, navItems } from './navigation'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-fg/10 bg-sidebar-bg">
      <div className="flex min-h-16 items-center gap-2 border-b border-sidebar-fg/10 px-4 py-4 lg:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary shadow-sm ring-1 ring-sidebar-fg/20">
          <Drama size={24} strokeWidth={1.5} className="text-surface-page" />
        </div>
        <span className="truncate font-display text-xl font-semibold text-sidebar-fg">Cachés</span>
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
              `relative flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg lg:shrink
              ${isNavigationItemActive(item, location.pathname, isActive)
                ? 'bg-sidebar-fg/10 text-sidebar-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--sidebar-fg)_10%,transparent)]'
                : 'text-sidebar-muted hover:bg-sidebar-fg/5 hover:text-sidebar-fg'
              }`
            }
            title={item.label}
          >
            {({ isActive }) => {
              const active = isNavigationItemActive(item, location.pathname, isActive)
              const Icon = item.icon
              return (
                <>
                  {active && <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-accent-primary" aria-hidden="true" />}
                  <Icon size={18} className="shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
