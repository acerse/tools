import { Checkbox as HeadlessCheckbox } from '@headlessui/react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded-md border-2 border-surface-600 bg-surface-900/80 transition-all duration-200 data-[checked]:border-indigo-500 data-[checked]:bg-indigo-600 group-hover:border-surface-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 flex items-center justify-center"
      >
        <svg
          className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-150 [[data-checked]_&]:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </HeadlessCheckbox>
      <span className="text-sm text-surface-300 group-hover:text-surface-200 transition-colors select-none">{label}</span>
    </label>
  )
}
