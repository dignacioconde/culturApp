import { createContext, useContext, useState, useEffect } from 'react'

const ScrollLockContext = createContext()

export function ScrollLockProvider({ children }) {
  const [lockCount, setLockCount] = useState(0)

  const lock = () => setLockCount((c) => c + 1)
  const unlock = () => setLockCount((c) => Math.max(0, c - 1))

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
    <ScrollLockContext.Provider value={{ lock, unlock }}>
      {children}
    </ScrollLockContext.Provider>
  )
}

export function useScrollLock() {
  const context = useContext(ScrollLockContext)
  if (!context) throw new Error('useScrollLock must be used within ScrollLockProvider')
  return context
}