import { useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Circle, Download, Euro, Smartphone, UserRound, Briefcase } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useStandaloneMode } from '../../hooks/useStandaloneMode'

export function FirstStepsChecklist({ profile, projects, events, incomes, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const isStandalone = useStandaloneMode()
  const hasProfile = Boolean(profile?.full_name?.trim())
  const hasWork = projects.length > 0 || events.length > 0
  const hasIncome = incomes.length > 0
  const hasExportableData = hasWork || hasIncome
  const activityCount = projects.length + events.length + incomes.length
  const shouldShow = activityCount <= 2 || !hasProfile

  if (!shouldShow) return null

  const steps = [
    {
      label: 'Completa tu perfil',
      description: 'Nombre, profesión e IRPF habitual.',
      done: hasProfile,
      path: '/settings',
      icon: UserRound,
    },
    {
      label: 'Crea tu primer trabajo',
      description: 'Proyecto o evento, lo que encaje con tu caso.',
      done: hasWork,
      path: '/work',
      icon: Briefcase,
    },
    {
      label: 'Registra un cobro',
      description: 'Añade un caché previsto o cobrado.',
      done: hasIncome,
      path: hasWork ? '/work' : '/onboarding',
      icon: Euro,
    },
    {
      label: 'Revisa tus datos',
      description: 'Exporta una copia cuando tengas información real.',
      done: hasExportableData,
      path: '/data',
      icon: Download,
    },
    {
      label: 'Instala Cachés en el móvil',
      description: isStandalone ? 'Ya estás usando la app desde su icono.' : 'Abre el tutorial para verlo como una app.',
      done: isStandalone,
      path: '/onboarding',
      icon: Smartphone,
    },
  ]

  const completed = steps.filter((step) => step.done).length
  const suggestedStep = steps.find((step) => !step.done) ?? {
    label: 'Revisar tutorial',
    description: 'Repasa el modelo de trabajos, cobros y app móvil.',
    done: true,
    path: '/onboarding',
    icon: CheckCircle2,
  }
  const SuggestedIcon = suggestedStep.icon
  const ToggleIcon = expanded ? ChevronUp : ChevronDown

  return (
    <Card className="p-3 sm:p-4" data-testid="first-steps-checklist">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.02em] text-accent-primary">Primeros pasos</p>
          <h2 className="mt-1 font-display text-sm font-semibold leading-snug text-text-primary sm:text-base">Deja Cachés listo para tu primer trabajo</h2>
          <p className="mt-1 text-xs text-text-secondary sm:text-sm">
            {completed} de {steps.length} pasos listos. Puedes seguir a tu ritmo.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => onNavigate('/onboarding')} className="hidden justify-center sm:inline-flex">
          Ver tutorial
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_3rem] gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => onNavigate(suggestedStep.path)}
          className="flex min-h-12 min-w-0 items-center gap-2 rounded-2xl border border-border-subtle bg-surface-muted px-3 py-2 text-left transition-colors hover:bg-surface-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${suggestedStep.done ? 'bg-success-soft text-success' : 'bg-surface-page text-text-secondary'}`}>
            <SuggestedIcon size={15} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.6875rem] font-medium uppercase leading-none tracking-[0.02em] text-text-secondary">Siguiente</span>
            <span className="mt-1 block truncate text-sm font-medium leading-tight text-text-primary">{suggestedStep.label}</span>
          </span>
          <ArrowRight size={15} className="shrink-0 text-text-secondary" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-controls="first-steps-list"
          aria-label={expanded ? 'Ocultar primeros pasos' : 'Mostrar primeros pasos'}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-text-secondary shadow-sm transition-colors hover:bg-surface-page-dark hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          <ToggleIcon size={18} />
        </button>
      </div>

      <div id="first-steps-list" className={`${expanded ? 'grid' : 'hidden'} mt-3 gap-1.5 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-2 xl:grid-cols-5`}>
        {steps.map((step) => {
          const Icon = step.icon
          const StatusIcon = step.done ? CheckCircle2 : Circle
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => onNavigate(step.path)}
              className="flex min-h-12 min-w-0 items-start gap-2 rounded-2xl border border-border-subtle bg-surface-muted p-2.5 text-left transition-colors hover:bg-surface-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:min-h-24 sm:gap-3 sm:p-3"
            >
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${step.done ? 'bg-success-soft text-success' : 'bg-surface-page text-text-secondary'}`}>
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start gap-2">
                  <StatusIcon size={15} className={`mt-0.5 shrink-0 ${step.done ? 'text-success' : 'text-text-secondary'}`} />
                  <span className="text-sm font-medium leading-snug text-text-primary">{step.label}</span>
                </span>
                <span className="mt-1 hidden text-xs leading-5 text-text-secondary sm:block">{step.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
