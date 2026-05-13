import { NavLink, useLocation } from 'react-router-dom'
import { isNavigationItemActive, navItems, shouldShowBottomNavigation } from './navigation'

export function BottomNavigation() {
  const location = useLocation()
  const mobileNavItems = navItems.filter((item) => item.showOnMobile !== false)

  if (!shouldShowBottomNavigation(location.pathname)) return null

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-card/95 px-1.5 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-6px_18px_color-mix(in_oklab,var(--text-primary)_8%,transparent)] backdrop-blur lg:hidden"
    >
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${mobileNavItems.length}, minmax(0, 1fr))` }}>
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const active = isNavigationItemActive(item, location.pathname, isActive)
              return `flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border-t-2 px-0.5 text-[0.625rem] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${
                active
                  ? 'border-accent-primary bg-accent-soft font-semibold text-accent-primary-hover shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_14%,transparent)]'
                  : 'border-transparent text-text-secondary hover:bg-surface-page hover:text-text-primary'
              }`
            }}
            aria-label={item.label}
            title={item.label}
          >
            {({ isActive }) => {
              const active = isNavigationItemActive(item, location.pathname, isActive)
              const Icon = item.icon
              return (
                <>
                  <span
                    className={`flex h-5 w-8 items-center justify-center rounded-md ${
                      active ? 'bg-surface-card text-accent-primary' : 'text-text-secondary'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon size={17} strokeWidth={active ? 2.4 : 2} />
                  </span>
                  <span className="w-full truncate text-center">{item.mobileLabel}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
