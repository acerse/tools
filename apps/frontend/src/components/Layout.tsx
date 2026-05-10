import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />
      <div className="flex">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-20 rounded-full bg-accent-600 p-3 text-white shadow-lg lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 lg:ml-64">
          <div className="mx-auto max-w-4xl p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
