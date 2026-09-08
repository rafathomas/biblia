import { getDatabase } from '@/lib/db/database'
import type { Highlight, HighlightColor } from '@/types/user-data'

export async function listHighlights() {
  return (await getDatabase()).getAll('highlights')
}

export async function getHighlight(id: string) {
  return (await getDatabase()).get('highlights', id)
}

export async function saveHighlight(id: string, color: HighlightColor) {
  const highlight: Highlight = { id, reference: id, color, createdAt: new Date().toISOString() }
  await (await getDatabase()).put('highlights', highlight)
  return highlight
}

export async function removeHighlight(id: string) {
  await (await getDatabase()).delete('highlights', id)
}
