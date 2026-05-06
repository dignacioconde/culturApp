import { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  MONTH_LABELS,
  MONTH_SHORT_LABELS,
  getBusiestMonth,
  getNextProjectStart,
  getProjectTimelineRows,
  getProjectsByMonth,
  getProjectsForMonth,
} from '../../lib/projectYearCalendar'
import { formatDateRange } from '../../lib/formatters'
import { CalendarRange, FolderOpen } from 'lucide-react'

function getRangeLabel(project) {
  if (!project.endDate) {
    return `${dayjs(project.startDate).format('D MMM')} - sin fecha fin`
  }

  return formatDateRange(project.startDate, project.endDate)
}

function getVisibleRangeLabel(project) {
  if (project.visibleStart === project.visibleEnd) {
    return dayjs(project.visibleStart).format('D MMM')
  }

  return `${dayjs(project.visibleStart).format('D MMM')} - ${dayjs(project.visibleEnd).format('D MMM')}`
}

function getCompactDurationLabel(project) {
  const monthCount = project.endMonthIndex - project.startMonthIndex + 1

  if (monthCount <= 1) {
    return '1 mes activo'
  }

  return `${monthCount} meses activos`
}

export function ProjectYearSummary({ projects, year }) {
  const busiestMonth = useMemo(() => getBusiestMonth(projects, year), [projects, year])
  const nextProject = useMemo(() => {
    const nextStartFrom = dayjs().year() === year ? new Date() : `${year}-01-01`
    return getNextProjectStart(projects, nextStartFrom, { year })
  }, [projects, year])
  const activeCount = useMemo(() => getProjectTimelineRows(projects, year).length, [projects, year])

  return (
    <section className="rounded-2xl border border-[#E6DDC9] bg-[#FFFCF5] p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[#211C18]">
        <CalendarRange size={18} className="text-[#C94035]" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5C5149]">Resumen {year}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#EFE6D2] bg-white px-4 py-3">
          <p className="text-2xl font-semibold text-[#211C18]">{activeCount}</p>
          <p className="text-xs text-[#6F6258]">proyectos activos</p>
        </div>
        <div className="rounded-xl border border-[#EFE6D2] bg-white px-4 py-3">
          <p className="truncate text-lg font-semibold text-[#211C18]">
            {busiestMonth ? busiestMonth.monthLabel : 'Sin carga'}
          </p>
          <p className="text-xs text-[#6F6258]">
            {busiestMonth ? `${busiestMonth.projects.length} proyectos` : 'No hay proyectos este año'}
          </p>
        </div>
        <div className="rounded-xl border border-[#EFE6D2] bg-white px-4 py-3">
          <p className="truncate text-lg font-semibold text-[#211C18]">
            {nextProject ? nextProject.title : 'Sin próximos inicios'}
          </p>
          <p className="text-xs text-[#6F6258]">
            {nextProject ? `Próximo inicio · ${dayjs(nextProject.startDate).format('D MMM')}` : 'Añade un proyecto para planificar'}
          </p>
        </div>
      </div>
    </section>
  )
}

