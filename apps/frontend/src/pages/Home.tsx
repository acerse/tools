import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tools } from '../tools/registry'
import { CATEGORY_LABELS, CATEGORY_ORDER, type ToolCategory } from '../tools/types'

export function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return tools.filter(t => {
      if (activeCategory !== 'all' && t.category !== activeCategory) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some(k => k.includes(q))
      )
    })
  }, [search, activeCategory])

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map(cat => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: filtered.filter(t => t.category === cat),
    })).filter(g => g.items.length > 0)
  }, [filtered])

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-surface-100 sm:text-4xl">
          Developer Tools
        </h1>
        <p className="mt-2 text-surface-400">
          Fast, private, edge-native utilities. All processing happens in your browser.
        </p>
      </div>

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tools...  (Ctrl+K)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="tool-input pl-12 pr-4"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-accent-600 text-white'
              : 'bg-surface-800 text-surface-400 hover:text-surface-200'
          }`}
        >
          All
        </button>
        {CATEGORY_ORDER.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-accent-600 text-white'
                : 'bg-surface-800 text-surface-400 hover:text-surface-200'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <div className="py-12 text-center text-surface-500">
          No tools found matching "{search}"
        </div>
      )}

      {grouped.map(({ category, label, items }) => (
        <div key={category} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-500">
            {label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(tool => (
              <Link
                key={tool.id}
                to={tool.route}
                className="group card flex items-start gap-3 transition-colors hover:border-accent-500/50 hover:bg-surface-800/50"
              >
                <span className="mt-0.5 text-2xl">{tool.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-surface-100 group-hover:text-accent-400 transition-colors">
                    {tool.name}
                  </div>
                  <div className="mt-0.5 text-xs text-surface-500 line-clamp-2">
                    {tool.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
