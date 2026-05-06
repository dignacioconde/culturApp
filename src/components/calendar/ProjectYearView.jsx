import { useMemo } from 'react'
import dayjs from 'dayjs'
import { buildProjectYearMonths } from '../../lib/projectYearCalendar'

const COLUMN_WIDTH = 100 / 7
const LANE_HEIGHT = 18
const LANE_GAP = 4

function getSegmentStyle(segment) {
  const borderRadius = segment.startsInCell && segment.endsInCell
    ? '999px'
    : segment.startsInCell
    ? '999px 6px 6px 999px'
    : segment.endsInCell
    ? '6px 999px 999px 6px'
    : '6px'

  return {
    left: `calc(${segment.startColumn * COLUMN_WIDTH}% + 2px)`,
    width: `calc(${segment.span * COLUMN_WIDTH}% - 4px)`,
    top: `${segment.lane * (LANE_HEIGHT + LANE_GAP)}px`,
    height: `${LANE_HEIGHT}px`,
    backgroundColor: segment.color,
    borderRadius,
  }
}

function getWeekSegmentsHeight(week) {
  if (week.segments.length === 0) {
    return 0
  }

  const laneCount = Math.max(...week.segments.map((segment) => segment.lane)) + 1
  return laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP
}

export function ProjectYearView({ date, projects, onSelectProject }) {
  const year = dayjs(date).year()
  const months = useMemo(() => buildProjectYearMonths(projects, year), [projects, year])

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {months.map((month) => (
        <section key={month.monthStart} className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <header className="border-b border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-sm font-semibold text-gray-800">
              {month.monthLabel} {month.year}
            </p>
          </header>

          <div className="p-2">
            <div className="mb-1 grid grid-cols-7 gap-px text-center">
              {month.weeks[0]?.days.map((day) => (
                <div key={`${month.monthStart}-${day.weekdayLabel}`} className="pb-1 text-[10px] font-medium text-gray-400">
                  {day.weekdayLabel}
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              {month.weeks.map((week) => {
                const segmentsHeight = getWeekSegmentsHeight(week)

                return (
                  <div key={week.weekId} className="rounded-lg border border-gray-100 bg-white">
                    <div className="grid grid-cols-7 gap-px rounded-t-lg bg-gray-100">
                      {week.days.map((day) => (
                        <div
                          key={day.date}
                          className={`min-h-[2rem] px-1 py-1 text-center text-[10px] font-medium ${
                            day.isCurrentMonth ? 'bg-white text-gray-700' : 'bg-gray-50 text-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                              day.isToday ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]' : ''
                            }`}
                          >
                            {day.dayOfMonth}
                          </span>
                        </div>
                      ))}
                    </div>

                    {segmentsHeight > 0 && (
                      <div className="relative px-1 pb-1 pt-1" style={{ height: `${segmentsHeight + 8}px` }}>
                        {week.segments.map((segment) => (
                          <button
                            key={`${segment.projectId}-${segment.weekId}-${segment.lane}`}
                            type="button"
                            onClick={() => onSelectProject(segment.source)}
                            className="absolute overflow-hidden text-ellipsis whitespace-nowrap px-2 text-left text-[10px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                            style={getSegmentStyle(segment)}
                            title={`${segment.title}: ${segment.visibleStart} - ${segment.visibleEnd}`}
                          >
                            {segment.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
