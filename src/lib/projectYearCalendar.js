import dayjs from 'dayjs'

const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function formatIsoDate(value) {
  return dayjs(value).format('YYYY-MM-DD')
}

function getWeekId(date) {
  return formatIsoDate(date.startOf('week'))
}

function getProjectTitle(project) {
  return project.name ?? project.title ?? 'Proyecto sin nombre'
}

function getProjectEnd(project) {
  return project.end_date ?? project.start_date ?? project.end ?? project.start
}

function normalizeProject(project) {
  const start = dayjs(project.start_date ?? project.start)
  const end = dayjs(getProjectEnd(project))

  if (!start.isValid() || !end.isValid()) {
    return null
  }

  return {
    id: project.id,
    title: getProjectTitle(project),
    color: project.color ?? '#4f98a3',
    start,
    end: end.isBefore(start, 'day') ? start : end,
    raw: project,
  }
}

function getVisibleWeeks(monthStart, monthEnd, today) {
  const firstWeekStart = monthStart.startOf('month').startOf('week')
  const lastWeekEnd = monthEnd.endOf('month').endOf('week')
  const weeks = []

  let current = firstWeekStart
  let weekIndex = 0

  while (current.isBefore(lastWeekEnd, 'day') || current.isSame(lastWeekEnd, 'day')) {
    const weekStart = current
    const weekEnd = current.endOf('week')

    weeks.push({
      weekId: getWeekId(weekStart),
      weekIndex,
      start: formatIsoDate(weekStart),
      end: formatIsoDate(weekEnd),
      days: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = weekStart.add(dayIndex, 'day')
        return {
          date: formatIsoDate(date),
          dayOfMonth: date.date(),
          weekdayLabel: WEEKDAY_LABELS[dayIndex],
          isCurrentMonth: date.month() === monthStart.month(),
          isToday: date.isSame(today, 'day'),
        }
      }),
    })

    current = current.add(1, 'week')
    weekIndex += 1
  }

  return weeks
}

function maxDay(...dates) {
  return dates.reduce((currentMax, candidate) => candidate.isAfter(currentMax, 'day') ? candidate : currentMax)
}

function minDay(...dates) {
  return dates.reduce((currentMin, candidate) => candidate.isBefore(currentMin, 'day') ? candidate : currentMin)
}

function buildWeekSegment(project, week, monthStart, monthEnd) {
  const weekStart = dayjs(week.start)
  const weekEnd = dayjs(week.end)
  const visibleStart = maxDay(project.start, weekStart, monthStart)
  const visibleEnd = minDay(project.end, weekEnd, monthEnd)

  if (visibleEnd.isBefore(visibleStart, 'day')) {
    return null
  }

  return {
    projectId: project.id,
    title: project.title,
    color: project.color,
    weekId: week.weekId,
    weekIndex: week.weekIndex,
    visibleStart: formatIsoDate(visibleStart),
    visibleEnd: formatIsoDate(visibleEnd),
    startColumn: visibleStart.day(),
    endColumn: visibleEnd.day(),
    span: visibleEnd.diff(visibleStart, 'day') + 1,
    startsInCell: visibleStart.isSame(project.start, 'day'),
    endsInCell: visibleEnd.isSame(project.end, 'day'),
    source: project.raw,
  }
}

function assignLanes(segments) {
  const lanes = []

  return segments.map((segment) => {
    let lane = 0

    while (lanes[lane] !== undefined && lanes[lane] >= segment.startColumn) {
      lane += 1
    }

    lanes[lane] = segment.endColumn

    return {
      ...segment,
      lane,
    }
  })
}

function sortSegments(segments) {
  return [...segments].sort((left, right) => {
    if (left.startColumn !== right.startColumn) {
      return left.startColumn - right.startColumn
    }

    if (left.span !== right.span) {
      return right.span - left.span
    }

    return left.title.localeCompare(right.title, 'es')
  })
}

export function getProjectMonthSegments(project, monthStartValue, monthEndValue) {
  const normalizedProject = normalizeProject(project)
  const monthStart = dayjs(monthStartValue).startOf('day')
  const monthEnd = dayjs(monthEndValue).startOf('day')

  if (!normalizedProject || monthEnd.isBefore(monthStart, 'day')) {
    return []
  }

  if (normalizedProject.end.isBefore(monthStart, 'day') || normalizedProject.start.isAfter(monthEnd, 'day')) {
    return []
  }

  const visibleWeeks = getVisibleWeeks(monthStart, monthEnd, dayjs())

  return visibleWeeks
    .map((week) => buildWeekSegment(normalizedProject, week, monthStart, monthEnd))
    .filter(Boolean)
}

export function buildProjectYearMonths(projects, year, options = {}) {
  const today = dayjs(options.today ?? new Date()).startOf('day')
  const normalizedProjects = projects.map(normalizeProject).filter(Boolean)

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`).startOf('day')
    const monthEnd = monthStart.endOf('month').startOf('day')
    const weeks = getVisibleWeeks(monthStart, monthEnd, today)

    const segments = sortSegments(
      normalizedProjects.flatMap((project) => getProjectMonthSegments(project.raw, monthStart, monthEnd))
    )

    const segmentsByWeekId = new Map(
      weeks.map((week) => [
        week.weekId,
        assignLanes(segments.filter((segment) => segment.weekId === week.weekId)),
      ])
    )

    return {
      monthIndex,
      monthNumber: monthIndex + 1,
      monthLabel: MONTH_LABELS[monthIndex],
      year,
      monthStart: formatIsoDate(monthStart),
      monthEnd: formatIsoDate(monthEnd),
      weeks: weeks.map((week) => ({
        ...week,
        segments: segmentsByWeekId.get(week.weekId) ?? [],
      })),
    }
  })
}
