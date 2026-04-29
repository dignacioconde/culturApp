import { useAuth } from '../../hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export function TopBar({ title }) {
  const { user, signOut } = useAuth()

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <h1 className="min-w-0 truncate text-lg font-semibold leading-7 text-gray-950">{title}</h1>
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 ring-1 ring-inset ring-gray-200 sm:flex">
          <User size={16} className="shrink-0 text-gray-400" />
          <span className="max-w-48 truncate">{user?.email}</span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <LogOut size={16} className="shrink-0" />
          <span className="hidden sm:inline">Salir</span>
          <span className="sr-only sm:hidden">Salir</span>
        </button>
      </div>
    </header>
  )
}
