import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-surface-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-fuchsia-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="min-h-[calc(100vh-4rem)] flex-1 lg:ml-72">
            <div className="mx-auto max-w-4xl p-4 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
