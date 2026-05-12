import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ScrollLockContext = createContext()

export function ScrollLockProvider({ children }) {
  const [lockCount, setLockCount] = useState(0)

  const lock = useCallback(() => setLockCount((c) => c + 1), [])
  const unlock = useCallback(() => setLockCount((c) => Math.max(0, c - 1)), [])
  const contextValue = useMemo(() => ({ lock, unlock }), [lock, unlock])

  useEffect(() => {
    if (lockCount > 0) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [lockCount])

  return (
    <ScrollLockContext.Provider value={contextValue}>
      {children}
    </ScrollLockContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScrollLock() {
  const context = useContext(ScrollLockContext)
  if (!context) throw new Error('useScrollLock must be used within ScrollLockProvider')
  return context
}
