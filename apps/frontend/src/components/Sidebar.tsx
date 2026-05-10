import { NavLink, useLocation } from 'react-router-dom'
import { CATEGORY_ORDER } from '../tools/types'
import { tools } from '../tools/registry'
import { useI18n } from '../hooks/useI18n'
import { ToolIcon } from './ToolIcon'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation()
  const { t, toolName, catName } = useI18n()

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: catName(cat),
    items: tools.filter(t => t.category === cat),
  }))

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-72 border-r border-surface-800/50 glass transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full overflow-y-auto p-4 space-y-1">
          <NavLink
            to="/"
            onClick={onClose}
            className={`mb-5 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-400 shadow-sm'
                : 'text-surface-400 hover:bg-surface-800/50 hover:text-surface-200'
            }`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            {t('app.home')}
          </NavLink>

          {grouped.map(({ category, label, items }) => (
            <div key={category} className="mb-5">
              <div className="mb-2 px-4 text-[11px] font-bold uppercase tracking-widest text-surface-500">
                {label}
              </div>
              <div className="space-y-0.5">
                {items.map(tool => (
                  <NavLink
                    key={tool.id}
                    to={tool.route}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-400'
                          : 'text-surface-400 hover:bg-surface-800/40 hover:text-surface-200'
                      }`
                    }
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-800/60 text-surface-400">
                      <ToolIcon id={tool.id} className="h-3.5 w-3.5" />
                    </span>
                    {toolName(tool.id)}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
