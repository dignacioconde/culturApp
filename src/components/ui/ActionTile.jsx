export function ActionTile({ icon: Icon, title, children, action, as: Component = 'div', className = '', ...props }) {
  return (
    <Component
      className={`flex min-w-0 flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-4 text-left transition-colors hover:bg-surface-page ${className}`}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-text-secondary shadow-sm">
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          {title && <p className="text-sm font-semibold text-text-primary">{title}</p>}
          {children && <div className="mt-1 text-xs leading-5 text-text-secondary">{children}</div>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </Component>
  )
}
