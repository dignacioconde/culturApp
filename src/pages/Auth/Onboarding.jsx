import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Building2, Briefcase, CalendarDays, CheckCircle2, Download, Euro, ShieldCheck, Smartphone, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useStandaloneMode } from '../../hooks/useStandaloneMode'
import { USAGE_CONSENT_DESCRIPTION, USAGE_CONSENT_VERSION } from '../../lib/constants'

const buildSteps = (isStandalone) => [
  {
    icon: Briefcase,
    title: 'Trabajos, proyectos y eventos',
    body: 'Piensa en Trabajos como tu entrada principal. Un proyecto agrupa un encargo con varias fechas; un evento es una actuación, sesión o entrega concreta con día y hora.',
    points: ['Usa proyecto para una gira, producción o encargo largo.', 'Usa evento para una fecha concreta, incluso si no tiene proyecto.'],
  },
  {
    icon: CalendarDays,
    title: 'Agenda real',
    body: 'Los eventos aparecen en Agenda y los proyectos en Plan anual. Así puedes separar lo que ocurre a una hora exacta de lo que ocupa una temporada.',
    points: ['Evento: fecha y hora exactas.', 'Proyecto: rango de fechas y contexto general.'],
  },
  {
    icon: Euro,
    title: 'Cachés y cobros',
    body: 'Registra ingresos previstos, marca cobros reales y añade gastos para ver pendiente, cobrado y neto sin depender de hojas sueltas.',
    points: ['El cobro rápido sirve para apuntar un caché en segundos.', 'Los gastos ayudan a entender si el trabajo compensa.'],
  },
  {
    icon: Building2,
    title: 'Contratantes',
    body: 'Puedes asociar proyectos y eventos a un contratante para no repetir nombres y para encontrar mejor quién te debe qué.',
    points: ['Un evento puede heredar el contratante del proyecto.', 'El texto antiguo de cliente sigue funcionando como apoyo.'],
  },
  {
    icon: Download,
    title: 'Tus datos siguen siendo tuyos',
    body: 'Desde Tus datos puedes exportar una copia para guardar fuera de Cachés. Es parte de la confianza mínima de la beta.',
    points: ['JSON para copia completa.', 'CSV para revisar en una hoja de cálculo.'],
  },
  {
    icon: Smartphone,
    title: 'Usar Cachés como app',
    body: isStandalone
      ? 'Ya estás usando Cachés desde su icono. Si navegas por dentro de la app, debería mantenerse sin la barra del navegador.'
      : 'Para que Cachés se vea en el móvil como una app, instálala desde el navegador y ábrela después desde el icono.',
    points: isStandalone
      ? ['Si alguna pantalla abre el navegador, avísanos desde Feedback.', 'Las mejoras offline y notificaciones llegarán en otro corte.']
      : ['iPhone: abre app.caches.es en Safari, toca Compartir y elige Añadir a pantalla de inicio.', 'Android: abre app.caches.es en Chrome y toca Instalar app o Añadir a pantalla de inicio.'],
  },
  {
    icon: ShieldCheck,
    title: 'Privacidad y uso',
    body: USAGE_CONSENT_DESCRIPTION,
    points: ['El consentimiento queda guardado en tu perfil.', 'Puedes cambiarlo luego desde Ajustes.'],
  },
]

