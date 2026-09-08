import { useEffect, useRef, useState, useTransition } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { VerseActions } from '@/components/reader/verse-actions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSettings } from '@/app/settings-context'
import { listHighlights } from '@/repositories/highlights.repository'
import { getReading, saveReading } from '@/repositories/reading-history.repository'
import { getAdjacentChapter, getBook, loadChapter, prefetchAdjacent } from '@/services/bible.service'
import { makeReferenceId } from '@/lib/utils'
import type { BibleChapter } from '@/types/bible'
import type { Highlight } from '@/types/user-data'

export default function ReaderPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const { settings } = useSettings()
  const book = params.book ? getBook(params.book) : undefined
  const chapterNumber = Number(params.chapter)
  const verseParam = params.verse ? Number(params.verse) : undefined
  const valid = book && Number.isInteger(chapterNumber) && chapterNumber >= 1 && chapterNumber <= book.chapters
  const [data, setData] = useState<BibleChapter>()
  const [failed, setFailed] = useState(false)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [selection, setSelection] = useState<{ start: number; end: number }>()
  const saveTimer = useRef<number | undefined>(undefined)

  function refreshHighlights() { void listHighlights().then(setHighlights) }

  useEffect(() => {
    if (!valid) return
    let active = true
    setData(undefined)
    setFailed(false)
    setSelection(undefined)
    void loadChapter(settings.version, book.slug, chapterNumber).then((chapter) => {
      if (!active) return
      setData(chapter)
      prefetchAdjacent(settings.version, book.slug, chapterNumber, book.chapters)
    }).catch(() => active && setFailed(true))
    refreshHighlights()
    document.title = `${book.name} ${chapterNumber}${verseParam ? `:${verseParam}` : ''} | Bíblia`
    return () => { active = false }
  }, [book, chapterNumber, verseParam, valid, settings.version])

  useEffect(() => {
    if (!data || !book) return
    const restore = async () => {
      if (verseParam) {
        const target = document.getElementById(`versiculo-${verseParam}`)
        target?.scrollIntoView({ block: 'center' })
        setSelection({ start: verseParam, end: verseParam })
      } else {
        const reading = await getReading(book.id)
        if (reading?.chapter === chapterNumber) window.scrollTo({ top: reading.scrollPosition })
      }
    }
    void restore()
  }, [data, book, chapterNumber, verseParam])

  useEffect(() => {
    if (!book || !data) return
    const persist = () => {
      const elements = [...document.querySelectorAll<HTMLElement>('[data-verse]')]
      const visible = elements.filter((element) => element.getBoundingClientRect().top < 180).at(-1)
      const verse = Number(visible?.dataset.verse ?? 1)
      void saveReading({ id: book.id, bookId: book.id, chapter: chapterNumber, verse, scrollPosition: window.scrollY, updatedAt: new Date().toISOString() })
    }
    const onScroll = () => { window.clearTimeout(saveTimer.current); saveTimer.current = window.setTimeout(persist, 600) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.clearTimeout(saveTimer.current); persist() }
  }, [book, chapterNumber, data])

  if (!valid) return <Navigate to="/biblia" replace />
  const previous = getAdjacentChapter(book.id, chapterNumber, -1)
  const next = getAdjacentChapter(book.id, chapterNumber, 1)
  const selectedVerses = selection && data ? data.verses.filter((verse) => verse.verse >= selection.start && verse.verse <= selection.end) : []
  const selectionId = selection ? makeReferenceId(book.id, chapterNumber, selection.start, selection.end) : ''

  function goTo(target: typeof previous) {
    if (!target) return
    startTransition(() => navigate(`/biblia/${target.book.slug}/${target.chapter}`))
    window.scrollTo({ top: 0 })
  }

  return (
    <div className={`reader-surface reader-${settings.readerTheme} min-h-dvh`}>
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[color:var(--reader-bg)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[820px] items-center justify-between px-3 sm:px-6">
          <Link to={`/biblia/${book.slug}`} className="flex size-11 items-center justify-center rounded-xl hover:bg-black/5" aria-label={`Voltar aos capítulos de ${book.name}`}><ArrowLeft className="size-5" /></Link>
          <Link to={`/biblia/${book.slug}`} className="rounded-lg px-3 py-2 text-center"><span className="block text-sm font-bold">{book.name} {chapterNumber}</span><span className="text-[10px] uppercase tracking-wider opacity-55">{data?.version ?? ''}</span></Link>
          <Link to="/configuracoes" className="flex size-11 items-center justify-center rounded-xl hover:bg-black/5" aria-label="Aparência da leitura"><MoreHorizontal className="size-5" /></Link>
        </div>
      </header>

      <article aria-busy={!data} className={`mx-auto max-w-[680px] px-5 pb-16 pt-14 sm:px-8 sm:pt-20 ${isPending ? 'opacity-70' : ''}`}>
        <header className="mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] opacity-55">{book.name}</p>
          <h1 className="mt-3 font-serif text-6xl font-semibold leading-none sm:text-7xl">{chapterNumber}</h1>
        </header>
        {!data && !failed && <div className="space-y-5"><Skeleton className="h-7 w-full bg-black/10" /><Skeleton className="h-7 w-11/12 bg-black/10" /><Skeleton className="h-7 w-full bg-black/10" /><Skeleton className="h-7 w-4/5 bg-black/10" /></div>}
        {failed && <div className="rounded-2xl border border-black/10 p-6 text-center"><h2 className="font-bold">Não foi possível abrir este capítulo.</h2><p className="mt-2 text-sm opacity-65">Verifique a conexão na primeira abertura e tente novamente.</p><Button className="mt-5" onClick={() => window.location.reload()}>Tentar novamente</Button></div>}
        {data && (
          <div className="space-y-1 font-serif" style={{ fontSize: 'var(--reader-font-size)', lineHeight: 'var(--reader-line-height)' }}>
            {data.verses.map((verse) => {
              const id = makeReferenceId(book.id, chapterNumber, verse.verse)
              const highlight = highlights.find((item) => item.id === id)
              const selected = selection && verse.verse >= selection.start && verse.verse <= selection.end
              return (
                <button key={verse.verse} id={`versiculo-${verse.verse}`} data-verse={verse.verse} onClick={() => setSelection({ start: verse.verse, end: verse.verse })} className={`block w-full scroll-mt-24 rounded-lg px-2 py-2 text-left transition-colors hover:bg-black/5 focus-visible:outline-offset-0 ${highlight ? `verse-highlight-${highlight.color}` : ''} ${selected ? 'ring-2 ring-current/30' : ''}`} aria-label={`${book.name} ${chapterNumber}, versículo ${verse.verse}. ${verse.text}`}>
                  <sup className="mr-1.5 font-sans text-[0.58em] font-bold opacity-55">{verse.verse}</sup>{verse.text}
                </button>
              )
            })}
          </div>
        )}
      </article>

      <nav className="mx-auto grid max-w-[680px] grid-cols-2 gap-3 border-t border-black/10 px-5 py-6 sm:px-8" aria-label="Capítulos adjacentes">
        <button disabled={!previous} onClick={() => goTo(previous)} className="flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-xl px-3 text-left hover:bg-black/5 disabled:opacity-30">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-55"><ChevronLeft className="size-3.5" />Anterior</span>
          <span className="text-sm font-semibold">{previous ? `${previous.book.name} ${previous.chapter}` : 'Início'}</span>
        </button>
        <button disabled={!next} onClick={() => goTo(next)} className="flex min-h-14 flex-col items-end justify-center gap-0.5 rounded-xl px-3 text-right hover:bg-black/5 disabled:opacity-30">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-55">Próximo<ChevronRight className="size-3.5" /></span>
          <span className="text-sm font-semibold">{next ? `${next.book.name} ${next.chapter}` : 'Fim'}</span>
        </button>
      </nav>
      <VerseActions selection={selection && data ? { id: selectionId, bookId: book.id, chapter: chapterNumber, startVerse: selection.start, endVerse: selection.end, verses: selectedVerses } : undefined} onClose={() => setSelection(undefined)} onChanged={refreshHighlights} />
    </div>
  )
}
