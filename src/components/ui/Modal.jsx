import { useEffect, useId } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative flex max-h-[90vh] w-full max-w-full md:max-w-2xl flex-col rounded-lg bg-white shadow-2xl ring-1 ring-gray-950/10"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6 shrink-0">
          <h2 id={titleId} className="min-w-0 text-base font-semibold leading-6 text-gray-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}
