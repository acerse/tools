import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useI18n } from '../hooks/useI18n'

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { theme, toggle } = useTheme()
  const { locale, setLocale, t } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-surface-800/50 glass">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="rounded-xl p-2 text-surface-400 transition-all hover:bg-surface-800/50 hover:text-surface-200 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
                <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
                  <path d="M8 16l4-8h8l4 8-4 8h-8l-4-8z" stroke="white" strokeWidth="2.5" fill="none"/>
                  <circle cx="16" cy="16" r="3" fill="white"/>
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-surface-100">CF</span>
              <span className="text-lg font-bold gradient-text">Tools</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="rounded-xl px-3 py-2 text-xs font-bold text-surface-400 transition-all hover:bg-surface-800/50 hover:text-surface-200"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>

          <button
            onClick={toggle}
            className="rounded-xl p-2.5 text-surface-400 transition-all hover:bg-surface-800/50 hover:text-surface-200"
            title={theme === 'dark' ? t('app.lightMode') : t('app.darkMode')}
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2.5 text-surface-400 transition-all hover:bg-surface-800/50 hover:text-surface-200"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
