import { Search } from 'lucide-react'

export function SearchInput({ id, label = 'Buscar', className = '', inputClassName = '', ...props }) {
  const inputId = id ?? 'search-input'

  return (
    <label className={`relative block ${className}`} htmlFor={inputId}>
      <span className="sr-only">{label}</span>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
      <input
        id={inputId}
        type="search"
        className={`min-h-11 w-full rounded-full border border-border-subtle bg-surface-card py-2 pl-9 pr-3 text-sm text-text-primary shadow-sm outline-none transition-colors placeholder:text-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 ${inputClassName}`}
        {...props}
      />
    </label>
  )
}
