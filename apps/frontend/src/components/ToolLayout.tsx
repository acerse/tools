import type { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-100">{title}</h1>
        <p className="mt-1 text-sm text-surface-400">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}
