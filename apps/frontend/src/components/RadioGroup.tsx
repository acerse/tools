import { RadioGroup as HeadlessRadioGroup, Radio } from '@headlessui/react'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
}

export default function RadioGroup({ value, onChange, options }: RadioGroupProps) {
  return (
    <HeadlessRadioGroup value={value} onChange={onChange} className="flex flex-wrap gap-2">
      {options.map(opt => (
        <Radio
          key={opt.value}
          value={opt.value}
          className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 data-[checked]:bg-indigo-600/15 data-[checked]:text-indigo-400 data-[checked]:border-indigo-500/30 bg-surface-900/50 text-surface-400 border-surface-700/50 hover:bg-surface-800/50 hover:text-surface-200"
        >
          {opt.label}
        </Radio>
      ))}
    </HeadlessRadioGroup>
  )
}
