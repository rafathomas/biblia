import { getDatabase } from '@/lib/db/database'
import type { Note } from '@/types/user-data'

export async function listNotes() {
  const items = await (await getDatabase()).getAllFromIndex('notes', 'by-updated')
  return items.reverse()
}

export async function getNote(id: string) {
  return (await getDatabase()).get('notes', id)
}

export async function saveNote(note: Note) {
  await (await getDatabase()).put('notes', note)
}

export async function removeNote(id: string) {
  await (await getDatabase()).delete('notes', id)
}
