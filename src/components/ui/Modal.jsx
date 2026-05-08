import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { useScrollLock } from '../../hooks/useScrollLock'

let nextModalId = 0
const openModalStack = []

export function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId()
  const modalId = useRef(nextModalId++)
  const dialogRef = useRef(null)
  const { lock, unlock } = useScrollLock()

  useEffect(() => {
    if (!isOpen) return
    const currentModalId = modalId.current
    const previousActiveElement = document.activeElement
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')
    openModalStack.push(currentModalId)
    lock()
    const handleKey = (e) => {
      const isTopModal = openModalStack.at(-1) === currentModalId
      if (!isTopModal) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusableElements = [...(dialogRef.current?.querySelectorAll(focusableSelector) ?? [])]
        .filter((element) => element.getClientRects().length > 0)
      if (focusableElements.length === 0) {
        e.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const focusIsInside = dialogRef.current?.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === firstElement || !focusIsInside)) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && (document.activeElement === lastElement || !focusIsInside)) {
        e.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      const stackIndex = openModalStack.lastIndexOf(currentModalId)
      if (stackIndex !== -1) openModalStack.splice(stackIndex, 1)
      if (previousActiveElement instanceof HTMLElement && document.contains(previousActiveElement)) {
        previousActiveElement.focus()
      }
      unlock()
    }
  }, [isOpen, onClose, lock, unlock])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-[var(--color-ink)]/50 backdrop-blur-[1px] animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-full md:max-w-2xl flex-col rounded-lg bg-white shadow-2xl ring-1 ring-[var(--color-ink)]/10 animate-scale-in"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-paper-mid)] px-4 py-4 sm:px-6 shrink-0">
          <h2 id={titleId} className="min-w-0 text-base font-semibold leading-6 text-[var(--color-ink)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-paper-dark)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2"
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
