import { useState } from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const [focused, setFocused] = useState(false)

  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          checked
            ? 'border-indigo-500 bg-indigo-600'
            : 'border-surface-600 bg-surface-900/80 group-hover:border-surface-500'
        } ${focused ? 'ring-2 ring-indigo-500/20' : ''}`}
      >
        {checked && (
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </button>
      <span className="text-sm text-surface-300 group-hover:text-surface-200 transition-colors">{label}</span>
    </label>
  )
}
