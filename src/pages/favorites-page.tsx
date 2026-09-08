import { useEffect, useState } from 'react'
import { Bookmark, Search, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '@/components/layout/page-shell'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { listFavorites, removeFavorite } from '@/repositories/favorites.repository'
import { getBookById, getReferenceLabel } from '@/services/bible.service'
import type { Favorite } from '@/types/user-data'
import { normalizeText } from '@/lib/utils'

export default function FavoritesPage() {
  const [items, setItems] = useState<Favorite[]>([])
  const [query, setQuery] = useState('')
  useEffect(() => { void listFavorites().then(setItems) }, [])
  const visible = items.filter((item) => normalizeText(`${getReferenceLabel(item.bookId, item.chapter, item.verse)} ${item.text}`).includes(normalizeText(query)))

  async function remove(id: string) { await removeFavorite(id); setItems((current) => current.filter((item) => item.id !== id)) }

  return (
    <PageShell eyebrow="Sua biblioteca" title="Favoritos" description="Versículos guardados neste dispositivo.">
      {items.length > 0 && <div className="relative mt-8 max-w-md"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><label htmlFor="favorite-search" className="sr-only">Pesquisar favoritos</label><input id="favorite-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar nos favoritos" className="h-12 w-full rounded-xl border bg-surface pl-11 pr-4" /></div>}
      {items.length === 0 ? <EmptyState icon={Bookmark} title="Nenhum versículo salvo ainda" description="Toque em um versículo durante a leitura para adicioná-lo aos favoritos." /> : (
        <div className="mt-8 max-w-3xl divide-y">
          {visible.map((item) => {
            const book = getBookById(item.bookId)
            return <article key={item.id} className="group flex gap-3 py-6"><Link className="min-w-0 flex-1 rounded-xl p-2 hover:bg-muted" to={`/biblia/${book?.slug}/${item.chapter}/${item.verse}`}><h2 className="text-sm font-bold">{getReferenceLabel(item.bookId, item.chapter, item.verse, item.endVerse)}</h2><p className="mt-2 font-serif text-lg leading-8 text-muted-foreground">“{item.text}”</p></Link><Button variant="ghost" size="icon" aria-label={`Remover ${getReferenceLabel(item.bookId, item.chapter, item.verse)} dos favoritos`} onClick={() => void remove(item.id)}><Trash2 className="size-4" /></Button></article>
          })}
          {visible.length === 0 && <p className="py-16 text-center text-muted-foreground">Nenhum favorito corresponde à pesquisa.</p>}
        </div>
      )}
    </PageShell>
  )
}
