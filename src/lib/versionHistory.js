export const VERSION_HISTORY = [
  {
    version: '0.1.0-beta.21',
    label: 'Beta 21',
    date: '2026-05-13',
    title: 'Primera sesión guiada y app instalable',
    summary: 'Cachés es más fácil de entender al entrar por primera vez y ya puedes guardarla en el móvil como una app.',
    highlights: [
      'Tutorial revisitable desde Ajustes.',
      'Checklist compacto para empezar sin perderte.',
      'Instalación básica como PWA en móvil.',
    ],
    details: [
      'El consentimiento de uso deja de referirse a una beta antigua.',
      'El tutorial explica trabajos, proyectos, eventos, cobros, gastos, contratantes y uso móvil.',
      'El service worker solo guarda el app shell y no cachea datos personales.',
    ],
    tone: 'new',
  },
  {
    version: '0.1.0-beta.20',
    label: 'Beta 20',
    date: '2026-05-13',
    title: 'Acciones rápidas más claras en móvil',
    summary: 'Los detalles de proyecto y evento comparten la misma barra inferior para cobros, gastos, edición y borrado.',
    highlights: [
      'Barra contextual consistente en detalles.',
      'Acciones financieras más a mano en pantallas pequeñas.',
      'Borrado menos dominante y con confirmación.',
    ],
    details: [
      'Desktop conserva una vista más densa.',
      'El contenido final ya no queda tapado por la barra de acciones.',
    ],
    tone: 'improved',
  },
  {
    version: '0.1.0-beta.19',
    label: 'Beta 19',
    date: '2026-05-13',
    title: 'Contratantes reutilizables',
    summary: 'Puedes asociar proyectos y eventos a contratantes estructurados en lugar de repetir texto libre.',
    highlights: [
      'Nuevo espacio de Contratantes.',
      'Proyectos y eventos pueden elegir o crear contratante.',
      'Los eventos pueden heredar el contratante del proyecto.',
    ],
    details: [
      'El campo cliente antiguo sigue funcionando como apoyo.',
      'Exportación e importación incluyen contratantes.',
      'No cambia ninguna fórmula financiera.',
    ],
    tone: 'new',
  },
  {
    version: '0.1.0-beta.18',
    label: 'Beta 18',
    date: '2026-05-13',
    title: 'Detalles más útiles para trabajar',
    summary: 'Los proyectos y eventos ganan notas editables, formularios financieros rápidos y calendarios mejor separados.',
    highlights: [
      'Notas contextuales en proyectos y eventos.',
      'Cobros y gastos rápidos más cómodos.',
      'Agenda de eventos separada del plan anual de proyectos.',
    ],
    details: [
      'La agenda se centra en fechas con hora exacta.',
      'El plan anual mantiene la visión de proyectos por rango.',
    ],
    tone: 'improved',
  },
  {
    version: '0.1.0-beta.17',
    label: 'Beta 17',
    date: '2026-05-13',
    title: 'Feedback dentro de la app',
    summary: 'Ahora puedes enviar comentarios de la beta sin salir de Cachés.',
    highlights: [
      'Botón de Feedback en la barra superior.',
      'Formulario simple para contar errores, dudas o mejoras.',
      'Sin activar analítica de producto.',
    ],
    details: [
      'Los comentarios se guardan para revisión de la beta.',
    ],
    tone: 'new',
  },
  {
    version: '0.1.0-beta.16',
    label: 'Beta 16',
    date: '2026-05-10',
    title: 'Navegación móvil más directa',
    summary: 'La navegación inferior móvil se simplifica para que Inicio, Trabajos, Agenda, Plan, Datos y Ajustes estén siempre a mano.',
    highlights: [
      'Barra inferior con destinos principales.',
      'Menos dependencia de menús laterales en móvil.',
      'Estados activos más visibles.',
    ],
    details: [
      'Los detalles con acciones contextuales evitan duplicar navegación inferior.',
    ],
    tone: 'improved',
  },
  {
    version: '0.1.0-beta.15',
    label: 'Beta 15',
    date: '2026-05-10',
    title: 'Dominio público definitivo',
    summary: 'Cachés queda disponible desde app.caches.es para la beta.',
    highlights: [
      'Dominio canónico de la app.',
      'Redirecciones de acceso alineadas con producción.',
      'Base preparada para invitaciones y confirmaciones.',
    ],
    details: [
      'El alias antiguo queda solo como continuidad técnica.',
    ],
    tone: 'fixed',
  },
]

export const LATEST_VERSION = VERSION_HISTORY[0]

export const VERSION_TONE_LABELS = {
  new: 'Nuevo',
  improved: 'Mejorado',
  fixed: 'Corregido',
}

export const VERSION_TONE_STYLES = {
  new: 'bg-accent-soft text-accent-primary',
  improved: 'bg-success-soft text-success',
  fixed: 'bg-surface-muted text-text-cool',
}
