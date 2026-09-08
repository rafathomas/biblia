import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { Skeleton } from '@/components/ui/skeleton'

const HomePage = lazy(() => import('@/pages/home-page'))
const BiblePage = lazy(() => import('@/pages/bible-page'))
const BookPage = lazy(() => import('@/pages/book-page'))
const ReaderPage = lazy(() => import('@/pages/reader-page'))
const SearchPage = lazy(() => import('@/pages/search-page'))
const FavoritesPage = lazy(() => import('@/pages/favorites-page'))
const NotesPage = lazy(() => import('@/pages/notes-page'))
const SettingsPage = lazy(() => import('@/pages/settings-page'))

function LoadingPage() {
  return <div className="mx-auto max-w-6xl px-5 py-10" aria-label="Carregando"><Skeleton className="h-5 w-24" /><Skeleton className="mt-4 h-10 w-64" /><Skeleton className="mt-10 h-48 w-full" /></div>
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/biblia', element: withSuspense(<BiblePage />) },
      { path: '/biblia/:book', element: withSuspense(<BookPage />) },
      { path: '/biblia/:book/:chapter', element: withSuspense(<ReaderPage />) },
      { path: '/biblia/:book/:chapter/:verse', element: withSuspense(<ReaderPage />) },
      { path: '/pesquisa', element: withSuspense(<SearchPage />) },
      { path: '/favoritos', element: withSuspense(<FavoritesPage />) },
      { path: '/notas', element: withSuspense(<NotesPage />) },
      { path: '/configuracoes', element: withSuspense(<SettingsPage />) },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])
