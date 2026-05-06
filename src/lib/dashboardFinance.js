const amount = (row) => Number(row.amount) || 0

const sumAmounts = (rows) => rows.reduce((acc, row) => acc + amount(row), 0)

const isInRange = (date, start, end) => Boolean(date) && date >= start && date <= end

const isPaid = (income) => income.is_paid === true

const isPaidBefore = (income, date) => isPaid(income) && income.paid_date && income.paid_date < date

const isPaidBy = (income, date) => isPaid(income) && (!income.paid_date || income.paid_date <= date)

const isOpenBy = (income, date) => !isPaid(income) || (income.paid_date && income.paid_date > date)

const isCollectibleByMonth = (income, startOfMonth, endOfMonth, today) =>
  {
    const isCurrentMonth = today >= startOfMonth && today <= endOfMonth

    return Boolean(income.expected_date) &&
    (
      isInRange(income.expected_date, startOfMonth, endOfMonth) ||
      (isCurrentMonth && income.expected_date < startOfMonth && income.expected_date < today)
    ) &&
    !isPaidBefore(income, startOfMonth)
  }

const byDateAsc = (a, b) => (a ?? '9999-12-31').localeCompare(b ?? '9999-12-31')

export function getCashMonthSummary(incomes, { startOfMonth, endOfMonth, today }) {
  const planned = incomes.filter((income) => isCollectibleByMonth(income, startOfMonth, endOfMonth, today))
  const plannedPaid = planned.filter((income) => isPaidBy(income, endOfMonth))
  const unresolved = planned.filter((income) => isOpenBy(income, endOfMonth))
  const plannedPending = unresolved.filter((income) => income.expected_date >= today)
  const plannedOverdue = unresolved.filter((income) => income.expected_date < today)
  const paidByCashDate = incomes.filter((income) => isPaid(income) && isInRange(income.paid_date, startOfMonth, endOfMonth))
  const accumulatedOverdue = incomes.filter((income) => !isPaid(income) && income.expected_date && income.expected_date < startOfMonth && income.expected_date < today)
  const paidMissingDate = incomes.filter((income) => isPaid(income) && !income.paid_date)

  return {
    planned,
    plannedPaid,
    plannedPending,
    plannedOverdue,
    paidByCashDate,
    accumulatedOverdue,
    paidMissingDate,
    plannedTotal: sumAmounts(planned),
    plannedPaidTotal: sumAmounts(plannedPaid),
    plannedPendingTotal: sumAmounts(plannedPending),
    plannedOverdueTotal: sumAmounts(plannedOverdue),
    paidByCashDateTotal: sumAmounts(paidByCashDate),
    accumulatedOverdueTotal: sumAmounts(accumulatedOverdue),
    paidMissingDateCount: paidMissingDate.length,
  }
}

export function getReceivables(incomes, { from = null, until }) {
  return incomes
    .filter((income) =>
      !isPaid(income) &&
      income.expected_date &&
      (!from || income.expected_date >= from) &&
      income.expected_date <= until
    )
    .sort((a, b) => byDateAsc(a.expected_date, b.expected_date))
}

