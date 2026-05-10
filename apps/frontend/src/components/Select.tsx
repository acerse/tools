import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

export default function Select({ value, onChange, options, className = '' }: SelectProps) {
  const selected = options.find(o => o.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <ListboxButton className="w-full flex items-center justify-between rounded-xl border border-surface-700/50 bg-surface-900/80 px-4 py-3 text-left text-sm text-surface-100 transition-all hover:border-surface-600/50 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none">
          <span>{selected?.label || value}</span>
          <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-50 mt-1 w-full rounded-xl border border-surface-700/50 bg-surface-900 backdrop-blur-xl shadow-xl shadow-black/20 py-1 max-h-60 overflow-auto focus:outline-none">
            {options.map(opt => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className={({ active, selected: sel }) =>
                  `cursor-pointer px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                    sel ? 'bg-indigo-500/15 text-indigo-400' :
                    active ? 'bg-surface-800/60 text-surface-100' :
                    'text-surface-300'
                  }`
                }
              >
                {({ selected: sel }) => (
                  <span className={`flex items-center gap-2 ${sel ? 'font-medium' : ''}`}>
                    {sel && (
                      <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {opt.label}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}
