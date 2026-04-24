import { useAuth } from '../../hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export function TopBar({ title }) {
  const { user, signOut } = useAuth()

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>{user?.email}</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </header>
  )
}
