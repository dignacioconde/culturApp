import { Link } from 'react-router-dom'

const variants = {
  primary: 'border-transparent bg-accent-primary text-primary-foreground shadow-sm hover:bg-accent-primary-hover',
  secondary: 'border-border-subtle bg-surface-card text-text-primary shadow-sm hover:bg-surface-page-dark',
  muted: 'border-transparent bg-transparent text-text-secondary hover:bg-surface-page-dark hover:text-text-primary',
  danger: 'border-danger-soft bg-danger-soft text-danger hover:border-danger/20 hover:text-accent-primary-hover',
}

function BottomActionItem({ action }) {
  const Icon = action.icon
  const className = `flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-1 text-[0.6875rem] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[action.variant] ?? variants.secondary} ${action.className ?? ''}`
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-card/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-6px_18px_color-mix(in_oklab,var(--text-primary)_8%,transparent)] backdrop-blur sm:hidden"
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${visibleActions.length}, minmax(0, 1fr))` }}>
        {visibleActions.map((action) => (
          <BottomActionItem key={action.key ?? action.label} action={action} />
        ))}
      </div>
    </nav>
  )
}
