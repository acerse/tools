import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'

interface DateTimePickerProps {
  value: { date: string; time: string }
  onChange: (date: string, time: string) => void
  placeholder?: string
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const startYear = 1970
const endYear = new Date().getFullYear() + 10
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minsecs = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function ScrollColumn({ values, selected, onChange, label }: { values: string[]; selected: string; onChange: (v: string) => void; label: string }) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      const idx = values.indexOf(selected)
      if (idx >= 0) listRef.current.scrollTop = idx * 32 - 48
    }
  }, [selected, values])

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-surface-500 mb-1">{label}</span>
      <div ref={listRef} className="h-[200px] w-11 overflow-y-auto rounded-lg bg-surface-800/50">
        {values.map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`w-full h-8 flex items-center justify-center text-xs font-mono transition-colors ${
              v === selected
                ? 'bg-indigo-600 text-white font-semibold rounded-md'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DateTimePicker({ value, onChange, placeholder = 'YYYY-MM-DD HH:MM:SS' }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedDate = value.date ? new Date(value.date + 'T00:00:00') : undefined
  const timeParts = (value.time || '00:00:00').split(':')
  const h = timeParts[0] || '00'
  const m = timeParts[1] || '00'
  const s = timeParts[2] || '00'

  const displayText = value.date ? `${value.date} ${value.time || '00:00:00'}` : ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const setTime = (hour: string, min: string, sec: string) => {
    onChange(value.date, `${hour}:${min}:${sec}`)
  }

  const handleNow = () => {
    const now = new Date()
    onChange(
      formatDate(now),
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl border border-surface-700/50 bg-surface-900/80 px-4 py-3 text-sm text-left transition-all hover:border-surface-600/50 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      >
        <span className={displayText ? 'text-surface-100 font-mono' : 'text-surface-500'}>
          {displayText || placeholder}
        </span>
        <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-surface-700/50 bg-surface-900 backdrop-blur-xl shadow-xl shadow-black/20 p-3">
          <style>{`
            .rdp-dropdown select {
              background: rgb(var(--s-900));
              color: rgb(var(--s-100));
              border: 1px solid rgb(var(--s-700) / 0.5);
              border-radius: 0.5rem;
              padding: 0.25rem 0.5rem;
              font-size: 0.8rem;
              font-weight: 600;
              outline: none;
              cursor: pointer;
            }
            .rdp-dropdown select:focus {
              border-color: rgb(99 102 241 / 0.7);
              box-shadow: 0 0 0 2px rgb(99 102 241 / 0.2);
            }
          `}</style>
          <div className="flex gap-3">
            <DayPicker
              mode="single"
              captionLayout="dropdown"
              startMonth={new Date(startYear, 0)}
              endMonth={new Date(endYear, 11)}
              selected={selectedDate}
              defaultMonth={selectedDate || new Date()}
              onSelect={(d) => {
                if (d) onChange(formatDate(d), value.time || '00:00:00')
              }}
              classNames={{
                root: 'text-surface-100 text-sm',
                months: 'flex flex-col',
                month_caption: 'flex justify-center items-center h-10 font-semibold text-surface-200',
                dropdowns: 'flex items-center justify-center gap-2',
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
            <div className="border-l border-surface-700/50 pl-3 flex gap-1 items-start pt-2">
              <ScrollColumn values={hours} selected={h} onChange={(v) => setTime(v, m, s)} label="H" />
              <ScrollColumn values={minsecs} selected={m} onChange={(v) => setTime(h, v, s)} label="M" />
              <ScrollColumn values={minsecs} selected={s} onChange={(v) => setTime(h, m, v)} label="S" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleNow}
            className="mt-2 w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-1.5 rounded-lg hover:bg-surface-800/50"
          >
            Now
          </button>
        </div>
      )}
    </div>
  )
}
