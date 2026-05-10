import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function DatePicker({ value, onChange, placeholder = 'YYYY-MM-DD' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = value ? new Date(value + 'T00:00:00') : undefined

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl border border-surface-700/50 bg-surface-900/80 px-4 py-3 text-sm text-left transition-all hover:border-surface-600/50 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      >
        <span className={value ? 'text-surface-100' : 'text-surface-500'}>{value || placeholder}</span>
        <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-surface-700/50 bg-surface-900 backdrop-blur-xl shadow-xl shadow-black/20 p-3">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) {
                onChange(formatDate(d))
                setOpen(false)
              }
            }}
            classNames={{
              root: 'text-surface-100 text-sm',
              months: 'flex flex-col',
              month_caption: 'flex justify-center items-center h-10 font-semibold text-surface-200',
              nav: 'flex items-center justify-between absolute top-3 left-3 right-3',
              button_previous: 'h-7 w-7 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors',
              button_next: 'h-7 w-7 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors',
              weekdays: 'flex',
              weekday: 'w-9 h-9 flex items-center justify-center text-xs font-medium text-surface-500',
              week: 'flex',
              day: 'w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors hover:bg-surface-800 cursor-pointer',
              day_button: 'w-full h-full flex items-center justify-center rounded-lg',
              selected: 'bg-indigo-600 text-white hover:bg-indigo-500 font-semibold',
              today: 'ring-1 ring-indigo-500/50 font-semibold text-indigo-400',
              outside: 'text-surface-600 opacity-50',
              disabled: 'text-surface-700 cursor-not-allowed',
            }}
          />
        </div>
      )}
    </div>
  )
}
