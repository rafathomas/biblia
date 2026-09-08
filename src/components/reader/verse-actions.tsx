import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Bookmark, Check, Clipboard, Highlighter, NotebookPen, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { noteContentSchema } from '@/schemas/bible'
import { getFavorite, removeFavorite, saveFavorite } from '@/repositories/favorites.repository'
import { getHighlight, removeHighlight, saveHighlight } from '@/repositories/highlights.repository'
import { getNote, saveNote } from '@/repositories/notes.repository'
import { getReferenceLabel } from '@/services/bible.service'
import type { BibleVerse } from '@/types/bible'
import type { HighlightColor } from '@/types/user-data'

interface VerseSelection {
  id: string
  bookId: string
  chapter: number
  startVerse: number
  endVerse: number
  verses: BibleVerse[]
}

const colors: { color: HighlightColor; label: string; className: string }[] = [
  { color: 'yellow', label: 'Amarelo', className: 'bg-amber-200 dark:bg-amber-700' },
  { color: 'green', label: 'Verde', className: 'bg-emerald-200 dark:bg-emerald-700' },
  { color: 'blue', label: 'Azul', className: 'bg-sky-200 dark:bg-sky-700' },
  { color: 'pink', label: 'Rosa', className: 'bg-rose-200 dark:bg-rose-700' }
]

export function VerseActions({ selection, onClose, onChanged }: {
  selection?: VerseSelection
  onClose: () => void
  onChanged: () => void
}) {
  const [favorite, setFavorite] = useState(false)
  const [highlight, setHighlight] = useState<HighlightColor>()
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [noteCreatedAt, setNoteCreatedAt] = useState<string>()
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!selection) return
    setNoteOpen(false)
    setError('')
    setStatus('')
    void Promise.all([getFavorite(selection.id), getHighlight(selection.id), getNote(selection.id)]).then(([savedFavorite, savedHighlight, savedNote]) => {
      setFavorite(Boolean(savedFavorite))
      setHighlight(savedHighlight?.color)
      setNote(savedNote?.content ?? '')
      setNoteCreatedAt(savedNote?.createdAt)
    })
  }, [selection])

  if (!selection) return null
  const label = getReferenceLabel(selection.bookId, selection.chapter, selection.startVerse, selection.endVerse)
  const plainText = selection.verses.map((verse) => verse.text).join(' ')
  const shareText = `“${plainText}”\n\n${label}`

  async function copyText() {
    await navigator.clipboard.writeText(shareText)
    setStatus('Texto copiado.')
  }

  async function toggleFavorite() {
    if (favorite) await removeFavorite(selection!.id)
    else await saveFavorite({ id: selection!.id, bookId: selection!.bookId, chapter: selection!.chapter, verse: selection!.startVerse, endVerse: selection!.endVerse, text: plainText, createdAt: new Date().toISOString() })
    setFavorite(!favorite)
    setStatus(favorite ? 'Removido dos favoritos.' : 'Salvo nos favoritos.')
    onChanged()
  }

  async function setHighlightColor(color: HighlightColor) {
    if (highlight === color) { await removeHighlight(selection!.id); setHighlight(undefined); setStatus('Destaque removido.') }
    else { await saveHighlight(selection!.id, color); setHighlight(color); setStatus('Destaque aplicado.') }
    onChanged()
  }

  async function persistNote() {
    const parsed = noteContentSchema.safeParse(note)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Nota inválida.'); return }
    const now = new Date().toISOString()
    await saveNote({ id: selection!.id, reference: selection!.id, bookId: selection!.bookId, chapter: selection!.chapter, verse: selection!.startVerse, content: parsed.data, createdAt: noteCreatedAt ?? now, updatedAt: now })
    setNoteCreatedAt(noteCreatedAt ?? now)
    setError('')
    setStatus('Nota salva neste dispositivo.')
    setNoteOpen(false)
    onChanged()
  }

  async function share() {
    if (navigator.share) await navigator.share({ title: label, text: shareText })
    else await copyText()
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in" />
        <Dialog.Content aria-describedby="verse-preview" className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-3xl border bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-6">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div><Dialog.Title className="text-lg font-bold">{label}</Dialog.Title><Dialog.Description id="verse-preview" className="mt-2 line-clamp-3 font-serif text-sm leading-6 text-muted-foreground">{plainText}</Dialog.Description></div>
            <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Fechar ações"><X className="size-5" /></Button></Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-1 border-y py-3">
            <Action icon={Clipboard} label="Copiar" onClick={() => void copyText()} />
            <Action icon={favorite ? Check : Bookmark} label={favorite ? 'Salvo' : 'Favoritar'} active={favorite} onClick={() => void toggleFavorite()} />
            <Action icon={Highlighter} label="Destacar" active={Boolean(highlight)} onClick={() => setStatus('Escolha uma cor abaixo.')} />
            <Action icon={NotebookPen} label="Nota" active={noteOpen || Boolean(note)} onClick={() => setNoteOpen((value) => !value)} />
            <Action icon={Share2} label="Compartilhar" onClick={() => void share()} />
          </div>

          <fieldset className="mt-5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cor do destaque</legend>
            <div className="mt-3 flex gap-3">
              {colors.map((item) => <button key={item.color} onClick={() => void setHighlightColor(item.color)} className={`flex size-11 items-center justify-center rounded-full ${item.className} ${highlight === item.color ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`} aria-label={`${highlight === item.color ? 'Remover' : 'Destacar em'} ${item.label}`}><span className="sr-only">{item.label}</span>{highlight === item.color && <Check className="size-4" />}</button>)}
            </div>
          </fieldset>

          {noteOpen && (
            <div className="mt-6 border-t pt-5">
              <label htmlFor="verse-note" className="text-sm font-bold">Minha nota</label>
              <textarea id="verse-note" value={note} onChange={(event) => { setNote(event.target.value); setError('') }} rows={5} maxLength={4000} className="mt-2 w-full resize-y rounded-xl border bg-background p-3 text-base leading-6" placeholder="Escreva sem pressa…" aria-invalid={Boolean(error)} aria-describedby={error ? 'note-error' : 'note-limit'} />
              <div className="mt-2 flex items-center justify-between"><p id={error ? 'note-error' : 'note-limit'} role={error ? 'alert' : undefined} className={`text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>{error || `${note.length}/4.000`}</p><Button onClick={() => void persistNote()}>Salvar nota</Button></div>
            </div>
          )}
          {status && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-medium"><Check className="size-4" aria-hidden="true" />{status}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Action({ icon: Icon, label, active, onClick }: { icon: typeof Bookmark; label: string; active?: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors hover:bg-muted ${active ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><Icon className="size-5" aria-hidden="true" /><span className="truncate">{label}</span></button>
}
