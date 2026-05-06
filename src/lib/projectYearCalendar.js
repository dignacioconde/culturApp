import dayjs from 'dayjs'

export const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const MONTH_SHORT_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function formatIsoDate(value) {
  return dayjs(value).format('YYYY-MM-DD')
}

export function normalizeDate(value) {
  if (!value) {
    return dayjs('')
  }

  if (typeof value === 'string' && value.length >= 10) {
    return dayjs(value.slice(0, 10)).startOf('day')
  }

  return dayjs(value).startOf('day')
}

function getProjectTitle(project) {
  return project.name ?? project.title ?? 'Proyecto sin nombre'
}

function getProjectEnd(project) {
  return project.end_date ?? project.end ?? project.start_date ?? project.start
}

export function normalizeProject(project) {
  const start = normalizeDate(project.start_date ?? project.start)
  const rawEnd = project.end_date ?? project.end
  const end = normalizeDate(getProjectEnd(project))

  if (!start.isValid() || !end.isValid()) {
    return null
  }

  return {
    id: project.id,
    title: getProjectTitle(project),
    color: project.color ?? '#4f98a3',
    start,
    end: end.isBefore(start, 'day') ? start : end,
    hasExplicitEnd: Boolean(rawEnd),
    raw: project,
  }
}

function overlapsMonth(project, monthStart, monthEnd) {
  return !project.end.isBefore(monthStart, 'day') && !project.start.isAfter(monthEnd, 'day')
}

function sortNormalizedProjects(projects) {
  return [...projects].sort((left, right) => {
    if (!left.start.isSame(right.start, 'day')) {
      return left.start.valueOf() - right.start.valueOf()
    }

    if (!left.end.isSame(right.end, 'day')) {
      return left.end.valueOf() - right.end.valueOf()
    }

    return left.title.localeCompare(right.title, 'es')
  })
}

export function getProjectActiveMonths(project, year) {
  const normalized = normalizeProject(project)

  if (!normalized) {
    return []
  }

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`).startOf('day')
    const monthEnd = monthStart.endOf('month').startOf('day')
    return overlapsMonth(normalized, monthStart, monthEnd) ? monthIndex : null
  }).filter((monthIndex) => monthIndex !== null)
}

export function getProjectsForMonth(projects, year, monthIndex) {
  const monthStart = dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`).startOf('day')
  const monthEnd = monthStart.endOf('month').startOf('day')

  return sortNormalizedProjects(
    projects
      .map(normalizeProject)
      .filter(Boolean)
      .filter((project) => overlapsMonth(project, monthStart, monthEnd))
  ).map((project) => ({
    id: project.id,
    title: project.title,
    color: project.color,
    startDate: formatIsoDate(project.start),
    endDate: project.hasExplicitEnd ? formatIsoDate(project.end) : null,
    visibleStart: formatIsoDate(project.start.isBefore(monthStart, 'day') ? monthStart : project.start),
    visibleEnd: formatIsoDate(project.end.isAfter(monthEnd, 'day') ? monthEnd : project.end),
    startsBeforeMonth: project.start.isBefore(monthStart, 'day'),
    endsAfterMonth: project.end.isAfter(monthEnd, 'day'),
    source: project.raw,
  }))
}

export function getProjectsByMonth(projects, year) {
  return Array.from({ length: 12 }, (_, monthIndex) => ({
    monthIndex,
    monthNumber: monthIndex + 1,
    monthLabel: MONTH_LABELS[monthIndex],
    monthShortLabel: MONTH_SHORT_LABELS[monthIndex],
    projects: getProjectsForMonth(projects, year, monthIndex),
  }))
}

export function clampProjectRangeToYear(project, year) {
  const normalized = normalizeProject(project)

  if (!normalized) {
    return null
  }

  const yearStart = dayjs(`${year}-01-01`).startOf('day')
  const yearEnd = dayjs(`${year}-12-31`).startOf('day')

  if (normalized.end.isBefore(yearStart, 'day') || normalized.start.isAfter(yearEnd, 'day')) {
    return null
  }

  const visibleStart = normalized.start.isBefore(yearStart, 'day') ? yearStart : normalized.start
  const visibleEnd = normalized.end.isAfter(yearEnd, 'day') ? yearEnd : normalized.end

  return {
    id: normalized.id,
    title: normalized.title,
    color: normalized.color,
    startDate: formatIsoDate(normalized.start),
    endDate: normalized.hasExplicitEnd ? formatIsoDate(normalized.end) : null,
    visibleStart: formatIsoDate(visibleStart),
    visibleEnd: formatIsoDate(visibleEnd),
    startMonthIndex: visibleStart.month(),
    endMonthIndex: visibleEnd.month(),
    startsBeforeYear: normalized.start.isBefore(yearStart, 'day'),
    endsAfterYear: normalized.end.isAfter(yearEnd, 'day'),
    source: normalized.raw,
  }
}

export function getProjectTimelineRows(projects, year) {
  return sortNormalizedProjects(projects.map(normalizeProject).filter(Boolean))
    .map((project) => clampProjectRangeToYear(project.raw, year))
    .filter(Boolean)
}

export function getBusiestMonth(projects, year) {
  const months = getProjectsByMonth(projects, year)
  const busiest = months.reduce((current, month) => {
    if (month.projects.length > current.projects.length) {
      return month
    }

    return current
  }, months[0])

  return busiest.projects.length > 0 ? busiest : null
}

export function getNextProjectStart(projects, fromDate = new Date(), options = {}) {
  const from = normalizeDate(fromDate)

  if (!from.isValid()) {
    return null
  }

  const upcoming = sortNormalizedProjects(
    projects
      .map(normalizeProject)
      .filter(Boolean)
      .filter((project) => options.year === undefined || project.start.year() === options.year)
      .filter((project) => !project.start.isBefore(from, 'day'))
  )

  if (upcoming.length === 0) {
    return null
  }

  const [project] = upcoming

  return {
    id: project.id,
    title: project.title,
    startDate: formatIsoDate(project.start),
    source: project.raw,
  }
}

export function getDefaultSelectedMonth(projects, year, todayValue = new Date()) {
  const today = normalizeDate(todayValue)

  if (today.isValid() && today.year() === year) {
    return today.month()
  }

  const firstActiveMonth = getProjectsByMonth(projects, year).find((month) => month.projects.length > 0)
  return firstActiveMonth?.monthIndex ?? 0
}
