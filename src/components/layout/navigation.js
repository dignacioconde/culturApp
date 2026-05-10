import { Database, LayoutDashboard, CalendarDays, CalendarRange, Briefcase, Settings } from 'lucide-react'

export const navItems = [
  { to: '/work', icon: Briefcase, label: 'Trabajos', mobileLabel: 'Trabajos', activePaths: ['/work', '/projects', '/events'] },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', mobileLabel: 'Inicio' },
  { to: '/calendar/events', icon: CalendarDays, label: 'Cal. eventos', mobileLabel: 'Agenda' },
  { to: '/calendar/projects', icon: CalendarRange, label: 'Cal. proyectos', mobileLabel: 'Plan' },
  { to: '/data', icon: Database, label: 'Tus datos', mobileLabel: 'Datos' },
  { to: '/settings', icon: Settings, label: 'Ajustes', mobileLabel: 'Ajustes' },
]

const detailRoutePattern = /^\/(?:events|projects)\/[^/]+/

export function isNavigationItemActive(item, pathname, navLinkActive = false) {
  if (navLinkActive) return true
  return item.activePaths?.some((path) => {
    if (pathname === path) return true
    return pathname.startsWith(`${path}/`)
  }) ?? false
}

export function shouldShowBottomNavigation(pathname) {
  if (pathname.startsWith('/admin')) return false
  return !detailRoutePattern.test(pathname)
}
