export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors outline-none bg-white
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none resize-none
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}
          ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
