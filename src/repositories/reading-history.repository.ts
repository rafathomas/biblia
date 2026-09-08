import { getDatabase } from '@/lib/db/database'
import type { ReadingHistory } from '@/types/user-data'

export async function getLastReading() {
  const items = await (await getDatabase()).getAllFromIndex('readingHistory', 'by-updated')
  return items.at(-1)
}

export async function getReading(bookId: string) {
  return (await getDatabase()).get('readingHistory', bookId)
}

export async function listRecentReadings(limit = 4) {
  const items = await (await getDatabase()).getAllFromIndex('readingHistory', 'by-updated')
  return items.reverse().slice(0, limit)
}

export async function saveReading(reading: ReadingHistory) {
  await (await getDatabase()).put('readingHistory', reading)
}
