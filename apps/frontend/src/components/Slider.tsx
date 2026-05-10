interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label?: string
  showValue?: boolean
}

export default function Slider({ value, onChange, min, max, step = 1, label, showValue = true }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <label className="tool-label mb-0">{label}</label>}
          {showValue && (
            <span className="text-sm font-mono font-semibold text-indigo-400">{value}</span>
          )}
        </div>
      )}
      <div className="relative py-2">
        <div className="h-2 rounded-full bg-surface-700/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-500/30 pointer-events-none"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-surface-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
