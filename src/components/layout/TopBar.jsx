import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Drama, LogOut, User, MessageSquare, Megaphone } from 'lucide-react'
import { ToastContainer, useToast } from '../ui/Toast'
import { FeedbackDialog } from './FeedbackDialog'

export function TopBar({ title }) {
  const { user, signOut } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border-subtle bg-surface-page px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Drama size={28} strokeWidth={1.5} className="hidden text-accent-primary sm:block" />
          <h1 className="min-w-0 truncate font-display text-lg font-semibold leading-7 text-text-primary">{title}</h1>
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/novedades"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 md:w-auto md:px-3"
            aria-label="Ver novedades"
          >
            <Megaphone size={16} className="shrink-0" />
            <span className="hidden md:inline">Novedades</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 md:w-auto md:px-3"
            aria-label="Enviar feedback"
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="hidden md:inline">Feedback</span>
          </button>
          <div className="hidden min-w-0 items-center gap-2 rounded-lg bg-surface-page-dark px-3 py-2 text-sm text-text-secondary ring-1 ring-inset ring-border-subtle sm:flex">
            <User size={16} className="shrink-0 text-text-secondary" />
            <span className="max-w-48 truncate">{user?.email}</span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:px-3"
          >
            <LogOut size={16} className="shrink-0" />
            <span className="hidden sm:inline">Salir</span>
            <span className="sr-only sm:hidden">Salir</span>
          </button>
        </div>
      </header>
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userId={user?.id}
        onSubmitted={() => addToast('Gracias, lo revisamos para la beta.')}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
