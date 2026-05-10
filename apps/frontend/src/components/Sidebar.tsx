import { NavLink, useLocation } from 'react-router-dom'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../tools/types'
import { tools } from '../tools/registry'

const CATEGORY_ICONS: Record<string, string> = {
  text: 'T',
  developer: '</>',
  utility: '*',
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation()
  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: tools.filter(t => t.category === cat),
  }))

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-surface-800 bg-surface-950 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full overflow-y-auto p-4">
          <NavLink
            to="/"
            onClick={onClose}
            className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-accent-600/10 text-accent-400'
                : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            All Tools
          </NavLink>

          {grouped.map(({ category, label, items }) => (
            <div key={category} className="mb-4">
              <div className="mb-1.5 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                <span className="font-mono text-[10px]">{CATEGORY_ICONS[category]}</span>
                {label}
              </div>
              {items.map(tool => (
                <NavLink
                  key={tool.id}
                  to={tool.route}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent-600/10 text-accent-400'
                        : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                    }`
                  }
                >
                  <span className="text-base">{tool.icon}</span>
                  {tool.name}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
