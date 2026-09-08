import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Favorite, Highlight, Note, ReaderSettings, ReadingHistory } from '@/types/user-data'

interface BibleDatabase extends DBSchema {
  settings: { key: string; value: ReaderSettings }
  favorites: { key: string; value: Favorite; indexes: { 'by-created': string } }
  highlights: { key: string; value: Highlight; indexes: { 'by-created': string } }
  notes: { key: string; value: Note; indexes: { 'by-updated': string } }
  readingHistory: { key: string; value: ReadingHistory; indexes: { 'by-updated': string } }
  offlineMetadata: { key: string; value: { id: string; value: string; updatedAt: string } }
}

let databasePromise: Promise<IDBPDatabase<BibleDatabase>> | undefined

export function getDatabase() {
  databasePromise ??= openDB<BibleDatabase>('biblia-offline', 1, {
    upgrade(database) {
      database.createObjectStore('settings', { keyPath: 'id' })
      const favorites = database.createObjectStore('favorites', { keyPath: 'id' })
      favorites.createIndex('by-created', 'createdAt')
      const highlights = database.createObjectStore('highlights', { keyPath: 'id' })
      highlights.createIndex('by-created', 'createdAt')
      const notes = database.createObjectStore('notes', { keyPath: 'id' })
      notes.createIndex('by-updated', 'updatedAt')
      const history = database.createObjectStore('readingHistory', { keyPath: 'id' })
      history.createIndex('by-updated', 'updatedAt')
      database.createObjectStore('offlineMetadata', { keyPath: 'id' })
    }
  })
  return databasePromise
}

export async function clearDatabaseForTests() {
  const database = await getDatabase()
  for (const store of database.objectStoreNames) await database.clear(store)
}
