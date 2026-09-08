import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Bookmark, NotebookPen, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getBookById, getReferenceLabel } from '@/services/bible.service'
import { getLastReading, listRecentReadings } from '@/repositories/reading-history.repository'
import type { ReadingHistory } from '@/types/user-data'

const quickLinks = [
  { to: '/biblia', label: 'Bíblia', description: 'Escolha um livro', icon: BookOpen },
  { to: '/pesquisa', label: 'Pesquisa', description: 'Palavra ou referência', icon: Search },
  { to: '/favoritos', label: 'Favoritos', description: 'Versículos salvos', icon: Bookmark },
  { to: '/notas', label: 'Notas', description: 'Seus pensamentos', icon: NotebookPen }
]

export default function HomePage() {
  const [lastReading, setLastReading] = useState<ReadingHistory>()
  const [recent, setRecent] = useState<ReadingHistory[]>([])
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  useEffect(() => {
    void Promise.all([getLastReading(), listRecentReadings()]).then(([last, history]) => {
      setLastReading(last)
      setRecent(history.filter((item, index, all) => all.findIndex((other) => other.bookId === item.bookId) === index))
    })
  }, [])

  const continueBook = lastReading ? getBookById(lastReading.bookId) : getBookById('JHN')
  const continueChapter = lastReading?.chapter ?? 3
  const continueVerse = lastReading?.verse ?? 16

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Um momento para ler.</h1>
      </header>

      <section className="mt-10 overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10" aria-labelledby="continue-title">
        <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-65">Continuar lendo</p>
        <h2 id="continue-title" className="mt-5 font-serif text-4xl font-semibold sm:text-5xl">{continueBook?.name} {continueChapter}</h2>
        <p className="mt-3 text-sm opacity-70">Versículo {continueVerse} · Bíblia Livre</p>
        <Link to={`/biblia/${continueBook?.slug}/${continueChapter}/${continueVerse}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary-foreground px-5 text-sm font-bold text-primary transition-opacity hover:opacity-90">
          Continuar <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="mt-12" aria-labelledby="quick-title">
        <h2 id="quick-title" className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Acesso rápido</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {quickLinks.map(({ to, label, description, icon: Icon }) => (
            <Link key={to} to={to} className="group flex min-h-20 items-center gap-3 rounded-2xl border bg-surface p-4 transition-colors hover:bg-muted active:bg-accent">
              <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{label}</p>
                <p className="hidden truncate text-xs leading-5 text-muted-foreground sm:block">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mt-12" aria-labelledby="recent-title">
          <div className="flex items-center justify-between"><h2 id="recent-title" className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Lidos recentemente</h2><Button variant="ghost" className="px-2" onClick={() => setRecent([])}>Ocultar</Button></div>
          <div className="mt-3 divide-y rounded-2xl border bg-surface">
            {recent.map((item) => {
              const book = getBookById(item.bookId)
              return <Link key={item.id} to={`/biblia/${book?.slug}/${item.chapter}/${item.verse}`} className="flex min-h-16 items-center justify-between rounded-xl px-4 hover:bg-muted"><span className="font-medium">{getReferenceLabel(item.bookId, item.chapter)}</span><ArrowRight className="size-4 text-muted-foreground" /></Link>
            })}
          </div>
        </section>
      )}
    </div>
  )
}
