import { Link } from 'react-router-dom'

const variants = {
  primary: 'border-transparent bg-[var(--color-red)] text-white shadow-sm hover:bg-[var(--color-red-hover)]',
  secondary: 'border-[var(--color-paper-mid)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm hover:bg-[var(--color-paper-dark)]',
  muted: 'border-transparent bg-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-paper-dark)] hover:text-[var(--color-ink)]',
  danger: 'border-[var(--color-red-light)] bg-transparent text-[var(--color-red)] hover:bg-[var(--color-red-light)] hover:text-[var(--color-red-hover)]',
}

function BottomActionItem({ action }) {
  const Icon = action.icon
  const className = `flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-1 text-[0.6875rem] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[action.variant] ?? variants.secondary} ${action.className ?? ''}`
  const content = (
    <>
      {Icon && <Icon size={17} strokeWidth={2.2} aria-hidden="true" />}
      <span className="w-full truncate text-center">{action.label}</span>
    </>
  )

  if (action.to) {
    return (
      <Link
        to={action.to}
        className={className}
        aria-label={action.ariaLabel ?? action.label}
        title={action.title ?? action.label}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={className}
      aria-label={action.ariaLabel ?? action.label}
      title={action.title ?? action.label}
    >
      {content}
    </button>
  )
}

export function BottomActionBar({ actions, ariaLabel = 'Acciones contextuales' }) {
  const visibleActions = actions.filter(Boolean)
  if (visibleActions.length === 0) return null

  return (
    <nav
      aria-label={ariaLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-paper-mid)] bg-[var(--color-surface)] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgba(33,28,24,0.08)] sm:hidden"
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${visibleActions.length}, minmax(0, 1fr))` }}>
        {visibleActions.map((action) => (
          <BottomActionItem key={action.key ?? action.label} action={action} />
        ))}
      </div>
    </nav>
  )
}
