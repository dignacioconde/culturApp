import { useAuth } from '../../hooks/useAuth'
import { LogOut, User } from 'lucide-react'

function TheaterMasksLogo({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 24"
      className={className}
      fill="none"
    >
      {/* Máscara tragedia (izquierda) - roja */}
      <g transform="translate(0, 0)">
        <ellipse cx="9" cy="12" rx="7" ry="9" fill="#C94035"/>
        <circle cx="6.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <circle cx="11.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <path d="M4 7 L7 8 L10 7" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M5 15 Q9 13 13 15" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </g>
      {/* Máscara comedia (derecha) - púrpura */}
      <g transform="translate(18, 0)">
        <ellipse cx="9" cy="12" rx="7" ry="9" fill="#863bff"/>
        <circle cx="6.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <circle cx="11.5" cy="10" r="1.5" fill="#F5EFE0"/>
        <path d="M5 8 Q9 10 13 8" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M5 15 Q9 19 13 15" stroke="#211C18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </g>
    </svg>
  )
}

export function TopBar({ title }) {
  const { user, signOut } = useAuth()

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[#E2D9C2] bg-[#F5EFE0] px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <TheaterMasksLogo className="hidden h-6 w-auto sm:block" />
        <h1 className="min-w-0 truncate text-lg font-semibold leading-7 text-[#211C18] font-['DM_Serif_Display']">{title}</h1>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 items-center gap-2 rounded-lg bg-[#EBE3CE] px-3 py-2 text-sm text-[#5C5149] ring-1 ring-inset ring-[#E2D9C2] sm:flex">
          <User size={16} className="shrink-0 text-[#5C5149]" />
          <span className="max-w-48 truncate">{user?.email}</span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-[#5C5149] transition-colors hover:bg-[#EBE3CE] hover:text-[#211C18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2"
        >
          <LogOut size={16} className="shrink-0" />
          <span className="hidden sm:inline">Salir</span>
          <span className="sr-only sm:hidden">Salir</span>
        </button>
      </div>
    </header>
  )
}
