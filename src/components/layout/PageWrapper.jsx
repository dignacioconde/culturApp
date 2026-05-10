import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'
import { shouldShowBottomNavigation } from './navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function PageWrapper({ title, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const showBottomNavigation = shouldShowBottomNavigation(location.pathname)

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface-alt)] lg:flex-row">
      {/* Overlay para móvil cuando el drawer está abierto */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar como drawer en móvil */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-[#2C2420] transition-transform duration-200 ease-out lg:relative lg:translate-x-0 lg:transform-none lg:z-auto
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNavigate={() => setIsDrawerOpen(false)} isDrawer={true} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar 
          title={title} 
          onMenuClick={() => setIsDrawerOpen(true)}
          showMenuButton={true}
        />
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

      {showBottomNavigation && !isDrawerOpen && <BottomNavigation />}
    </div>
  )
}
