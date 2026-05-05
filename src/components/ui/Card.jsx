export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
