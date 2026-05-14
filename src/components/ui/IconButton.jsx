const variants = {
  ghost: 'text-text-secondary hover:bg-surface-page-dark hover:text-text-primary',
  secondary: 'border border-border-subtle bg-surface-card text-text-primary shadow-sm hover:bg-surface-page-dark',
  primary: 'bg-accent-primary text-primary-foreground shadow-sm hover:bg-accent-primary-hover',
  danger: 'text-danger hover:bg-danger-soft hover:text-accent-primary-hover',
}

const sizes = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

export function IconButton({ icon: Icon, label, variant = 'ghost', size = 'md', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] ?? variants.ghost} ${sizes[size] ?? sizes.md} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
