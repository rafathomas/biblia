import { useDeferredValue, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '@/components/layout/page-shell'
import { bibleBooks } from '@/data/books.generated'
import { bibleVersions } from '@/data/bible-versions'
import { useSettings } from '@/app/settings-context'
import { normalizeText } from '@/lib/utils'
import type { BibleVersionId } from '@/types/bible'

export default function BiblePage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = bibleBooks.filter((book) => normalizeText(`${book.name} ${book.abbreviation}`).includes(normalizeText(deferredQuery)))
  const { settings, updateSettings } = useSettings()

  return (
    <PageShell eyebrow="Biblioteca" title="66 livros" description="Escolha um livro para ver seus capítulos. Todo o conteúdo está disponível sem internet.">
      <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="book-search" className="sr-only">Pesquisar livro</label>
          <input id="book-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por nome ou abreviação" className="h-12 w-full rounded-xl border bg-surface pl-12 pr-4 text-base placeholder:text-muted-foreground" />
        </div>
        <div className="sm:w-48">
          <label htmlFor="bible-version" className="sr-only">Tradução</label>
          <select
            id="bible-version"
            value={settings.version}
            onChange={(event) => updateSettings({ version: event.target.value as BibleVersionId })}
            className="h-12 w-full rounded-xl border bg-surface px-4 text-sm font-medium"
          >
            {bibleVersions.map((version) => (
              <option key={version.id} value={version.id}>{version.abbreviation}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {(['old', 'new'] as const).map((testament) => (
          <section key={testament} aria-labelledby={`${testament}-title`}>
            <div className="flex items-end justify-between border-b pb-3">
              <h2 id={`${testament}-title`} className="text-lg font-bold">{testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}</h2>
              <span className="text-xs text-muted-foreground">{filtered.filter((book) => book.testament === testament).length} livros</span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2">
              {filtered.filter((book) => book.testament === testament).map((book) => (
                <Link key={book.id} to={`/biblia/${book.slug}`} className="flex min-h-14 items-center justify-between rounded-xl px-3 font-medium transition-colors hover:bg-muted active:bg-accent">
                  <span>{book.name}</span><span className="text-xs text-muted-foreground">{book.chapters} cap.</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      {filtered.length === 0 && <p className="py-16 text-center text-muted-foreground">Nenhum livro encontrado para “{query}”.</p>}
    </PageShell>
  )
}
