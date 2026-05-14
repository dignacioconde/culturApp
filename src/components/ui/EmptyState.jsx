export function EmptyState({ icon: Icon, title, children, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface-muted px-4 py-12 text-center ${className}`}>
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-text-secondary shadow-sm">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      {title && <p className="mt-3 text-sm font-semibold text-text-primary">{title}</p>}
      {children && <div className="mt-1 max-w-sm text-sm leading-6 text-text-secondary">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
