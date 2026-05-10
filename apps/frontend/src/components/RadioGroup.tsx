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
    <HeadlessRadioGroup value={value} onChange={onChange} className="inline-flex rounded-xl border border-surface-700/50 overflow-hidden">
      {options.map(opt => (
        <Radio
          key={opt.value}
          value={opt.value}
          className="cursor-pointer px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none text-center whitespace-nowrap data-[checked]:bg-indigo-600 data-[checked]:text-white data-[checked]:shadow-md data-[checked]:shadow-indigo-500/30 bg-surface-900/50 text-surface-400 hover:bg-surface-800/50 hover:text-surface-200"
        >
          {opt.label}
        </Radio>
      ))}
    </HeadlessRadioGroup>
  )
}
