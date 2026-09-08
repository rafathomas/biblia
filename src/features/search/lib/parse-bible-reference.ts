import { bibleBooks } from '@/data/books.generated'
import { normalizeText } from '@/lib/utils'
import type { BibleReference } from '@/types/bible'

const extraAliases: Record<string, string[]> = {
  GEN: ['gen'], EXO: ['ex'], LEV: ['lev'], NUM: ['num'], DEU: ['deut'], JOS: ['jos'],
  JDG: ['jz', 'juiz'], RUT: ['rt'], PSA: ['salmo', 'sal', 'sl'], PRO: ['prov', 'pv'],
  ECC: ['ecl', 'ec'], SNG: ['canticos', 'cantico', 'ct'], ISA: ['is'], JER: ['jr'],
  LAM: ['lm'], EZK: ['ez'], DAN: ['dn'], HOS: ['os'], JOL: ['jl'], AMO: ['am'],
  OBA: ['ob'], JON: ['jn'], MIC: ['mq'], NAM: ['na'], HAB: ['hc'], ZEP: ['sf'],
  HAG: ['ag'], ZEC: ['zc'], MAL: ['ml'], MAT: ['mt'], MRK: ['mc'], LUK: ['lc'],
  JHN: ['jo', 'joh', 'jhn'], ACT: ['at'], ROM: ['rm'], EPH: ['ef'], PHP: ['fp'],
  COL: ['cl'], TIT: ['tt'], PHM: ['fm'], HEB: ['hb'], JAS: ['tg'], JUD: ['jd'], REV: ['ap']
}

const aliases = bibleBooks.flatMap((book) => {
  const values = [book.name, book.abbreviation, book.slug.replaceAll('-', ' '), ...(extraAliases[book.id] ?? [])]
  return [...new Set(values.map(normalizeText))].map((alias) => ({ alias, book }))
}).sort((a, b) => b.alias.length - a.alias.length)

export function parseBibleReference(input: string): BibleReference | undefined {
  const raw = input.trim()
  const normalized = normalizeText(raw).replace(/^(i{1,3})\s+/, (_, roman: string) => `${roman.length} `)
  const forcedJob = /^jó(?:\s|$)/i.test(raw)
  const match = aliases.find(({ alias, book }) => {
    if (forcedJob) return book.id === 'JOB' && alias === 'jo'
    if (!forcedJob && alias === 'jo' && book.id === 'JOB') return false
    return normalized === alias || normalized.startsWith(`${alias} `)
  })
  if (!match) return undefined
  const remainder = normalized.slice(match.alias.length).trim()
  const numbers = remainder.match(/^(\d{1,3})(?:\s*[:.,-]?\s*(\d{1,3}))?(?:\s*[-–]\s*(\d{1,3}))?$/)
  if (!numbers) return undefined
  const chapter = Number(numbers[1])
  const verse = numbers[2] ? Number(numbers[2]) : undefined
  const endVerse = numbers[3] ? Number(numbers[3]) : undefined
  if (chapter < 1 || chapter > match.book.chapters || verse === 0 || endVerse === 0) return undefined
  return { bookId: match.book.id, chapter, verse, endVerse }
}
