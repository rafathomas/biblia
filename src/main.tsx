import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '@/app/error-boundary'
import { SettingsProvider } from '@/app/settings-context'
import { router } from '@/app/router'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>
)
