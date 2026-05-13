import { Building2, Database, LayoutDashboard, CalendarDays, CalendarRange, Briefcase, Megaphone, Settings } from 'lucide-react'

export const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio', mobileLabel: 'Inicio' },
  { to: '/work', icon: Briefcase, label: 'Trabajos', mobileLabel: 'Trabajos', activePaths: ['/work', '/projects', '/events'] },
  { to: '/contractors', icon: Building2, label: 'Contratantes', mobileLabel: 'Contr.', showOnMobile: false },
  { to: '/calendar/events', icon: CalendarDays, label: 'Agenda', mobileLabel: 'Agenda', activePaths: ['/calendar', '/calendar/events'] },
  { to: '/calendar/projects', icon: CalendarRange, label: 'Plan anual', mobileLabel: 'Plan' },
  { to: '/data', icon: Database, label: 'Tus datos', mobileLabel: 'Datos' },
  { to: '/novedades', icon: Megaphone, label: 'Novedades', mobileLabel: 'Noved.', showOnMobile: false },
  { to: '/settings', icon: Settings, label: 'Ajustes', mobileLabel: 'Ajustes' },
]

const detailRoutePattern = /^\/(?:events|projects)\/[^/]+/

export function isNavigationItemActive(item, pathname, navLinkActive = false) {
  if (item.to === '/calendar/events') return pathname === '/calendar' || pathname === '/calendar/events'
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
