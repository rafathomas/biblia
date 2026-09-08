import { useEffect, useState } from 'react'
import { NotebookPen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '@/components/layout/page-shell'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { listNotes, removeNote } from '@/repositories/notes.repository'
import { getBookById, getReferenceLabel } from '@/services/bible.service'
import type { Note } from '@/types/user-data'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  useEffect(() => { void listNotes().then(setNotes) }, [])
  async function remove(id: string) { await removeNote(id); setNotes((items) => items.filter((item) => item.id !== id)) }

  return (
    <PageShell eyebrow="Reflexões" title="Notas" description="Pensamentos ligados às suas leituras, salvos somente neste dispositivo.">
      {notes.length === 0 ? <EmptyState icon={NotebookPen} title="Suas notas aparecerão aqui" description="Durante a leitura, toque em um versículo e escolha Nota para começar." /> : (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {notes.map((note) => {
            const book = getBookById(note.bookId)
            return <article key={note.id} className="rounded-2xl border bg-surface p-5"><div className="flex items-start justify-between gap-3"><Link to={`/biblia/${book?.slug}/${note.chapter}/${note.verse}`} className="rounded-lg text-sm font-bold hover:underline">{getReferenceLabel(note.bookId, note.chapter, note.verse)}</Link><Button variant="ghost" size="icon" className="-mr-2 -mt-2" aria-label={`Excluir nota de ${getReferenceLabel(note.bookId, note.chapter, note.verse)}`} onClick={() => void remove(note.id)}><Trash2 className="size-4" /></Button></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{note.content}</p><p className="mt-5 text-xs text-muted-foreground">Atualizada em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(note.updatedAt))}</p></article>
          })}
        </div>
      )}
    </PageShell>
  )
}
