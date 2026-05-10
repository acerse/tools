import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { tools } from './tools/registry'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {tools.map(tool => (
          <Route
            key={tool.id}
            path={tool.route}
            element={
              <Suspense fallback={<LoadingFallback />}>
                <tool.component />
              </Suspense>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <div className="py-20 text-center">
              <h1 className="text-4xl font-bold text-surface-300">404</h1>
              <p className="mt-2 text-surface-500">Page not found</p>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