export function getWorkSummaries({ projects, events, incomes, startOfMonth, endOfMonth, today }) {
  const eventsById = new Map(events.map((event) => [event.id, event]))
  const projectsById = new Map(projects.map((project) => [project.id, project]))
  const eventsByProjectId = events.reduce((map, event) => {
    if (!event.project_id) return map
    const projectEvents = map.get(event.project_id) ?? []
    projectEvents.push(event)
    map.set(event.project_id, projectEvents)
    return map
  }, new Map())

  const buildWork = ({ id, type, name, client, status, color, path, eventIds = [] }) => {
    const childEventIds = new Set(eventIds)
    const workIncomes = incomes.filter((income) => {
      if (type === 'project') {
        return income.project_id === id || (income.event_id && childEventIds.has(income.event_id))
      }
      return income.event_id === id
    })
    const planned = workIncomes.filter((income) => isCollectibleByMonth(income, startOfMonth, endOfMonth, today))
    const plannedPaid = planned.filter((income) => isPaidBy(income, endOfMonth))
    const unresolved = planned.filter((income) => isOpenBy(income, endOfMonth))
    const plannedPending = unresolved.filter((income) => income.expected_date >= today)
    const overdue = unresolved.filter((income) => income.expected_date < today)
    const nextExpectedDate = workIncomes
      .filter((income) => !isPaid(income) && income.expected_date && income.expected_date >= today)
      .map((income) => income.expected_date)
      .sort(byDateAsc)[0] ?? null

    return {
      id,
      type,
      name,
      client,
      status,
      color,
      path,
      incomes: workIncomes,
      planned,
      totalExpected: sumAmounts(planned),
      paid: sumAmounts(plannedPaid),
      pending: sumAmounts(plannedPending),
      overdue: sumAmounts(overdue),
      debt: sumAmounts([...plannedPending, ...overdue]),
      pendingCount: plannedPending.length,
      overdueCount: overdue.length,
      nextExpectedDate,
    }
  }

  const projectWorks = projects.map((project) => {
    const projectEvents = eventsByProjectId.get(project.id) ?? []
    return buildWork({
      id: project.id,
      type: 'project',
      name: project.name,
      client: project.client || 'Sin cliente',
      status: project.status,
      color: project.color ?? '#4f98a3',
      path: `/projects/${project.id}`,
      eventIds: projectEvents.map((event) => event.id),
    })
  })

  const standaloneEventWorks = events
    .filter((event) => !event.project_id)
    .map((event) => buildWork({
      id: event.id,
      type: 'event',
      name: event.name,
      client: event.client || 'Sin cliente',
      status: event.status,
      color: event.color ?? '#4f98a3',
      path: `/events/${event.id}`,
    }))

  return [...projectWorks, ...standaloneEventWorks]
    .filter((work) => {
      const project = work.type === 'project' ? projectsById.get(work.id) : null
      const workEvent = work.type === 'event' ? eventsById.get(work.id) : null
      const projectEvents = work.type === 'project' ? (eventsByProjectId.get(work.id) ?? []) : []
      const projectActiveInMonth = project
        ? project.start_date <= endOfMonth && (project.end_date ?? project.start_date) >= startOfMonth
        : false
      const hasEventInMonth = [...projectEvents, workEvent].some((event) => {
        if (!event) return false
        const eventDate = event.start_datetime.slice(0, 10)
        return eventDate >= startOfMonth && eventDate <= endOfMonth
      })

      return projectActiveInMonth || hasEventInMonth || work.planned.length > 0 || work.overdue > 0 || work.paid > 0
    })
    .sort((a, b) => {
      const bucketDiff = getWorkSortBucket(a) - getWorkSortBucket(b)
      if (bucketDiff !== 0) return bucketDiff
      const dateDiff = byDateAsc(a.nextExpectedDate, b.nextExpectedDate)
      if (dateDiff !== 0) return dateDiff
      return a.name.localeCompare(b.name)
    })
}

export function getWorkKpis(works) {
  const withDebt = works.filter((work) => work.debt > 0)
  return {
    debtWorks: withDebt.length,
    pendingTotal: works.reduce((acc, work) => acc + work.pending, 0),
    overdueTotal: works.reduce((acc, work) => acc + work.overdue, 0),
    paidTotal: works.reduce((acc, work) => acc + work.paid, 0),
  }
}

export function getWorkSections(works, { endOfMonth }) {
  const sections = [
    {
      id: 'attention',
      title: 'Por perseguir',
      description: 'Pendientes o vencidos',
      works: works.filter((work) => work.debt > 0),
    },
    {
      id: 'future',
      title: 'Cobro futuro',
      description: 'Trabajo de este mes, cobro después',
      works: works.filter((work) =>
        work.debt === 0 &&
        work.paid === 0 &&
        work.nextExpectedDate &&
        work.nextExpectedDate > endOfMonth
      ),
    },
    {
      id: 'paid',
      title: 'Ya cobrados',
      description: 'Plan cerrado',
      works: works.filter((work) => work.debt === 0 && work.paid > 0),
    },
  ]

  const groupedIds = new Set(sections.flatMap((section) => section.works.map((work) => `${work.type}-${work.id}`)))
  const otherWorks = works.filter((work) => !groupedIds.has(`${work.type}-${work.id}`))

  if (otherWorks.length > 0) {
    sections.push({
      id: 'other',
      title: 'Otros trabajos',
      description: 'Sin cobro que revisar ahora',
      works: otherWorks,
    })
  }

  return sections.filter((section) => section.works.length > 0)
}

function getWorkSortBucket(work) {
  if (work.overdue > 0) return 0
  if (work.nextExpectedDate) return 1
  if (work.pending > 0) return 2
  return 3
}
