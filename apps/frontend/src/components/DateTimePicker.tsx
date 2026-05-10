import { useState, useRef, useEffect, useCallback } from 'react'
import { useI18n } from '../hooks/useI18n'

interface DateTimePickerProps {
  value: { date: string; time: string }
  onChange: (date: string, time: string) => void
  placeholder?: string
}

const MONTHS_ZH = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const WEEKDAYS_ZH = ['日','一','二','三','四','五','六']
const WEEKDAYS_EN = ['Su','Mo','Tu','We','Th','Fr','Sa']
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minsecs = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ScrollColumn({ values, selected, onChange, label }: { values: string[]; selected: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      const idx = values.indexOf(selected)
      if (idx >= 0) ref.current.scrollTop = idx * 32 - 48
    }
  }, [selected, values])

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-surface-500 mb-1">{label}</span>
      <div ref={ref} className="h-[196px] w-11 overflow-y-auto rounded-lg bg-surface-800/50">
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

type PickerView = 'days' | 'months' | 'years'

export default function DateTimePicker({ value, onChange, placeholder = 'YYYY-MM-DD HH:MM:SS' }: DateTimePickerProps) {
  const { locale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [pickerView, setPickerView] = useState<PickerView>('days')
  const ref = useRef<HTMLDivElement>(null)
  const now = new Date()
  const MONTHS = locale === 'zh' ? MONTHS_ZH : MONTHS_EN
  const WEEKDAYS = locale === 'zh' ? WEEKDAYS_ZH : WEEKDAYS_EN

  const selDate = value.date ? new Date(value.date + 'T00:00:00') : null
  const [viewYear, setViewYear] = useState(selDate?.getFullYear() ?? now.getFullYear())
  const [viewMonth, setViewMonth] = useState(selDate?.getMonth() ?? now.getMonth())

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

  const setTime = useCallback((hour: string, min: string, sec: string) => {
    onChange(value.date, `${hour}:${min}:${sec}`)
  }, [value.date, onChange])

  const handleNow = () => {
    const n = new Date()
    const d = fmt(n)
    const t = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`
    onChange(d, t)
    setViewYear(n.getFullYear())
    setViewMonth(n.getMonth())
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const days = daysInMonth(viewYear, viewMonth)
  const startDay = firstDayOfMonth(viewYear, viewMonth)
  const todayStr = fmt(now)
  const selStr = selDate ? fmt(selDate) : ''

  const yearPageStart = Math.floor(viewYear / 12) * 12
  const yearPageYears = Array.from({ length: 12 }, (_, i) => yearPageStart + i)

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
        <div className="absolute z-50 mt-1 rounded-xl border border-surface-700/50 bg-surface-900 backdrop-blur-xl shadow-xl shadow-black/20 p-4">
          <div className="flex gap-4">
            {/* Calendar */}
            <div className="w-[280px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={() => {
                  if (pickerView === 'days') prevMonth()
                  else if (pickerView === 'years') { const s = yearPageStart - 12; setViewYear(s > 1970 ? s : 1970) }
                }} className="h-8 w-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setPickerView(pickerView === 'days' ? 'months' : pickerView === 'months' ? 'years' : 'days')}
                  className="text-sm font-semibold text-surface-100 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-surface-800/50"
                >
                  {pickerView === 'years'
                    ? `${yearPageYears[0]} - ${yearPageYears[yearPageYears.length - 1]}`
                    : pickerView === 'months'
                      ? `${viewYear}`
                      : `${viewYear} ${MONTHS[viewMonth]}`
                  }
                </button>
                <button type="button" onClick={() => {
                  if (pickerView === 'days') nextMonth()
                  else if (pickerView === 'years') { setViewYear(yearPageStart + 12) }
                }} className="h-8 w-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>

              {/* Year picker */}
              {pickerView === 'years' && (
                <div className="grid grid-cols-3 gap-2">
                  {yearPageYears.map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => { setViewYear(y); setPickerView('months') }}
                      className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                        y === viewYear ? 'bg-indigo-600 text-white' :
                        y === now.getFullYear() ? 'ring-1 ring-indigo-500/50 text-indigo-400 hover:bg-surface-800' :
                        'text-surface-300 hover:bg-surface-800'
                      }`}
                    >{y}</button>
                  ))}
                </div>
              )}

              {/* Month picker */}
              {pickerView === 'months' && (
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((mn, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setViewMonth(i); setPickerView('days') }}
                      className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                        i === viewMonth ? 'bg-indigo-600 text-white' :
                        i === now.getMonth() && viewYear === now.getFullYear() ? 'ring-1 ring-indigo-500/50 text-indigo-400 hover:bg-surface-800' :
                        'text-surface-300 hover:bg-surface-800'
                      }`}
                    >{mn}</button>
                  ))}
                </div>
              )}

              {/* Day picker */}
              {pickerView === 'days' && (
                <>
                  <div className="grid grid-cols-7 mb-1">
                    {WEEKDAYS.map(d => (
                      <div key={d} className="h-9 flex items-center justify-center text-xs font-medium text-surface-500">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} className="h-9" />)}
                    {Array.from({ length: days }, (_, i) => {
                      const day = i + 1
                      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      const isSelected = dateStr === selStr
                      const isToday = dateStr === todayStr
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => onChange(dateStr, value.time || '00:00:00')}
                          className={`h-9 w-full flex items-center justify-center rounded-lg text-sm transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-semibold'
                              : isToday
                                ? 'ring-1 ring-indigo-500/50 text-indigo-400 font-semibold hover:bg-surface-800'
                                : 'text-surface-200 hover:bg-surface-800'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
            {/* Time */}
            <div className="border-l border-surface-700/50 pl-3 flex gap-1 items-start">
              <ScrollColumn values={hours} selected={h} onChange={(v) => setTime(v, m, s)} label="H" />
              <ScrollColumn values={minsecs} selected={m} onChange={(v) => setTime(h, v, s)} label="M" />
              <ScrollColumn values={minsecs} selected={s} onChange={(v) => setTime(h, m, v)} label="S" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleNow}
            className="mt-3 w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-1.5 rounded-lg hover:bg-surface-800/50"
          >
            {t('Now')}
          </button>
        </div>
      )}
    </div>
  )
}
