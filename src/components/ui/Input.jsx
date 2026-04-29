import { useId } from 'react'

const fieldBaseClass = 'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500'

function FieldWrapper({ label, error, inputId, errorId, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
      {error && <p id={errorId} className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

function getFieldStateClass(error) {
  return error
    ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-gray-300 focus-visible:border-indigo-500'
}

export function Input({ label, error, className = '', id, 'aria-describedby': ariaDescribedBy, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`${fieldBaseClass} ${getFieldStateClass(error)} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
}

export function Select({ label, error, children, className = '', id, 'aria-describedby': ariaDescribedBy, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <select
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`${fieldBaseClass} pr-9 ${getFieldStateClass(error)} ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
}

export function Textarea({ label, error, className = '', id, 'aria-describedby': ariaDescribedBy, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <textarea
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`${fieldBaseClass} min-h-24 resize-y ${getFieldStateClass(error)} ${className}`}
        rows={3}
        {...props}
      />
    </FieldWrapper>
  )
}
