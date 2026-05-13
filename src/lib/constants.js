export const PROJECT_STATUSES = [
  { value: 'draft', label: 'Borrador' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

export const EVENT_STATUSES = PROJECT_STATUSES

export const USAGE_CONSENT_VERSION = 'usage-consent-2026-05'

export const USAGE_CONSENT_DESCRIPTION =
  'Guardamos tu preferencia de consentimiento en el perfil. En esta versión no activamos analítica real ni enviamos eventos de uso.'

export const PROJECT_CATEGORIES = [
  { value: 'concierto', label: 'Concierto' },
  { value: 'exposición', label: 'Exposición' },
  { value: 'taller', label: 'Taller' },
  { value: 'diseño', label: 'Diseño' },
  { value: 'fotografía', label: 'Fotografía' },
  { value: 'otros', label: 'Otros' },
]

export const EVENT_CATEGORIES = PROJECT_CATEGORIES

export const EXPENSE_CATEGORIES = [
  { value: 'transporte', label: 'Transporte' },
  { value: 'material', label: 'Material' },
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'espacio', label: 'Espacio' },
  { value: 'software', label: 'Software' },
  { value: 'otros', label: 'Otros' },
]

export const STATUS_COLORS = {
  draft: 'bg-[var(--color-status-draft-bg)] text-[var(--color-status-draft-text)]',
  confirmed: 'bg-[var(--color-status-confirmed-bg)] text-[var(--color-status-confirmed-text)]',
  in_progress: 'bg-[var(--color-status-inprogress-bg)] text-[var(--color-status-inprogress-text)]',
  completed: 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)]',
  cancelled: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-text)]',
}

export const STATUS_LABELS = {
  draft: 'Borrador',
  confirmed: 'Confirmado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export const DEFAULT_PROJECT_COLORS = [
  '#4f98a3', '#7c6dc7', '#e07c5a', '#5aaa7c', '#c76d8f',
  '#a3944f', '#5a7ce0', '#c7a36d', '#6dc7b8', '#e05a7c',
]
