export function CheckboxField({ id, label, description, className = '', inputClassName = '', ...props }) {
  return (
    <label htmlFor={id} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-3 text-sm text-text-primary ${className}`}>
      <input
        id={id}
        type="checkbox"
        className={`mt-0.5 h-5 w-5 rounded border-border-subtle text-accent-primary accent-[var(--accent-primary)] focus:ring-accent-primary ${inputClassName}`}
        {...props}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-5">{label}</span>
        {description && <span className="mt-1 block text-xs leading-5 text-text-secondary">{description}</span>}
      </span>
    </label>
  )
}
