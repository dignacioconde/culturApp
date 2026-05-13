import { describe, expect, it } from 'vitest'
import { isNavigationItemActive, navItems, shouldShowBottomNavigation } from './navigation'

const byLabel = (label) => navItems.find((item) => item.mobileLabel === label)

describe('navigation active states', () => {
  it('keeps Agenda active for the event calendar and /calendar redirect only', () => {
    const agenda = byLabel('Agenda')

    expect(isNavigationItemActive(agenda, '/calendar')).toBe(true)
    expect(isNavigationItemActive(agenda, '/calendar/events')).toBe(true)
    expect(isNavigationItemActive(agenda, '/calendar/projects', true)).toBe(false)
  })

  it('keeps Plan active for the annual project calendar', () => {
    const plan = byLabel('Plan')

    expect(isNavigationItemActive(plan, '/calendar/projects', true)).toBe(true)
    expect(isNavigationItemActive(plan, '/calendar')).toBe(false)
    expect(isNavigationItemActive(plan, '/calendar/events')).toBe(false)
  })

  it('hides global bottom navigation on project and event detail routes', () => {
    expect(shouldShowBottomNavigation('/events/event-1')).toBe(false)
    expect(shouldShowBottomNavigation('/projects/project-1')).toBe(false)
    expect(shouldShowBottomNavigation('/events')).toBe(true)
    expect(shouldShowBottomNavigation('/projects')).toBe(true)
  })
})
