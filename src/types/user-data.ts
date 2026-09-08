import type { BibleVersionId } from '@/types/bible'

export type Theme = 'light' | 'dark' | 'system'
export type ReaderTheme = 'light' | 'paper' | 'dark'
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink'

export interface ReaderSettings {
  id: 'reader'
  fontSize: number
  lineHeight: number
  theme: Theme
  readerTheme: ReaderTheme
  version: BibleVersionId
}

export interface Favorite {
  id: string
  bookId: string
  chapter: number
  verse: number
  endVerse?: number
  text: string
  createdAt: string
}

export interface Highlight {
  id: string
  reference: string
  color: HighlightColor
  createdAt: string
}

export interface Note {
  id: string
  reference: string
  bookId: string
  chapter: number
  verse: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface ReadingHistory {
  id: string
  bookId: string
  chapter: number
  verse: number
  scrollPosition: number
  updatedAt: string
}