function ProjectMobileGanttCard({ project, maxMonthLoad, monthLoads, onSelectProject }) {
  return (
    <button
      type="button"
      onClick={() => onSelectProject(project.source)}
      className="w-full rounded-2xl border border-[#E2D9C2] bg-white p-4 text-left shadow-sm transition hover:border-[#D7C6A9] hover:bg-[#FFFCF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2"
      aria-label={`Abrir ${project.title}: ${getRangeLabel(project)}`}
    >
      <span className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-[#211C18]">{project.title}</span>
          <span className="block text-sm text-[#6F6258]">{getRangeLabel(project)}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[#F5EFE0] px-2.5 py-1 text-xs font-semibold text-[#5C5149]">
          {getCompactDurationLabel(project)}
        </span>
      </span>

      <span className="grid grid-cols-12 gap-1 text-center text-[10px] font-semibold text-[#8B7A6B]" aria-hidden="true">
        {MONTH_SHORT_LABELS.map((month, index) => (
          <span
            key={`${project.id}-${month}-label`}
            className={`rounded-md py-1 ${monthLoads[index] === maxMonthLoad && maxMonthLoad > 1 ? 'bg-[#FBE8E6] text-[#A8342B]' : ''}`}
          >
            {month.slice(0, 1)}
          </span>
        ))}
      </span>

      <span className="mt-1 grid grid-cols-12 gap-1" aria-hidden="true">
        {MONTH_SHORT_LABELS.map((month, index) => {
          const isActive = index >= project.startMonthIndex && index <= project.endMonthIndex
          const isEdge = index === project.startMonthIndex || index === project.endMonthIndex

          return (
            <span
              key={`${project.id}-${month}-segment`}
              className={`h-8 rounded-lg border transition ${
                isActive
                  ? 'border-transparent shadow-sm'
                  : 'border-[#EFE6D2] bg-[#FAF6EC]'
              } ${isEdge ? 'ring-1 ring-[#211C18]/20' : ''}`}
              style={isActive ? { backgroundColor: project.color } : undefined}
            />
          )
        })}
      </span>

      <span className="mt-2 flex items-center justify-between text-xs text-[#6F6258]">
        <span>
          Inicio · {MONTH_LABELS[project.startMonthIndex].slice(0, 3)}
        </span>
        <span>
          Fin · {MONTH_LABELS[project.endMonthIndex].slice(0, 3)}
        </span>
      </span>
    </button>
  )
}

export function ProjectMobileCompactGantt({ projects, year, onSelectProject }) {
  const rows = useMemo(() => getProjectTimelineRows(projects, year), [projects, year])
  const months = useMemo(() => getProjectsByMonth(projects, year), [projects, year])
  const monthLoads = months.map((month) => month.projects.length)
  const maxMonthLoad = Math.max(0, ...monthLoads)
  const busiestMonths = months.filter((month) => month.projects.length === maxMonthLoad && maxMonthLoad > 0)

  if (rows.length === 0) {
    return null
  }

  return (
    <section className="space-y-3 md:hidden" aria-label={`Gantt compacto de proyectos ${year}`}>
      <div className="rounded-2xl border border-[#E2D9C2] bg-[#FFFCF5] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6F6258]">Timeline anual</p>
        <h2 className="mt-1 text-lg font-semibold text-[#211C18]">Gantt compacto</h2>
        <p className="mt-1 text-sm text-[#6F6258]">
          Cada tarjeta resume 12 meses. Meses más cargados: {busiestMonths.map((month) => month.monthLabel).join(', ')}.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((project) => (
          <ProjectMobileGanttCard
            key={project.id}
            project={project}
            maxMonthLoad={maxMonthLoad}
            monthLoads={monthLoads}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectTimelineSegment({ project, onSelectProject }) {
  const gridColumn = `${project.startMonthIndex + 1} / ${project.endMonthIndex + 2}`
  const title = `${project.title}: ${getRangeLabel(project)}`

  return (
    <button
      type="button"
      onClick={() => onSelectProject(project.source)}
      className="group pointer-events-auto relative z-10 my-1 min-h-9 overflow-hidden rounded-full px-3 text-left text-xs font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] focus-visible:ring-offset-2"
      style={{ gridColumn, backgroundColor: project.color }}
      title={title}
    >
      <span className="flex min-w-0 items-center gap-2">
        {project.startsBeforeYear && <span aria-hidden="true">...</span>}
        <span className="truncate">{project.title}</span>
        <span className="hidden shrink-0 text-[10px] font-medium opacity-85 md:inline">
          {getVisibleRangeLabel(project)}
        </span>
        {project.endsAfterYear && <span aria-hidden="true">...</span>}
      </span>
    </button>
  )
}

export function ProjectYearTimeline({ projects, year, selectedMonth, onSelectMonth, onSelectProject }) {
  const rows = useMemo(() => getProjectTimelineRows(projects, year), [projects, year])

  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[#E2D9C2] bg-white px-5 py-8 text-center">
        <FolderOpen className="mx-auto mb-3 text-[#B9A995]" size={28} />
        <p className="font-medium text-[#211C18]">No hay proyectos activos en {year}</p>
        <p className="mt-1 text-sm text-[#6F6258]">Cambia de año o crea el primer proyecto para verlo en la planificación.</p>
      </section>
    )
  }

  return (
    <section className="hidden rounded-2xl border border-[#E2D9C2] bg-white p-4 shadow-sm md:block">
      <div className="grid grid-cols-[minmax(12rem,18rem)_1fr] gap-4">
        <div className="border-b border-[#EFE6D2] pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6F6258]">
          Proyecto
        </div>
        <div className="grid grid-cols-12 gap-1 border-b border-[#EFE6D2] pb-3">
          {MONTH_SHORT_LABELS.map((month, index) => (
            <button
              key={month}
              type="button"
              onClick={() => onSelectMonth(index)}
              className={`rounded-lg px-1 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] ${
                selectedMonth === index
                  ? 'bg-[#C94035] text-white shadow-sm'
                  : 'text-[#6F6258] hover:bg-[#F5EFE0] hover:text-[#211C18]'
              }`}
              aria-pressed={selectedMonth === index}
            >
              {month}
            </button>
          ))}
        </div>

        {rows.map((project) => (
          <div key={project.id} className="contents">
            <button
              type="button"
              onClick={() => onSelectProject(project.source)}
              className="min-w-0 border-b border-[#F3EBDD] py-3 pr-2 text-left transition hover:text-[#C94035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035]"
              title={project.title}
            >
              <span className="block truncate text-sm font-semibold text-[#211C18]">{project.title}</span>
              <span className="block truncate text-xs text-[#6F6258]">{getRangeLabel(project)}</span>
            </button>
            <div className="relative grid grid-cols-12 gap-1 border-b border-[#F3EBDD] py-3">
              {MONTH_SHORT_LABELS.map((month, index) => (
                <button
                  key={`${project.id}-${month}`}
                  type="button"
                  onClick={() => onSelectMonth(index)}
                  className={`min-h-9 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035] ${
                    selectedMonth === index ? 'bg-[#FBE8E6]' : 'bg-[#FAF6EC]'
                  }`}
                  aria-label={`Seleccionar ${MONTH_LABELS[index]} ${year}`}
                />
              ))}
              <div className="pointer-events-none absolute inset-x-0 top-3 grid grid-cols-12 gap-1 px-0">
                <ProjectTimelineSegment project={project} onSelectProject={onSelectProject} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProjectMonthProjectList({ projects, onSelectProject }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2D9C2] bg-[#FFFCF5] px-4 py-6 text-sm text-[#6F6258]">
        No hay proyectos activos en este mes.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => onSelectProject(project.source)}
          className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#EFE6D2] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#E2D9C2] hover:bg-[#FFFCF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035]"
        >
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#211C18]">{project.title}</span>
            <span className="block text-xs text-[#6F6258]">{getRangeLabel(project)}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

export function ProjectMonthDetail({ projects, year, selectedMonth, onSelectProject }) {
  const monthProjects = useMemo(
    () => getProjectsForMonth(projects, year, selectedMonth),
    [projects, selectedMonth, year]
  )

  return (
    <section className="hidden rounded-2xl border border-[#E2D9C2] bg-[#FFFCF5] p-4 shadow-sm md:block">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6F6258]">Detalle mensual</p>
        <h2 className="mt-1 text-xl font-semibold text-[#211C18]">
          {MONTH_LABELS[selectedMonth]} {year}
        </h2>
        <p className="text-sm text-[#6F6258]">Proyectos activos</p>
      </div>
      <ProjectMonthProjectList projects={monthProjects} onSelectProject={onSelectProject} />
    </section>
  )
}

function ProjectMonthCard({ month, isSelected, onSelectMonth, onSelectProject }) {
  const visibleProjects = month.projects.slice(0, 3)
  const hiddenCount = month.projects.length - visibleProjects.length

  return (
    <article className={`rounded-2xl border bg-white shadow-sm transition ${isSelected ? 'border-[#C94035]' : 'border-[#E2D9C2]'}`}>
      <button
        type="button"
        onClick={() => onSelectMonth(month.monthIndex)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94035]"
        aria-expanded={isSelected}
      >
        <span>
          <span className="block text-base font-semibold text-[#211C18]">{month.monthLabel}</span>
          <span className="text-sm text-[#6F6258]">
            {month.projects.length === 1 ? '1 proyecto' : `${month.projects.length} proyectos`}
          </span>
        </span>
        <span className={`h-3 w-3 rounded-full ${isSelected ? 'bg-[#C94035]' : 'bg-[#E2D9C2]'}`} />
      </button>

      {visibleProjects.length > 0 && !isSelected && (
        <div className="border-t border-[#F3EBDD] px-4 pb-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {visibleProjects.map((project) => (
              <span key={project.id} className="max-w-full truncate rounded-full bg-[#F5EFE0] px-2.5 py-1 text-xs font-medium text-[#5C5149]">
                {project.title}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="rounded-full bg-[#EFE6D2] px-2.5 py-1 text-xs font-semibold text-[#5C5149]">+{hiddenCount} más</span>
            )}
          </div>
        </div>
      )}

      {isSelected && (
        <div className="border-t border-[#F3EBDD] px-4 pb-4 pt-3">
          <ProjectMonthProjectList projects={month.projects} onSelectProject={onSelectProject} />
        </div>
      )}
    </article>
  )
}

export function ProjectMobileYearList({ projects, year, selectedMonth, onSelectMonth, onSelectProject }) {
  const months = useMemo(() => getProjectsByMonth(projects, year), [projects, year])

  return (
    <section className="space-y-3 md:hidden" aria-label={`Planificación de proyectos ${year}`}>
      {months.map((month) => (
        <ProjectMonthCard
          key={month.monthIndex}
          month={month}
          isSelected={selectedMonth === month.monthIndex}
          onSelectMonth={onSelectMonth}
          onSelectProject={onSelectProject}
        />
      ))}
    </section>
  )
}

export function ProjectYearView({ projects, year, selectedMonth, onSelectMonth, onSelectProject }) {
  return (
    <div className="space-y-4">
      <ProjectYearSummary projects={projects} year={year} />
      <ProjectYearTimeline
        projects={projects}
        year={year}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
        onSelectProject={onSelectProject}
      />
      <ProjectMobileCompactGantt
        projects={projects}
        year={year}
        onSelectProject={onSelectProject}
      />
      <ProjectMobileYearList
        projects={projects}
        year={year}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
        onSelectProject={onSelectProject}
      />
      <ProjectMonthDetail
        projects={projects}
        year={year}
        selectedMonth={selectedMonth}
        onSelectProject={onSelectProject}
      />
    </div>
  )
}
