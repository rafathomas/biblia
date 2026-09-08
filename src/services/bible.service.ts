import { bibleBooks } from '@/data/books.generated'
import { chapterSchema } from '@/schemas/bible'
import type { BibleChapter, BibleVersionId } from '@/types/bible'

const cache = new Map<string, Promise<BibleChapter>>()

export function getBook(slugOrId: string) {
  return bibleBooks.find((book) => book.slug === slugOrId || book.id === slugOrId.toUpperCase())
}

export function getBookById(id: string) {
  return bibleBooks.find((book) => book.id === id)
}

export function getReferenceLabel(bookId: string, chapter: number, verse?: number, endVerse?: number) {
  const name = getBookById(bookId)?.name ?? bookId
  const verses = verse ? `:${verse}${endVerse && endVerse !== verse ? `–${endVerse}` : ''}` : ''
  return `${name} ${chapter}${verses}`
}

export function loadChapter(version: BibleVersionId, slug: string, chapter: number): Promise<BibleChapter> {
  const key = `${version}-${slug}-${chapter}`
  const existing = cache.get(key)
  if (existing) return existing
  const request = fetch(`/bible/${version}/${slug}/${chapter}.json`)
    .then((response) => {
      if (!response.ok) throw new Error('Capítulo não encontrado')
      return response.json() as Promise<unknown>
    })
    .then((data) => chapterSchema.parse(data))
  cache.set(key, request)
  request.catch(() => cache.delete(key))
  return request
}

export function prefetchAdjacent(version: BibleVersionId, slug: string, chapter: number, chapterCount: number) {
  if (chapter < chapterCount) void loadChapter(version, slug, chapter + 1)
  if (chapter > 1) void loadChapter(version, slug, chapter - 1)
}

export function getAdjacentChapter(bookId: string, chapter: number, direction: -1 | 1) {
  const index = bibleBooks.findIndex((book) => book.id === bookId)
  const book = bibleBooks[index]
  if (!book) return undefined
  const nextChapter = chapter + direction
  if (nextChapter >= 1 && nextChapter <= book.chapters) return { book, chapter: nextChapter }
  const adjacentBook = bibleBooks[index + direction]
  if (!adjacentBook) return undefined
  return { book: adjacentBook, chapter: direction === 1 ? 1 : adjacentBook.chapters }
}
