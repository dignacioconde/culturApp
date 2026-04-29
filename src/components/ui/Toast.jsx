/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-3 bottom-3 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex w-full items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-black/10 transition-all
            ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}
        >
          {toast.type === 'error' ? <XCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle size={18} className="mt-0.5 shrink-0" />}
          <span className="min-w-0 flex-1 leading-5">{toast.message}</span>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            aria-label="Cerrar aviso"
            className="-mr-1 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