export default function Onboarding() {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useProfile(user?.id)
  const navigate = useNavigate()
  const location = useLocation()
  const isStandalone = useStandaloneMode()
  const steps = buildSteps(isStandalone)
  const [stepIndex, setStepIndex] = useState(0)
  const [usageConsentOverride, setUsageConsentOverride] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const currentStep = steps[stepIndex]
  const CurrentStepIcon = currentStep.icon
  const isLastStep = stepIndex === steps.length - 1
  const usageConsent = usageConsentOverride ?? Boolean(profile?.usage_consent)
  const requestedCloseTarget = typeof location.state?.from === 'string' && location.state.from !== '/onboarding'
    ? location.state.from
    : null
  const closeTarget = requestedCloseTarget ?? (profile?.onboarding_completed ? '/settings' : '/dashboard')

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-surface-page text-sm text-text-secondary">Cargando...</div>

  const goNext = () => {
    setError('')
    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }
    completeOnboarding()
  }

  const goBack = () => {
    setError('')
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  const closeTutorial = async () => {
    setError('')
    if (profile?.onboarding_completed) {
      navigate(closeTarget, { replace: true })
      return
    }

    setSaving(true)
    const completedAt = new Date().toISOString()
    const { error: updateError } = await updateProfile({
      onboarding_completed: true,
      onboarding_completed_at: completedAt,
    })
    setSaving(false)
    if (updateError) {
      setError('No hemos podido cerrar el tutorial.')
      return
    }
    navigate(closeTarget, { replace: true, state: { onboardingCompleted: true } })
  }

  const completeOnboarding = async () => {
    setSaving(true)
    const completedAt = new Date().toISOString()
    const { error: updateError } = await updateProfile({
      onboarding_completed: true,
      onboarding_completed_at: completedAt,
      usage_consent: usageConsent,
      usage_consent_at: usageConsent ? completedAt : null,
      usage_consent_version: usageConsent ? USAGE_CONSENT_VERSION : null,
    })
    setSaving(false)
    if (updateError) {
      setError('No hemos podido guardar tu primera configuración.')
      return
    }
    navigate('/settings', { replace: true, state: { onboardingCompleted: true } })
  }

  return (
    <div className="min-h-dvh bg-surface-page px-3 py-3 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6">
      <Card className="mx-auto flex w-full max-w-3xl flex-col p-4 sm:min-h-[calc(100dvh-3rem)] sm:p-8" data-testid="onboarding-tutorial-card">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-accent-primary sm:text-sm">Primeros pasos</p>
              <h1 className="mt-1 font-display text-xl font-semibold leading-tight text-text-primary sm:text-2xl">Aprende lo esencial de Cachés</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-surface-page-dark px-2.5 py-1 text-xs font-medium text-text-secondary">
                Paso {stepIndex + 1}/{steps.length}
              </span>
              <button
                type="button"
                onClick={closeTutorial}
                disabled={saving}
                aria-label="Cerrar tutorial"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-1.5 sm:mt-5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label={`Paso ${stepIndex + 1} de ${steps.length}`}>
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`h-1.5 rounded-full sm:h-2 ${index <= stepIndex ? 'bg-accent-primary' : 'bg-border-subtle'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-start py-2 sm:justify-center sm:py-6">
          <div className="flex items-start gap-3 sm:block">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-page-dark sm:mb-5 sm:mt-0 sm:h-auto sm:w-auto sm:bg-transparent">
              <CurrentStepIcon size={20} className="text-accent-primary sm:hidden" />
              <CurrentStepIcon size={36} className="hidden text-accent-primary sm:block" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold leading-tight text-text-primary sm:text-xl">{currentStep.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary sm:mt-3 sm:text-base sm:leading-7">{currentStep.body}</p>
            </div>
          </div>
          <ul className="mt-4 grid gap-1.5 text-sm leading-5 text-text-primary sm:mt-5 sm:grid-cols-2 sm:gap-2">
            {currentStep.points.map((point) => (
              <li key={point} className="flex items-start gap-2 rounded-2xl border border-border-subtle bg-surface-muted p-2.5 sm:p-3">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent-primary sm:size-4" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {isLastStep && (
            <label className="mt-4 flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-3 text-sm text-text-primary sm:mt-6 sm:p-4">
              <input
                type="checkbox"
                checked={usageConsent}
                onChange={(event) => setUsageConsentOverride(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-border-subtle accent-[var(--accent-primary)]"
              />
              <span>
                Acepto que Cachés guarde mi preferencia de consentimiento para mejorar la beta. En esta versión no se activa analítica real ni se envían eventos de uso.
              </span>
            </label>
          )}
        </div>

        {error && <p className="mb-4 rounded-2xl bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}

        <div className="mt-4 flex flex-col-reverse gap-2 border-t border-border-subtle pt-3 sm:mt-0 sm:flex-row sm:justify-between sm:gap-3 sm:pt-4">
          <Button variant="secondary" onClick={goBack} disabled={stepIndex === 0 || saving} className="justify-center">
            Atrás
          </Button>
          <Button onClick={goNext} disabled={saving} className="justify-center">
            {isLastStep ? (
              <>
                <CheckCircle2 size={16} />
                {saving ? 'Guardando...' : 'Guardar y ver perfil'}
              </>
            ) : 'Continuar'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
