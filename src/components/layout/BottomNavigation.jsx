import { NavLink, useLocation } from 'react-router-dom'
import { isNavigationItemActive, navItems, shouldShowBottomNavigation } from './navigation'

export function BottomNavigation() {
  const location = useLocation()

  if (!shouldShowBottomNavigation(location.pathname)) return null

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2D9C2] bg-[#FFFCF5]/95 px-1.5 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgba(33,28,24,0.08)] backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-6 gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const active = isNavigationItemActive(item, location.pathname, isActive)
              return `flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border-t-2 px-0.5 text-[0.625rem] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2 ${
                active
                  ? 'border-[#C94035] bg-[#F9EDEB] font-semibold text-[#A8342B] shadow-[inset_0_0_0_1px_rgba(201,64,53,0.14)]'
                  : 'border-transparent text-[#5C5149] hover:bg-[#F5EFE0] hover:text-[#211C18]'
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
                      active ? 'bg-white text-[#C94035]' : 'text-[#5C5149]'
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
