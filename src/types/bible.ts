export type Testament = 'old' | 'new'

export interface BibleBook {
  id: string
  slug: string
  order: number
  name: string
  abbreviation: string
  testament: Testament
  chapters: number
}

export interface BibleVerse {
  verse: number
  text: string
}

export type BibleVersionId = 'blivre' | 'acf' | 'aa' | 'nvi'

export interface BibleChapter {
  version: 'BLIVRE' | 'ACF' | 'AA' | 'NVI'
  book: string
  chapter: number
  verses: BibleVerse[]
}

export interface BibleReference {
  bookId: string
  chapter: number
  verse?: number
  endVerse?: number
}

export interface BibleVersion {
  id: BibleVersionId
  name: string
  abbreviation: string
  language: string
  license: string
  attribution: string
}

export interface SearchResult extends Required<Omit<BibleReference, 'endVerse'>> {
  text: string
}
