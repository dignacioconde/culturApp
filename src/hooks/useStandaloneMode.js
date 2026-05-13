import { useEffect, useState } from 'react'

function getStandaloneMode() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(getStandaloneMode)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(display-mode: standalone)')
    if (!mediaQuery) return undefined

    const handleChange = () => setIsStandalone(getStandaloneMode())
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isStandalone
}
