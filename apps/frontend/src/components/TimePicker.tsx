import { useState, useRef, useEffect } from 'react'

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TimePicker({ value, onChange, placeholder = 'HH:MM:SS' }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const parts = value ? value.split(':') : ['00', '00', '00']
  const hour = parts[0] || '00'
  const minute = parts[1] || '00'
  const second = parts[2] || '00'

  const update = (h: string, m: string, s: string) => {
    onChange(`${h}:${m}:${s}`)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minsecs = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl border border-surface-700/50 bg-surface-900/80 px-4 py-3 text-sm text-left transition-all hover:border-surface-600/50 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
      >
        <span className={value ? 'text-surface-100 font-mono' : 'text-surface-500'}>{value || placeholder}</span>
        <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-surface-700/50 bg-surface-900 backdrop-blur-xl shadow-xl shadow-black/20 p-4">
          <div className="flex gap-2 items-center">
            <Column values={hours} selected={hour} onChange={(v) => update(v, minute, second)} label="H" />
            <span className="text-surface-400 font-bold text-lg">:</span>
            <Column values={minsecs} selected={minute} onChange={(v) => update(hour, v, second)} label="M" />
            <span className="text-surface-400 font-bold text-lg">:</span>
            <Column values={minsecs} selected={second} onChange={(v) => update(hour, minute, v)} label="S" />
          </div>
          <button
            type="button"
            onClick={() => {
              const now = new Date()
              update(
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0'),
              )
            }}
            className="mt-3 w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Now
          </button>
        </div>
      )}
    </div>
  )
}

function Column({ values, selected, onChange, label }: { values: string[]; selected: string; onChange: (v: string) => void; label: string }) {
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
      <div ref={listRef} className="h-36 w-12 overflow-y-auto rounded-lg bg-surface-800/50 scrollbar-thin">
        {values.map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`w-full h-8 flex items-center justify-center text-sm font-mono transition-colors ${
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
