export function SectionHeader({ eyebrow, title, children, action, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.02em] text-accent-primary">{eyebrow}</p>}
        {title && <h2 className="font-display text-lg font-semibold leading-tight text-text-primary">{title}</h2>}
        {children && <div className="mt-1 text-sm leading-6 text-text-secondary">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
