import { CalendarCheck, Copy, ExternalLink, Link2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Notice } from '../ui/Notice'
import { formatDatetime } from '../../lib/formatters'

const providers = [
  {
    id: 'apple',
    title: 'Apple Calendar',
    text: 'Abre el enlace en iPhone, iPad o Mac, o cópialo si prefieres pegarlo a mano.',
    primaryLabel: 'Abrir',
  },
  {
    id: 'google',
    title: 'Google Calendar',
    text: 'Copia el enlace y añádelo desde Google Calendar en ordenador: Otros calendarios, Desde URL.',
    primaryLabel: 'Copiar',
  },
  {
    id: 'outlook',
    title: 'Outlook',
    text: 'Copia el enlace y suscríbete desde Outlook web. El refresco puede tardar más de 24 horas.',
    primaryLabel: 'Copiar',
  },
]

function activeFeedsForProvider(feeds, provider) {
  return feeds.filter((feed) => feed.provider === provider && !feed.revoked_at)
}

function feedsForProvider(feeds, provider) {
  return feeds
    .filter((feed) => feed.provider === provider)
    .sort((first, second) => {
      const firstRevoked = Boolean(first.revoked_at)
      const secondRevoked = Boolean(second.revoked_at)
      if (firstRevoked !== secondRevoked) return firstRevoked ? 1 : -1
      return new Date(second.created_at ?? 0).getTime() - new Date(first.created_at ?? 0).getTime()
    })
}

function statusClass(isActive) {
  return isActive
    ? 'border-success/30 bg-success-soft text-success'
    : 'border-border-subtle bg-surface-muted text-text-secondary'
}

function activeCountLabel(count) {
  if (count === 0) return 'Sin enlaces activos'
  if (count === 1) return '1 activo'
  return `${count} activos`
}

export function CalendarSyncPanel({
  feeds,
  loading,
  creatingProvider,
  revokingId,
  createdLinks,
  createFeed,
  revokeFeed,
  onToast,
}) {
  const copyUrl = async (url) => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      onToast?.('Enlace copiado.')
    } catch {
      onToast?.('No se ha podido copiar el enlace.', 'error')
    }
  }

  const handleCreate = async (provider) => {
    const { data, error } = await createFeed(provider)
    if (error) {
      onToast?.('No se ha podido crear el enlace.', 'error')
      return
    }

    if (data?.urls?.httpsUrl && navigator.clipboard) {
      await copyUrl(data.urls.httpsUrl)
    }
    onToast?.('Enlace de sincronización creado.')
  }

  const handleRevoke = async (feedId) => {
    const { error } = await revokeFeed(feedId)
    if (error) {
      onToast?.('No se ha podido desactivar el enlace.', 'error')
      return
    }
    onToast?.('Enlace desactivado.')
  }

  return (
    <section className="rounded-lg border border-border-subtle bg-surface-card p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-primary">
          <CalendarCheck size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text-primary">Sincronizar con tu calendario</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Crea un enlace privado de solo lectura para que tus eventos aparezcan en tu calendario habitual.
          </p>
        </div>
      </div>

      <Notice tone="warning" icon={ShieldCheck} className="mb-4">
        Quien tenga un enlace activo puede ver los eventos incluidos. Puedes desactivarlo cuando quieras.
      </Notice>

      <div className="grid gap-3 xl:grid-cols-3">
        {providers.map((provider) => {
          const providerFeeds = feedsForProvider(feeds, provider.id)
          const activeFeeds = activeFeedsForProvider(providerFeeds, provider.id)
          const isCreating = creatingProvider === provider.id

          return (
            <article key={provider.id} className="rounded-lg border border-border-subtle bg-surface-muted p-3">
              <div className="mb-3 flex items-start gap-2">
                <Link2 size={18} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">{provider.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(activeFeeds.length > 0)}`}>
                      {activeCountLabel(activeFeeds.length)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">{provider.text}</p>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <Button
                  variant={activeFeeds.length > 0 ? 'secondary' : 'primary'}
                  size="sm"
                  className="min-h-10"
                  onClick={() => handleCreate(provider.id)}
                  disabled={loading || isCreating}
                >
                  <RefreshCw size={15} />
                  {isCreating ? 'Creando…' : activeFeeds.length > 0 ? 'Crear nuevo' : 'Crear enlace'}
                </Button>
              </div>

              {providerFeeds.length === 0 ? (
                <p className="border-t border-border-subtle pt-3 text-xs text-text-secondary">
                  Aún no has creado enlaces para este proveedor.
                </p>
              ) : (
                <div className="border-y border-border-subtle">
                  <p className="py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Enlaces</p>
                  <div className="divide-y divide-border-subtle">
                    {providerFeeds.map((feed) => {
                      const isActive = !feed.revoked_at
                      const urls = createdLinks[feed.id]
                      const isRevoking = revokingId === feed.id

                      return (
                        <div key={feed.id} className="py-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-primary">{feed.label}</p>
                              <p className="mt-1 text-xs text-text-secondary">Creado {formatDatetime(feed.created_at)}</p>
                              {feed.last_accessed_at && isActive && (
                                <p className="text-xs text-text-secondary">Último uso {formatDatetime(feed.last_accessed_at)}</p>
                              )}
                              {feed.revoked_at && (
                                <p className="text-xs text-text-secondary">Desactivado {formatDatetime(feed.revoked_at)}</p>
                              )}
                            </div>
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(isActive)}`}>
                              {isActive ? 'Activo' : 'Desactivado'}
                            </span>
                          </div>

                          {isActive && urls && (
                            <p className="mt-2 break-all font-mono text-[11px] text-text-secondary">{urls.httpsUrl}</p>
                          )}
                          {isActive && !urls && (
                            <p className="mt-2 text-xs text-text-secondary">
                              El enlace completo solo se muestra al crearlo. Si necesitas copiarlo otra vez, crea uno nuevo y desactiva este.
                            </p>
                          )}

                          {isActive && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {urls && provider.id === 'apple' && (
                                <Button size="sm" className="min-h-10" onClick={() => window.location.assign(urls.webcalUrl)}>
                                  <ExternalLink size={15} />
                                  {provider.primaryLabel}
                                </Button>
                              )}
                              {urls && (
                                <Button variant="secondary" size="sm" className="min-h-10" onClick={() => copyUrl(urls.httpsUrl)}>
                                  <Copy size={15} />
                                  Copiar
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="min-h-10"
                                onClick={() => handleRevoke(feed.id)}
                                disabled={Boolean(isRevoking)}
                              >
                                <Trash2 size={15} />
                                {isRevoking ? 'Desactivando…' : 'Desactivar'}
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
