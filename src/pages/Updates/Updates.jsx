import { CheckCircle2, History, Megaphone, Sparkles } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/formatters'
import {
  LATEST_VERSION,
  VERSION_HISTORY,
  VERSION_TONE_LABELS,
  VERSION_TONE_STYLES,
} from '../../lib/versionHistory'

function ToneBadge({ tone }) {
  return (
    <Badge className={VERSION_TONE_STYLES[tone] ?? 'bg-surface-muted text-text-secondary'}>
      {VERSION_TONE_LABELS[tone] ?? 'Novedad'}
    </Badge>
  )
}

function LatestUpdate() {
  return (
    <section className="rounded-2xl border border-border-subtle bg-sidebar-bg p-4 text-sidebar-fg shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-text-primary/25 text-sidebar-fg">
              <Sparkles size={18} />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.04em] text-sidebar-muted">Última novedad</span>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-sidebar-fg sm:text-2xl">{LATEST_VERSION.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-sidebar-muted">{LATEST_VERSION.summary}</p>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
          <span className="rounded-full bg-surface-page px-3 py-1 text-xs font-semibold text-text-primary">
            {LATEST_VERSION.label}
          </span>
          <span className="text-xs text-sidebar-muted">{formatDate(LATEST_VERSION.date)}</span>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {LATEST_VERSION.highlights.map((highlight) => (
          <div key={highlight} className="flex items-start gap-2 rounded-2xl border border-sidebar-fg/10 bg-sidebar-fg/5 p-3 text-sm leading-5">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sidebar-fg" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function VersionCard({ entry, isLatest }) {
  return (
    <Card className="card-lift border-border-subtle bg-surface-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={entry.tone} />
            {isLatest && <Badge className="bg-surface-page-dark text-text-primary">Actual</Badge>}
            <span className="text-xs font-medium text-text-secondary">{entry.label}</span>
            <span className="text-xs text-text-secondary">{formatDate(entry.date)}</span>
          </div>
          <h3 className="mt-3 font-display text-base font-semibold leading-snug text-text-primary">{entry.title}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{entry.summary}</p>
          <ul className="mt-4 grid gap-2 text-sm text-text-primary sm:grid-cols-2">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent-primary" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 rounded-2xl border border-border-subtle bg-surface-muted p-3 lg:w-72">
          <p className="text-xs font-semibold uppercase tracking-[0.04em] text-text-secondary">También cambia</p>
          <ul className="mt-2 flex flex-col gap-2 text-sm leading-5 text-text-secondary">
            {entry.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default function Updates() {
  return (
    <PageWrapper title="Novedades">
      <div className="flex max-w-5xl flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-accent-primary">
              <Megaphone size={17} />
              <span>Historial de versiones</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-text-primary">Qué ha cambiado en la beta</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Un resumen claro de las mejoras que ya tienes disponibles, escrito para usar la app sin leer notas técnicas.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-secondary shadow-sm">
            <History size={16} />
            <span>{VERSION_HISTORY.length} versiones visibles</span>
          </div>
        </div>

        <LatestUpdate />

        <section className="flex flex-col gap-3" aria-label="Versiones anteriores">
          {VERSION_HISTORY.map((entry, index) => (
            <VersionCard key={entry.version} entry={entry} isLatest={index === 0} />
          ))}
        </section>
      </div>
    </PageWrapper>
  )
}
