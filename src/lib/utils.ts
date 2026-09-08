import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[ªº.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function makeReferenceId(bookId: string, chapter: number, verse: number, endVerse?: number) {
  return `${bookId}-${chapter}-${verse}${endVerse && endVerse !== verse ? `-${endVerse}` : ''}`
}
