const variants = {
  primary: 'bg-[#C94035] text-white shadow-sm hover:bg-[#A8342B] active:bg-[#8f2b23] disabled:bg-[#ef8580]',
  secondary: 'border border-[#E2D9C2] bg-[#F5EFE0] text-[#211C18] shadow-sm hover:bg-[#EBE3CE] hover:text-[#211C18] active:bg-[#E2D9C2] disabled:bg-[#EBE3CE] disabled:text-[#5C5149]',
  danger: 'bg-[#C94035] text-white shadow-sm hover:bg-[#A8342B] active:bg-[#8f2b23] disabled:bg-[#ef8580]',
  ghost: 'text-[#5C5149] hover:bg-[#EBE3CE] hover:text-[#211C18] active:bg-[#E2D9C2] disabled:text-[#5C5149]',
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
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
