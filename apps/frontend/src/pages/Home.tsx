import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tools } from '../tools/registry'
import { CATEGORY_ORDER, type ToolCategory } from '../tools/types'
import { useI18n } from '../hooks/useI18n'
import { ToolIcon } from '../components/ToolIcon'

export function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const { tk, toolName, toolDesc, catName } = useI18n()

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
    return tools.filter(tool => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false
      if (!q) return true
      const name = toolName(tool.id).toLowerCase()
      const desc = toolDesc(tool.id).toLowerCase()
      return (
        name.includes(q) ||
        desc.includes(q) ||
        tool.name.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.includes(q))
      )
    })
  }, [search, activeCategory, toolName, toolDesc])

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map(cat => ({
      category: cat,
      label: catName(cat),
      items: filtered.filter(t => t.category === cat),
    })).filter(g => g.items.length > 0)
  }, [filtered, catName])

  const categories: { key: ToolCategory | 'all'; label: string }[] = [
    { key: 'all', label: tk('app.all') },
    ...CATEGORY_ORDER.map(cat => ({ key: cat, label: catName(cat) })),
  ]

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          17 tools available
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="gradient-text">{tk('app.title')}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-surface-400 leading-relaxed">
          {tk('app.subtitle')}
        </p>
      </div>

      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
        <div className="relative flex items-center">
          <svg className="absolute left-4 h-5 w-5 text-surface-500 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={tk('app.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-surface-700/50 bg-surface-900/60 backdrop-blur-xl pl-12 pr-4 py-4 text-sm text-surface-100 placeholder-surface-500 transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-surface-900/80"
          />
          <kbd className="absolute right-4 hidden rounded-lg border border-surface-700/50 bg-surface-800/60 px-2 py-0.5 text-[10px] font-semibold text-surface-500 sm:inline">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeCategory === key
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-surface-800/40 text-surface-400 hover:bg-surface-800/60 hover:text-surface-200 backdrop-blur-sm'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800/50">
            <svg className="h-8 w-8 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-surface-500">{tk('app.noResults')} "{search}"</p>
        </div>
      )}

      {grouped.map(({ category, label, items }) => (
        <div key={category} className="mb-10">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-surface-500">
            {label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((tool, i) => (
              <Link
                key={tool.id}
                to={tool.route}
                className="group relative overflow-hidden rounded-2xl border border-surface-800/50 bg-surface-900/30 backdrop-blur-xl p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-surface-800/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-surface-800/80 to-surface-700/40 text-surface-300 transition-all duration-300 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 group-hover:text-indigo-400">
                    <ToolIcon id={tool.id} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-surface-100 transition-colors group-hover:text-indigo-400">
                      {toolName(tool.id)}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-surface-500 line-clamp-2">
                      {toolDesc(tool.id)}
                    </div>
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
