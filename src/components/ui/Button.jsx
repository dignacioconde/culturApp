const variants = {
  primary: 'bg-[var(--color-red)] text-white shadow-sm hover:bg-[var(--color-red-hover)] active:bg-[var(--color-primary-800)] disabled:bg-[var(--color-primary-400)]',
  secondary: 'border border-[var(--color-paper-mid)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm hover:bg-[var(--color-paper-dark)] hover:text-[var(--color-ink)] active:bg-[var(--color-paper-mid)] disabled:bg-[var(--color-paper-dark)] disabled:text-[var(--color-ink-muted)]',
  danger: 'bg-[var(--color-red)] text-white shadow-sm hover:bg-[var(--color-red-hover)] active:bg-[var(--color-primary-800)] disabled:bg-[var(--color-primary-400)]',
  ghost: 'text-[var(--color-ink-muted)] hover:bg-[var(--color-paper-dark)] hover:text-[var(--color-ink)] active:bg-[var(--color-paper-mid)] disabled:text-[var(--color-ink-muted)]',
}

const sizes = {
  sm: 'min-h-8 px-3 py-1.5 text-sm',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-11 px-5 py-2.5 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const variantClass = variants[variant] ?? variants.primary
  const sizeClass = sizes[size] ?? sizes.md

  return (
    <button
      type={type}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
