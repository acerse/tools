import type { ReactNode } from 'react'
import CopyButton from './CopyButton'

interface OutputBoxProps {
  label?: string
  value?: string
  content?: string
  mono?: boolean
  rows?: number
  children?: ReactNode
}

export default function OutputBox({ label, value, content, mono = true, rows = 6, children }: OutputBoxProps) {
  const text = value ?? content ?? ''

  return (
    <div>
      {label && <label className="tool-label">{label}</label>}
      {children ? (
        <div className="relative card">
          {children}
          {text && <CopyButton text={text} />}
        </div>
      ) : (
        <div className="relative">
          <textarea
            readOnly
            value={text}
            rows={rows}
            className={`tool-textarea ${mono ? 'font-mono' : ''}`}
          />
          {text && <CopyButton text={text} />}
        </div>
      )}
    </div>
  )
}
