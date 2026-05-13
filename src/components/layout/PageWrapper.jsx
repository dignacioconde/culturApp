import { useLocation } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'
import { shouldShowBottomNavigation } from './navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function PageWrapper({ title, children }) {
  const location = useLocation()
  const showBottomNavigation = shouldShowBottomNavigation(location.pathname)

  return (
    <div className="flex min-h-dvh flex-col bg-surface-muted lg:flex-row">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <main className={`min-w-0 flex-1 px-4 pt-5 sm:px-6 lg:px-8 ${
          showBottomNavigation
            ? 'pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-5'
            : 'pb-5'
        }`}>
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {showBottomNavigation && <BottomNavigation />}
    </div>
  )
}
