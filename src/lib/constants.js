export const PROJECT_STATUSES = [
  { value: 'draft', label: 'Borrador' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

export const EVENT_STATUSES = PROJECT_STATUSES

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
  draft: 'bg-[#E2D9C2] text-[#5C5149]',
  confirmed: 'bg-[#E6EDF5] text-[#2855A0]',
  in_progress: 'bg-[#FDF5E4] text-[#9B6210]',
  completed: 'bg-[#E8F4EF] text-[#2D6A4F]',
  cancelled: 'bg-[#F9EDEB] text-[#C94035]',
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
