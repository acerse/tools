import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div>
      <div className="mb-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-indigo-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-100 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-surface-400 leading-relaxed">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}
