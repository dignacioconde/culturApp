export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-lg border border-border-subtle bg-surface-card text-text-primary shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
