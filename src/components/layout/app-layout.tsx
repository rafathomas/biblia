import { useEffect } from 'react'
import { BookOpen, Bookmark, Home, NotebookPen, Search, Settings } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PwaStatus } from './pwa-status'

const navigation = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/biblia', label: 'Bíblia', icon: BookOpen },
  { to: '/pesquisa', label: 'Pesquisar', icon: Search },
  { to: '/favoritos', label: 'Salvos', icon: Bookmark }
]

const mobileNavigation = [...navigation, { to: '/notas', label: 'Notas', icon: NotebookPen }]

const secondaryNavigation = [
  { to: '/notas', label: 'Notas', icon: NotebookPen },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
]

export function AppLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0 }) }, [pathname])

  return (
    <div className="min-h-dvh">
      <a href="#conteudo" className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform focus:translate-y-0">Pular para o conteúdo</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-surface px-5 py-7 md:flex md:flex-col">
        <NavLink to="/" className="flex min-h-12 items-center gap-3 rounded-xl px-2" aria-label="Bíblia, página inicial">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BookOpen className="size-5" /></span>
          <span className="text-lg font-bold tracking-tight">Bíblia</span>
        </NavLink>
        <nav className="mt-12 space-y-1" aria-label="Navegação principal">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', isActive && 'bg-muted text-foreground')}>
              <Icon className="size-5" aria-hidden="true" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="my-6 border-t" />
        <nav className="space-y-1" aria-label="Navegação secundária">
          {secondaryNavigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground', isActive && 'bg-muted text-foreground')}><Icon className="size-5" aria-hidden="true" />{label}</NavLink>
          ))}
        </nav>
        <p className="mt-auto px-3 pt-6 text-xs leading-5 text-muted-foreground">Bíblia Livre · CC BY 3.0 BR</p>
      </aside>
      <main id="conteudo" className="min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:ml-64 md:pb-0"><Outlet /></main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Navegação principal">
        {mobileNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-muted-foreground transition-colors', isActive && 'text-foreground')}>
            <Icon className="size-5" aria-hidden="true" />{label}
          </NavLink>
        ))}
      </nav>
      <PwaStatus />
    </div>
  )
}
