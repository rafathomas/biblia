import { normalizeText } from '@/lib/utils'
import type { BibleVersionId, SearchResult } from '@/types/bible'

type IndexVerse = SearchResult
const indexCache = new Map<BibleVersionId, Promise<IndexVerse[]>>()

function getIndex(version: BibleVersionId) {
  let promise = indexCache.get(version)
  if (!promise) {
    promise = fetch(`/bible/${version}/search-index.json`).then((response) => {
      if (!response.ok) throw new Error('Índice indisponível')
      return response.json() as Promise<IndexVerse[]>
    })
    indexCache.set(version, promise)
  }
  return promise
}

self.onmessage = async (event: MessageEvent<{ query: string; version: BibleVersionId }>) => {
  try {
    const query = normalizeText(event.data.query)
    if (query.length < 2) return self.postMessage({ results: [] })
    const index = await getIndex(event.data.version)
    const results: SearchResult[] = []
    for (const item of index) {
      if (normalizeText(item.text).includes(query)) results.push(item)
      if (results.length >= 80) break
    }
    self.postMessage({ results })
  } catch {
    self.postMessage({ results: [], error: 'Não foi possível abrir o índice de pesquisa.' })
  }
}
