import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Euro, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'

const steps = [
  {
    icon: CalendarDays,
    title: 'Proyectos y eventos',
    body: 'Usa proyectos para agrupar trabajos con varias fechas y eventos para cada actuación, sesión o entrega concreta.',
  },
  {
    icon: Euro,
    title: 'Cachés y cobros',
    body: 'Registra ingresos previstos, cobros reales y gastos para ver pendiente, cobrado y neto sin depender de hojas sueltas.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacidad y uso',
    body: 'Tu consentimiento de uso queda guardado en tu perfil. En esta beta no activamos analítica real sin que lo decidas.',
  },
]

export default function Onboarding() {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useProfile(user?.id)
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [usageConsentOverride, setUsageConsentOverride] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1
  const usageConsent = usageConsentOverride ?? Boolean(profile?.usage_consent)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Cargando...</div>

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

  const completeOnboarding = async () => {
    setSaving(true)
    const completedAt = new Date().toISOString()
    const { error: updateError } = await updateProfile({
      onboarding_completed: true,
      onboarding_completed_at: completedAt,
      usage_consent: usageConsent,
      usage_consent_at: usageConsent ? completedAt : null,
      usage_consent_version: 'beta-8',
    })
    setSaving(false)
    if (updateError) {
      setError('No hemos podido guardar tu primera configuración.')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] px-4 py-6 sm:flex sm:items-center sm:justify-center">
      <Card className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-2xl flex-col p-5 sm:min-h-0 sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-[var(--color-red)]">Primeros pasos</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">Configura Cachés en un minuto</h1>
          <div className="mt-5 grid grid-cols-3 gap-2" aria-label={`Paso ${stepIndex + 1} de ${steps.length}`}>
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`h-2 rounded-full ${index <= stepIndex ? 'bg-[var(--color-red)]' : 'bg-[var(--color-paper-mid)]'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-6">
          <currentStep.icon size={36} className="mb-5 text-[var(--color-red)]" />
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">{currentStep.title}</h2>
          <p className="mt-3 text-base leading-7 text-[var(--color-ink-muted)]">{currentStep.body}</p>

          {isLastStep && (
            <label className="mt-6 flex items-start gap-3 rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                checked={usageConsent}
                onChange={(event) => setUsageConsentOverride(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-[var(--color-paper-mid)] accent-[var(--color-red)]"
              />
              <span>
                Acepto que Cachés pueda guardar mi preferencia de consentimiento para mejorar la beta. No se activa analítica real en este corte.
              </span>
            </label>
          )}
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-paper-mid)] pt-4 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={goBack} disabled={stepIndex === 0 || saving} className="justify-center">
            Atrás
          </Button>
          <Button onClick={goNext} disabled={saving} className="justify-center">
            {isLastStep ? (
              <>
                <CheckCircle2 size={16} />
                {saving ? 'Guardando...' : 'Entrar en Cachés'}
              </>
            ) : 'Continuar'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
