import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react'
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const fieldBaseClass = 'w-full rounded-lg border bg-white px-3 py-3 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500'
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, '0')
  const minutes = String((index % 4) * 15).padStart(2, '0')
  return `${hours}:${minutes}`
})

function FieldWrapper({ label, error, inputId, errorId, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
      {error && <p id={errorId} className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

function getFieldStateClass(error) {
  return error
    ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-gray-300 focus-visible:border-indigo-500'
}

function parseDateValue(value) {
  if (!value) return null
  const [year, month, day] = String(value).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const startDate = new Date(year, month, 1 - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date
  })
}

function DateInput({
  label,
  error,
  className = '',
  id,
  name,
  value,
  onChange,
  disabled,
  required,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const [isOpen, setIsOpen] = useState(false)
  const selectedDate = parseDateValue(value)
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date())
  const rootRef = useRef(null)
  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth])
  const todayValue = formatDateValue(new Date())
  const selectedValue = selectedDate ? formatDateValue(selectedDate) : ''

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const emitChange = (nextValue) => {
    onChange?.({
      target: { name, value: nextValue },
      currentTarget: { name, value: nextValue },
    })
  }

  const moveMonth = (amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  const selectDate = (date) => {
    emitChange(formatDateValue(date))
    setIsOpen(false)
  }

  const clearDate = () => {
    emitChange('')
    setIsOpen(false)
  }

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <div ref={rootRef} className="relative">
        <button
          id={inputId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required ? 'true' : undefined}
          aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
          disabled={disabled}
          onClick={() => {
            setVisibleMonth(selectedDate ?? new Date())
            setIsOpen((prev) => !prev)
          }}
          className={`${fieldBaseClass} flex min-h-12 items-center justify-between gap-3 pr-3 text-left text-base ${getFieldStateClass(error)} ${className}`}
          {...props}
        >
          <span className={`min-w-0 truncate ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
            {selectedDate ? dayFormatter.format(selectedDate) : 'dd/mm/aaaa'}
          </span>
          <CalendarDays size={18} className="shrink-0 text-gray-700" />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+0.375rem)] z-[90] w-full min-w-[20rem] max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-xl ring-1 ring-gray-950/5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                aria-label="Mes anterior"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ChevronLeft size={20} />
              </button>
              <p className="text-sm font-semibold text-gray-900 capitalize">{monthFormatter.format(visibleMonth)}</p>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                aria-label="Mes siguiente"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
              {weekDays.map((day) => <div key={day} className="py-1">{day}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {days.map((date) => {
                const dayValue = formatDateValue(date)
                const isSelected = dayValue === selectedValue
                const isToday = dayValue === todayValue
                const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth()
                return (
                  <button
                    key={dayValue}
                    type="button"
                    onClick={() => selectDate(date)}
                    className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'text-gray-800 hover:bg-indigo-50 hover:text-indigo-700'
                    } ${isOutsideMonth && !isSelected ? 'text-gray-400' : ''} ${isToday && !isSelected ? 'ring-1 ring-indigo-200' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <button type="button" onClick={clearDate} className="min-h-10 rounded-lg px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                Borrar
              </button>
              <button type="button" onClick={() => selectDate(new Date())} className="min-h-10 rounded-lg px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                Hoy
              </button>
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}

function splitDatetimeValue(value) {
  if (!value) return { date: '', time: '' }
  const [date = '', rawTime = ''] = String(value).split('T')
  return { date, time: rawTime.slice(0, 5) }
}

function DateTimeInput({
  label,
  error,
  className = '',
  id,
  name,
  value,
  onChange,
  disabled,
  required,
  defaultTime = '08:00',
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const { date, time } = splitDatetimeValue(value)
  const currentTimeOptions = time && !timeOptions.includes(time) ? [time, ...timeOptions] : timeOptions

  const emitChange = (nextDate, nextTime) => {
    const nextValue = nextDate ? `${nextDate}T${nextTime || defaultTime}` : ''
    onChange?.({
      target: { name, value: nextValue },
      currentTarget: { name, value: nextValue },
    })
  }

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <div
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-required={required ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem] ${className}`}
        {...props}
      >
        <DateInput
          id={`${inputId}-date`}
          name={name}
          value={date}
          onChange={(event) => emitChange(event.target.value, time)}
          disabled={disabled}
          required={required}
        />
        <Select
          id={`${inputId}-time`}
          value={time || defaultTime}
          onChange={(event) => emitChange(date, event.target.value)}
          disabled={disabled || !date}
        >
          {currentTimeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </div>
    </FieldWrapper>
  )
}

function TextInput({ label, error, className = '', id, type, 'aria-describedby': ariaDescribedBy, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`${fieldBaseClass} ${getFieldStateClass(error)} ${className}`}
        type={type}
        {...props}
      />
    </FieldWrapper>
  )
}

export function Input({ label, error, className = '', id, type, 'aria-describedby': ariaDescribedBy, ...props }) {
  if (type === 'date') {
    return (
      <DateInput
        label={label}
        error={error}
        className={className}
        id={id}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    )
  }

  if (type === 'datetime-local') {
    return (
      <DateTimeInput
        label={label}
        error={error}
        className={className}
        id={id}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    )
  }

  return (
    <TextInput
      label={label}
      error={error}
      className={className}
      id={id}
      type={type}
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  )
}

export function Select({
  label,
  error,
  children,
  className = '',
  id,
  name,
  value,
  onChange,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const listboxId = `${inputId}-listbox`
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const selectedOptionRef = useRef(null)
  const options = useMemo(() => Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const optionValue = child.props.value ?? child.props.children
      return {
        value: String(optionValue),
        label: child.props.children,
        disabled: child.props.disabled,
      }
    }), [children])
  const selectedOption = options.find((option) => option.value === String(value ?? '')) ?? options[0]

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      selectedOptionRef.current?.scrollIntoView({ block: 'center' })
    }
  }, [isOpen])

  const handleSelect = (nextValue) => {
    onChange?.({
      target: { name, value: nextValue },
      currentTarget: { name, value: nextValue },
    })
    setIsOpen(false)
  }

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <div ref={rootRef} className="relative">
        <button
          id={inputId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${fieldBaseClass} flex min-h-12 items-center justify-between gap-3 pr-3 text-left text-base ${getFieldStateClass(error)} ${className}`}
          {...props}
        >
          <span className="min-w-0 truncate">{selectedOption?.label}</span>
          <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={inputId}
            className="absolute right-0 top-[calc(100%+0.375rem)] z-[80] max-h-72 min-w-full w-max max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 text-base shadow-xl ring-1 ring-gray-950/5"
          >
            {options.map((option) => {
              const isSelected = option.value === String(value ?? '')
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  ref={isSelected ? selectedOptionRef : undefined}
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-gray-800 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <Check size={16} className={`shrink-0 ${isSelected ? 'text-indigo-600' : 'text-transparent'}`} />
                  <span className="min-w-0 flex-1 whitespace-nowrap">{option.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}

export function Textarea({ label, error, className = '', id, 'aria-describedby': ariaDescribedBy, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <FieldWrapper label={label} error={error} inputId={inputId} errorId={errorId}>
      <textarea
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={`${fieldBaseClass} min-h-24 resize-y ${getFieldStateClass(error)} ${className}`}
        rows={3}
        {...props}
      />
    </FieldWrapper>
  )
}
