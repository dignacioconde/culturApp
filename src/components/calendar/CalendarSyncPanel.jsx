import { CalendarCheck, Copy, ExternalLink, Link2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Notice } from '../ui/Notice'

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
          const activeFeeds = activeFeedsForProvider(feeds, provider.id)
          const latestFeed = activeFeeds[0]
          const urls = latestFeed ? createdLinks[latestFeed.id] : null
          const isCreating = creatingProvider === provider.id
          const isRevoking = latestFeed && revokingId === latestFeed.id

          return (
            <article key={provider.id} className="rounded-lg border border-border-subtle bg-surface-muted p-3">
              <div className="mb-3 flex items-start gap-2">
                <Link2 size={18} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary">{provider.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">{provider.text}</p>
                </div>
              </div>

              {latestFeed && (
                <div className="mb-3 rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-xs text-text-secondary">
                  <p className="font-medium text-text-primary">Enlace activo</p>
                  {urls ? (
                    <p className="mt-1 break-all font-mono text-[11px]">{urls.httpsUrl}</p>
                  ) : (
                    <p className="mt-1">Por seguridad, el enlace completo solo se muestra al crearlo.</p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
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
                  variant={latestFeed ? 'secondary' : 'primary'}
                  size="sm"
                  className="min-h-10"
                  onClick={() => handleCreate(provider.id)}
                  disabled={loading || isCreating}
                >
                  <RefreshCw size={15} />
                  {latestFeed ? 'Crear otro' : isCreating ? 'Creando…' : 'Crear enlace'}
                </Button>
                {latestFeed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-10"
                    onClick={() => handleRevoke(latestFeed.id)}
                    disabled={Boolean(isRevoking)}
                  >
                    <Trash2 size={15} />
                    {isRevoking ? 'Desactivando…' : 'Desactivar'}
                  </Button>
                )}
              </div>

              {activeFeeds.length > 1 && (
                <p className="mt-2 text-xs text-text-secondary">{activeFeeds.length} enlaces activos para este proveedor.</p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
