import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageShell } from '@/components/layout/page-shell'
import { getBook } from '@/services/bible.service'

export default function BookPage() {
  const { book: slug } = useParams()
  const book = slug ? getBook(slug) : undefined
  if (!book) return <Navigate to="/biblia" replace />

  return (
    <PageShell eyebrow={book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'} title={book.name} description="Escolha o capítulo para começar a leitura." action={<Link to="/biblia" aria-label="Voltar aos livros" className="flex size-11 items-center justify-center rounded-xl hover:bg-muted"><ArrowLeft className="size-5" /></Link>}>
      <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2 sm:max-w-3xl sm:grid-cols-[repeat(10,56px)]" aria-label={`Capítulos de ${book.name}`}>
        {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapter) => (
          <Link key={chapter} to={`/biblia/${book.slug}/${chapter}`} className="flex aspect-square min-h-12 items-center justify-center rounded-xl border bg-surface text-sm font-semibold transition-colors hover:bg-muted active:bg-accent" aria-label={`${book.name}, capítulo ${chapter}`}>{chapter}</Link>
        ))}
      </div>
    </PageShell>
  )
}
