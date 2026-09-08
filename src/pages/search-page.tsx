import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '@/components/layout/page-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { useSettings } from '@/app/settings-context'
import { parseBibleReference } from '@/features/search/lib/parse-bible-reference'
import { getBookById, getReferenceLabel } from '@/services/bible.service'
import type { SearchResult } from '@/types/bible'

export default function SearchPage() {
  const { settings } = useSettings()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const worker = useRef<Worker | undefined>(undefined)
  const reference = parseBibleReference(query)
  const referenceKey = reference ? `${reference.bookId}-${reference.chapter}-${reference.verse ?? ''}` : ''

  useEffect(() => {
    worker.current = new Worker(new URL('../workers/bible-search.worker.ts', import.meta.url), { type: 'module' })
    worker.current.onmessage = (event: MessageEvent<{ results: SearchResult[]; error?: string }>) => {
      setResults(event.data.results)
      setError(event.data.error ?? '')
      setSearching(false)
    }
    return () => worker.current?.terminate()
  }, [])

  useEffect(() => {
    if (query.trim().length < 2 || referenceKey) { setResults([]); setSearching(false); return }
    setSearching(true)
    const timeout = window.setTimeout(() => worker.current?.postMessage({ query, version: settings.version }), 280)
    return () => window.clearTimeout(timeout)
  }, [query, referenceKey, settings.version])

  return (
    <PageShell eyebrow="Busca offline" title="Pesquisar" description="Encontre palavras ou vá direto a uma referência, como João 3:16 ou 1Co 13:4.">
      <div className="relative mt-8 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="bible-search" className="sr-only">Pesquisar na Bíblia</label>
        <input id="bible-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Palavra ou referência" className="h-14 w-full rounded-2xl border bg-surface pl-12 pr-4 text-lg placeholder:text-muted-foreground" />
      </div>

      {reference && (() => {
        const book = getBookById(reference.bookId)
        return <section className="mt-8 max-w-2xl" aria-label="Referência encontrada"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ir para a referência</p><Link to={`/biblia/${book?.slug}/${reference.chapter}${reference.verse ? `/${reference.verse}` : ''}`} className="flex min-h-20 items-center justify-between rounded-2xl border bg-surface p-5 hover:bg-muted"><span className="text-lg font-bold">{getReferenceLabel(reference.bookId, reference.chapter, reference.verse, reference.endVerse)}</span><ArrowRight className="size-5" /></Link></section>
      })()}

      {searching && <div className="mt-10 max-w-2xl space-y-4" aria-label="Pesquisando"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}
      {error && <p role="alert" className="mt-8 text-sm text-destructive">{error}</p>}
      {!searching && results.length > 0 && (
        <section className="mt-10 max-w-3xl" aria-labelledby="results-title">
          <div className="flex items-center justify-between border-b pb-3"><h2 id="results-title" className="font-bold">Resultados</h2><span className="text-xs text-muted-foreground">{results.length}{results.length === 80 ? '+' : ''} encontrados</span></div>
          <div className="divide-y">
            {results.map((result) => {
              const book = getBookById(result.bookId)
              return <Link key={`${result.bookId}-${result.chapter}-${result.verse}`} to={`/biblia/${book?.slug}/${result.chapter}/${result.verse}`} className="block rounded-xl px-2 py-5 hover:bg-muted"><p className="text-sm font-bold">{getReferenceLabel(result.bookId, result.chapter, result.verse)}</p><p className="mt-2 font-serif leading-7 text-muted-foreground">{result.text}</p></Link>
            })}
          </div>
        </section>
      )}
      {!searching && query.trim().length >= 2 && !reference && results.length === 0 && !error && <p className="mt-12 text-muted-foreground">Nenhum resultado encontrado para “{query}”.</p>}
    </PageShell>
  )
}
