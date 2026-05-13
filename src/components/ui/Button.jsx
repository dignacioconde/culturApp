const variants = {
  primary: 'bg-accent-primary text-surface-page shadow-sm hover:bg-accent-primary-hover active:bg-accent-primary-hover disabled:bg-accent-primary/50',
  secondary: 'border border-border-subtle bg-surface-card text-text-primary shadow-sm hover:bg-surface-page-dark hover:text-text-primary active:bg-border-subtle disabled:bg-surface-page-dark disabled:text-text-secondary',
  danger: 'bg-danger text-surface-page shadow-sm hover:bg-accent-primary-hover active:bg-accent-primary-hover disabled:bg-danger/50',
  ghost: 'text-text-secondary hover:bg-surface-page-dark hover:text-text-primary active:bg-border-subtle disabled:text-text-secondary',
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
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
