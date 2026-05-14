export function MetricTile({ label, value, helper, tone = 'default', className = '' }) {
  const toneClass = tone === 'danger'
    ? 'text-danger'
    : tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : 'text-text-primary'

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface-card px-4 py-3 shadow-sm ${className}`}>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className={`mt-1 font-data text-xl font-semibold ${toneClass}`}>{value}</p>
      {helper && <p className="mt-1 text-xs leading-5 text-text-secondary">{helper}</p>}
    </div>
  )
}
