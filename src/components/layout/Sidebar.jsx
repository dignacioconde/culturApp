import { NavLink, useLocation } from 'react-router-dom'
import { Drama } from 'lucide-react'
import { isNavigationItemActive, navItems } from './navigation'

export function Sidebar({ onNavigate, isDrawer = false }) {
  const location = useLocation()
  const handleNavClick = () => {
    if (onNavigate) onNavigate()
  }

  return (
    <aside className={`
      w-full shrink-0 bg-[#2C2420]
      ${isDrawer 
        ? 'h-full flex flex-col' 
        : 'border-b border-[rgba(245,239,224,.08)] lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-r lg:border-b-0'
      }
    `}>
      <div className="flex items-center gap-2 border-b border-[rgba(245,239,224,.08)] px-4 py-4 lg:px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#211C18] shadow-sm">
          <Drama size={24} strokeWidth={1.5} className="text-[#C94035]" />
        </div>
        <span className="truncate text-sm font-semibold text-[#F5EFE0]">Cachés</span>
      </div>

      <nav
        aria-label="Navegación principal"
        className={`
          flex gap-1 px-3 py-3
          ${isDrawer 
            ? 'flex-1 flex-col overflow-y-auto' 
            : 'overflow-x-auto lg:flex-col lg:overflow-visible lg:py-4'
          }
        `}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2 lg:shrink
              ${isNavigationItemActive(item, location.pathname, isActive)
                ? 'bg-[#C94035] text-[#F5EFE0]'
                : 'text-[rgba(245,239,224,.75)] hover:bg-[rgba(245,239,224,.08)] hover:text-[#F5EFE0]'
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
