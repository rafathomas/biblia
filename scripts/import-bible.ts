import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, parse as parsePath, resolve } from 'node:path'

type Testament = 'old' | 'new'

interface BibleBookDefinition {
  id: string
  order: number
  name: string
  abbreviation: string
  slug: string
  testament: Testament
  chapters: number
}

interface BibleVerse {
  verse: number
  verseEnd?: number
  label: string
  text: string
}

interface ParsedBook {
  definition: BibleBookDefinition
  sourceFile: string
  chapters: Map<number, BibleVerse[]>
  omittedVerses: string[]
}

interface SearchVerse {
  b: string
  c: number
  v: number
  e?: number
  t: string
}

interface BibleMetadata {
  version: {
    id: string
    name: string
    abbreviation: string
    language: string
    license: string
    source: string
  }
  canon: 'protestant-66'
  books: BibleBookDefinition[]
  stats: {
    books: number
    chapters: number
    verses: number
  }
}

interface OfflineManifest {
  version: string
  files: string[]
}

interface ChapterPayload {
  version: string
  book: Pick<BibleBookDefinition, 'id' | 'name' | 'abbreviation' | 'slug' | 'testament'>
  chapter: number
  verses: BibleVerse[]
}

interface ParsedVerseLabel {
  verse: number
  verseEnd?: number
  label: string
}

const VERSION = {
  id: 'bpm',
  name: 'Bíblia Portuguesa Mundial',
  abbreviation: 'BPM',
  language: 'pt-BR',
  license: 'Public Domain',
  source: 'eBible.org'
} as const

const BOOKS: readonly BibleBookDefinition[] = [
  { id: 'GEN', order: 1, name: 'Gênesis', abbreviation: 'Gn', slug: 'genesis', testament: 'old', chapters: 50 },
  { id: 'EXO', order: 2, name: 'Êxodo', abbreviation: 'Êx', slug: 'exodo', testament: 'old', chapters: 40 },
  { id: 'LEV', order: 3, name: 'Levítico', abbreviation: 'Lv', slug: 'levitico', testament: 'old', chapters: 27 },
  { id: 'NUM', order: 4, name: 'Números', abbreviation: 'Nm', slug: 'numeros', testament: 'old', chapters: 36 },
  { id: 'DEU', order: 5, name: 'Deuteronômio', abbreviation: 'Dt', slug: 'deuteronomio', testament: 'old', chapters: 34 },
  { id: 'JOS', order: 6, name: 'Josué', abbreviation: 'Js', slug: 'josue', testament: 'old', chapters: 24 },
  { id: 'JDG', order: 7, name: 'Juízes', abbreviation: 'Jz', slug: 'juizes', testament: 'old', chapters: 21 },
  { id: 'RUT', order: 8, name: 'Rute', abbreviation: 'Rt', slug: 'rute', testament: 'old', chapters: 4 },
  { id: '1SA', order: 9, name: '1 Samuel', abbreviation: '1Sm', slug: '1-samuel', testament: 'old', chapters: 31 },
  { id: '2SA', order: 10, name: '2 Samuel', abbreviation: '2Sm', slug: '2-samuel', testament: 'old', chapters: 24 },
  { id: '1KI', order: 11, name: '1 Reis', abbreviation: '1Rs', slug: '1-reis', testament: 'old', chapters: 22 },
  { id: '2KI', order: 12, name: '2 Reis', abbreviation: '2Rs', slug: '2-reis', testament: 'old', chapters: 25 },
  { id: '1CH', order: 13, name: '1 Crônicas', abbreviation: '1Cr', slug: '1-cronicas', testament: 'old', chapters: 29 },
  { id: '2CH', order: 14, name: '2 Crônicas', abbreviation: '2Cr', slug: '2-cronicas', testament: 'old', chapters: 36 },
  { id: 'EZR', order: 15, name: 'Esdras', abbreviation: 'Ed', slug: 'esdras', testament: 'old', chapters: 10 },
  { id: 'NEH', order: 16, name: 'Neemias', abbreviation: 'Ne', slug: 'neemias', testament: 'old', chapters: 13 },
  { id: 'EST', order: 17, name: 'Ester', abbreviation: 'Et', slug: 'ester', testament: 'old', chapters: 10 },
  { id: 'JOB', order: 18, name: 'Jó', abbreviation: 'Jó', slug: 'jo', testament: 'old', chapters: 42 },
  { id: 'PSA', order: 19, name: 'Salmos', abbreviation: 'Sl', slug: 'salmos', testament: 'old', chapters: 150 },
  { id: 'PRO', order: 20, name: 'Provérbios', abbreviation: 'Pv', slug: 'proverbios', testament: 'old', chapters: 31 },
  { id: 'ECC', order: 21, name: 'Eclesiastes', abbreviation: 'Ec', slug: 'eclesiastes', testament: 'old', chapters: 12 },
  { id: 'SNG', order: 22, name: 'Cântico dos Cânticos', abbreviation: 'Ct', slug: 'cantico-dos-canticos', testament: 'old', chapters: 8 },
  { id: 'ISA', order: 23, name: 'Isaías', abbreviation: 'Is', slug: 'isaias', testament: 'old', chapters: 66 },
  { id: 'JER', order: 24, name: 'Jeremias', abbreviation: 'Jr', slug: 'jeremias', testament: 'old', chapters: 52 },
  { id: 'LAM', order: 25, name: 'Lamentações', abbreviation: 'Lm', slug: 'lamentacoes', testament: 'old', chapters: 5 },
  { id: 'EZK', order: 26, name: 'Ezequiel', abbreviation: 'Ez', slug: 'ezequiel', testament: 'old', chapters: 48 },
  { id: 'DAN', order: 27, name: 'Daniel', abbreviation: 'Dn', slug: 'daniel', testament: 'old', chapters: 12 },
  { id: 'HOS', order: 28, name: 'Oseias', abbreviation: 'Os', slug: 'oseias', testament: 'old', chapters: 14 },
  { id: 'JOL', order: 29, name: 'Joel', abbreviation: 'Jl', slug: 'joel', testament: 'old', chapters: 3 },
  { id: 'AMO', order: 30, name: 'Amós', abbreviation: 'Am', slug: 'amos', testament: 'old', chapters: 9 },
  { id: 'OBA', order: 31, name: 'Obadias', abbreviation: 'Ob', slug: 'obadias', testament: 'old', chapters: 1 },
  { id: 'JON', order: 32, name: 'Jonas', abbreviation: 'Jn', slug: 'jonas', testament: 'old', chapters: 4 },
  { id: 'MIC', order: 33, name: 'Miqueias', abbreviation: 'Mq', slug: 'miqueias', testament: 'old', chapters: 7 },
  { id: 'NAM', order: 34, name: 'Naum', abbreviation: 'Na', slug: 'naum', testament: 'old', chapters: 3 },
  { id: 'HAB', order: 35, name: 'Habacuque', abbreviation: 'Hc', slug: 'habacuque', testament: 'old', chapters: 3 },
  { id: 'ZEP', order: 36, name: 'Sofonias', abbreviation: 'Sf', slug: 'sofonias', testament: 'old', chapters: 3 },
  { id: 'HAG', order: 37, name: 'Ageu', abbreviation: 'Ag', slug: 'ageu', testament: 'old', chapters: 2 },
  { id: 'ZEC', order: 38, name: 'Zacarias', abbreviation: 'Zc', slug: 'zacarias', testament: 'old', chapters: 14 },
  { id: 'MAL', order: 39, name: 'Malaquias', abbreviation: 'Ml', slug: 'malaquias', testament: 'old', chapters: 4 },
  { id: 'MAT', order: 40, name: 'Mateus', abbreviation: 'Mt', slug: 'mateus', testament: 'new', chapters: 28 },
  { id: 'MRK', order: 41, name: 'Marcos', abbreviation: 'Mc', slug: 'marcos', testament: 'new', chapters: 16 },
  { id: 'LUK', order: 42, name: 'Lucas', abbreviation: 'Lc', slug: 'lucas', testament: 'new', chapters: 24 },
  { id: 'JHN', order: 43, name: 'João', abbreviation: 'Jo', slug: 'joao', testament: 'new', chapters: 21 },
  { id: 'ACT', order: 44, name: 'Atos', abbreviation: 'At', slug: 'atos', testament: 'new', chapters: 28 },
  { id: 'ROM', order: 45, name: 'Romanos', abbreviation: 'Rm', slug: 'romanos', testament: 'new', chapters: 16 },
  { id: '1CO', order: 46, name: '1 Coríntios', abbreviation: '1Co', slug: '1-corintios', testament: 'new', chapters: 16 },
  { id: '2CO', order: 47, name: '2 Coríntios', abbreviation: '2Co', slug: '2-corintios', testament: 'new', chapters: 13 },
  { id: 'GAL', order: 48, name: 'Gálatas', abbreviation: 'Gl', slug: 'galatas', testament: 'new', chapters: 6 },
  { id: 'EPH', order: 49, name: 'Efésios', abbreviation: 'Ef', slug: 'efesios', testament: 'new', chapters: 6 },
  { id: 'PHP', order: 50, name: 'Filipenses', abbreviation: 'Fp', slug: 'filipenses', testament: 'new', chapters: 4 },
  { id: 'COL', order: 51, name: 'Colossenses', abbreviation: 'Cl', slug: 'colossenses', testament: 'new', chapters: 4 },
  { id: '1TH', order: 52, name: '1 Tessalonicenses', abbreviation: '1Ts', slug: '1-tessalonicenses', testament: 'new', chapters: 5 },
  { id: '2TH', order: 53, name: '2 Tessalonicenses', abbreviation: '2Ts', slug: '2-tessalonicenses', testament: 'new', chapters: 3 },
  { id: '1TI', order: 54, name: '1 Timóteo', abbreviation: '1Tm', slug: '1-timoteo', testament: 'new', chapters: 6 },
  { id: '2TI', order: 55, name: '2 Timóteo', abbreviation: '2Tm', slug: '2-timoteo', testament: 'new', chapters: 4 },
  { id: 'TIT', order: 56, name: 'Tito', abbreviation: 'Tt', slug: 'tito', testament: 'new', chapters: 3 },
  { id: 'PHM', order: 57, name: 'Filemom', abbreviation: 'Fm', slug: 'filemom', testament: 'new', chapters: 1 },
  { id: 'HEB', order: 58, name: 'Hebreus', abbreviation: 'Hb', slug: 'hebreus', testament: 'new', chapters: 13 },
  { id: 'JAS', order: 59, name: 'Tiago', abbreviation: 'Tg', slug: 'tiago', testament: 'new', chapters: 5 },
  { id: '1PE', order: 60, name: '1 Pedro', abbreviation: '1Pe', slug: '1-pedro', testament: 'new', chapters: 5 },
  { id: '2PE', order: 61, name: '2 Pedro', abbreviation: '2Pe', slug: '2-pedro', testament: 'new', chapters: 3 },
  { id: '1JN', order: 62, name: '1 João', abbreviation: '1Jo', slug: '1-joao', testament: 'new', chapters: 5 },
  { id: '2JN', order: 63, name: '2 João', abbreviation: '2Jo', slug: '2-joao', testament: 'new', chapters: 1 },
  { id: '3JN', order: 64, name: '3 João', abbreviation: '3Jo', slug: '3-joao', testament: 'new', chapters: 1 },
  { id: 'JUD', order: 65, name: 'Judas', abbreviation: 'Jd', slug: 'judas', testament: 'new', chapters: 1 },
  { id: 'REV', order: 66, name: 'Apocalipse', abbreviation: 'Ap', slug: 'apocalipse', testament: 'new', chapters: 22 }
]

const BOOK_BY_ID = new Map(BOOKS.map((book) => [book.id, book]))
const REMOVED_BLOCK_SENTINEL = '\uE000USFM_REMOVED_BLOCK\uE001'
const ACCEPTED_EXTENSIONS = new Set(['.usfm', '.sfm', '.txt'])
const HEADING_MARKERS = new Set([
  'id', 'ide', 'h', 'toc1', 'toc2', 'toc3', 'mt', 'mt1', 'mt2', 'mt3',
  'ms', 'ms1', 'ms2', 's', 's1', 's2', 's3', 'sr', 'r', 'd', 'sp', 'cl',
  'cp', 'ip', 'is', 'is1', 'is2'
])
const CONTINUATION_MARKERS = new Set([
  'p', 'm', 'mi', 'nb', 'pc', 'pr', 'q', 'q1', 'q2', 'q3', 'q4', 'pi',
  'pi1', 'pi2', 'pi3', 'li', 'li1', 'li2', 'li3', 'li4'
])

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else if (entry.isFile() && ACCEPTED_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(fullPath)
  }
  return files.sort((left, right) => left.localeCompare(right))
}

function extractBookId(usfm: string): string | undefined {
  return usfm.replace(/^\uFEFF/, '').match(/^\\id\s+([A-Za-z0-9]{3})\b/m)?.[1]?.toUpperCase()
}

function preprocessUsfm(usfm: string): string {
  return usfm
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\\f\b[\s\S]*?\\f\*/g, ` ${REMOVED_BLOCK_SENTINEL} `)
    .replace(/\\x\b[\s\S]*?\\x\*/g, ` ${REMOVED_BLOCK_SENTINEL} `)
    .replace(/\\fig\b[\s\S]*?\\fig\*/g, ` ${REMOVED_BLOCK_SENTINEL} `)
}

function normalizeText(text: string): string {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/[\t\n\r ]+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([([{“‘])\s+/g, '$1')
    .trim()
}

function cleanInlineUsfm(text: string): string {
  const withoutRemovedBlocks = text.replaceAll(REMOVED_BLOCK_SENTINEL, ' ')
  const withoutWordMetadata = withoutRemovedBlocks.replace(
    /\\\+?w\s+([^|\\]+?)(?:\|[^\\]*?)?\\\+?w\*/g,
    '$1'
  )
  return normalizeText(withoutWordMetadata.replace(/\\\+?[A-Za-z][A-Za-z0-9-]*\*?/g, ' '))
}

function parseVerseLabel(rawLabel: string): ParsedVerseLabel {
  const label = rawLabel.trim().replace('–', '-')
  const range = label.match(/^(\d+)-(\d+)$/)
  if (range) {
    const verse = Number(range[1])
    const verseEnd = Number(range[2])
    if (verse < 1 || verseEnd < verse) throw new Error(`Intervalo de versículo inválido: ${rawLabel}`)
    return { verse, verseEnd, label: `${verse}-${verseEnd}` }
  }
  const single = label.match(/^(\d+)([a-z])?$/i)
  if (!single) throw new Error(`Rótulo de versículo inválido: ${rawLabel}`)
  const verse = Number(single[1])
  if (verse < 1) throw new Error(`Versículo inválido: ${rawLabel}`)
  return { verse, label: `${verse}${single[2]?.toLowerCase() ?? ''}` }
}

function appendVerseText(
  verse: BibleVerse | undefined,
  segment: string,
  removedBlockVerses: WeakSet<BibleVerse>
): void {
  if (!verse) return
  if (segment.includes(REMOVED_BLOCK_SENTINEL)) removedBlockVerses.add(verse)
  const cleanSegment = cleanInlineUsfm(segment)
  if (cleanSegment) verse.text = normalizeText(`${verse.text} ${cleanSegment}`)
}

function parseBook(usfm: string, definition: BibleBookDefinition, sourceFile: string): ParsedBook {
  const chapters = new Map<number, BibleVerse[]>()
  const removedBlockVerses = new WeakSet<BibleVerse>()
  const lines = preprocessUsfm(usfm).split('\n')
  let currentChapter: number | undefined
  let currentVerse: BibleVerse | undefined

  for (const originalLine of lines) {
    const line = originalLine.trim()
    if (!line) continue

    const chapterMatch = line.match(/^\\c\s+(\d+)\b/)
    if (chapterMatch) {
      currentChapter = Number(chapterMatch[1])
      currentVerse = undefined
      if (!chapters.has(currentChapter)) chapters.set(currentChapter, [])
      continue
    }

    const verseMatch = line.match(/^\\v\s+([^\s]+)(?:\s+([\s\S]*))?$/)
    if (verseMatch) {
      if (!currentChapter) throw new Error(`${definition.name}: versículo antes do primeiro capítulo em ${sourceFile}`)
      const parsedLabel = parseVerseLabel(verseMatch[1])
      currentVerse = { ...parsedLabel, text: cleanInlineUsfm(verseMatch[2] ?? '') }
      if ((verseMatch[2] ?? '').includes(REMOVED_BLOCK_SENTINEL)) removedBlockVerses.add(currentVerse)
      chapters.get(currentChapter)?.push(currentVerse)
      continue
    }

    const markerMatch = line.match(/^\\(\+?[A-Za-z][A-Za-z0-9-]*)(?:\s+([\s\S]*))?$/)
    if (markerMatch) {
      const marker = markerMatch[1].replace(/^\+/, '').toLowerCase()
      const content = markerMatch[2] ?? ''
      if (HEADING_MARKERS.has(marker)) {
        currentVerse = undefined
        continue
      }
      if (marker === 'b') continue
      if (CONTINUATION_MARKERS.has(marker)) appendVerseText(currentVerse, content, removedBlockVerses)
      else appendVerseText(currentVerse, line, removedBlockVerses)
      continue
    }

    appendVerseText(currentVerse, line, removedBlockVerses)
  }

  const omittedVerses: string[] = []
  for (const [chapter, verses] of chapters) {
    chapters.set(chapter, verses.filter((verse) => {
      const isEditorialOmission = !verse.text.trim() && removedBlockVerses.has(verse)
      if (isEditorialOmission) omittedVerses.push(`${definition.name} ${chapter}:${verse.label}`)
      return !isEditorialOmission
    }))
  }

  return { definition, sourceFile, chapters, omittedVerses }
}

function validateBook(book: ParsedBook): string[] {
  const errors: string[] = []
  const chapterNumbers = [...book.chapters.keys()].sort((left, right) => left - right)
  if (chapterNumbers.length !== book.definition.chapters) {
    errors.push(`${book.definition.name} esperado: ${book.definition.chapters}; encontrado: ${chapterNumbers.length}.`)
  }
  for (let chapter = 1; chapter <= book.definition.chapters; chapter += 1) {
    const verses = book.chapters.get(chapter)
    if (!verses) {
      errors.push(`${book.definition.name}: capítulo ${chapter} ausente.`)
      continue
    }
    if (verses.length === 0) errors.push(`${book.definition.name} ${chapter}: capítulo sem versículos.`)
    const labels = new Set<string>()
    for (const verse of verses) {
      if (!verse.text.trim()) errors.push(`${book.definition.name} ${chapter}:${verse.label}: versículo vazio.`)
      if (labels.has(verse.label)) errors.push(`${book.definition.name} ${chapter}:${verse.label}: versículo duplicado.`)
      labels.add(verse.label)
      if (verse.verseEnd !== undefined && verse.verseEnd < verse.verse) {
        errors.push(`${book.definition.name} ${chapter}:${verse.label}: intervalo inválido.`)
      }
    }
  }
  const extraChapters = chapterNumbers.filter((chapter) => chapter > book.definition.chapters)
  if (extraChapters.length) errors.push(`${book.definition.name}: capítulos extras ${extraChapters.join(', ')}.`)
  return errors
}

async function writeJson(filePath: string, value: unknown, pretty = false): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(value, null, pretty ? 2 : undefined)}\n`, 'utf8')
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return false
    throw error
  }
}

function assertSafeOutputPath(outputRoot: string): void {
  const parsed = parsePath(outputRoot)
  if (outputRoot === parsed.root || parsed.base.length < 2) {
    throw new Error(`Diretório de saída inseguro: ${outputRoot}`)
  }
}

async function writeImport(parsedBooks: ParsedBook[], outputRoot: string): Promise<{ files: number; verses: number }> {
  assertSafeOutputPath(outputRoot)
  const stagingRoot = `${outputRoot}.tmp-${process.pid}`
  const backupRoot = `${outputRoot}.backup-${process.pid}`
  await rm(stagingRoot, { recursive: true, force: true })
  await rm(backupRoot, { recursive: true, force: true })
  await mkdir(stagingRoot, { recursive: true })

  const searchIndex: SearchVerse[] = []
  const offlineFiles = ['/bible/bpm/metadata.json', '/bible/bpm/search-index.json']
  let chapterTotal = 0
  let verseTotal = 0

  try {
    for (const book of parsedBooks) {
      for (let chapter = 1; chapter <= book.definition.chapters; chapter += 1) {
        const verses = book.chapters.get(chapter)
        if (!verses) throw new Error(`${book.definition.name}: capítulo ${chapter} ausente durante a escrita.`)
        const payload: ChapterPayload = {
          version: VERSION.abbreviation,
          book: {
            id: book.definition.id,
            name: book.definition.name,
            abbreviation: book.definition.abbreviation,
            slug: book.definition.slug,
            testament: book.definition.testament
          },
          chapter,
          verses
        }
        await writeJson(resolve(stagingRoot, book.definition.slug, `${chapter}.json`), payload)
        offlineFiles.push(`/bible/bpm/${book.definition.slug}/${chapter}.json`)
        for (const verse of verses) {
          searchIndex.push({
            b: book.definition.id,
            c: chapter,
            v: verse.verse,
            ...(verse.verseEnd === undefined ? {} : { e: verse.verseEnd }),
            t: verse.text
          })
        }
        chapterTotal += 1
        verseTotal += verses.length
      }
    }

    const metadata: BibleMetadata = {
      version: { ...VERSION },
      canon: 'protestant-66',
      books: parsedBooks.map((book) => ({ ...book.definition })),
      stats: { books: parsedBooks.length, chapters: chapterTotal, verses: verseTotal }
    }
    const manifest: OfflineManifest = { version: 'bpm-1', files: offlineFiles }
    await writeJson(resolve(stagingRoot, 'metadata.json'), metadata, true)
    await writeJson(resolve(stagingRoot, 'search-index.json'), searchIndex)
    await writeJson(resolve(stagingRoot, 'offline-manifest.json'), manifest, true)

    const hadExistingOutput = await pathExists(outputRoot)
    if (hadExistingOutput) await rename(outputRoot, backupRoot)
    try {
      await rename(stagingRoot, outputRoot)
      if (hadExistingOutput) await rm(backupRoot, { recursive: true, force: true })
    } catch (error: unknown) {
      if (hadExistingOutput && await pathExists(backupRoot) && !await pathExists(outputRoot)) {
        await rename(backupRoot, outputRoot)
      }
      throw error
    }
    return { files: chapterTotal + 3, verses: verseTotal }
  } catch (error: unknown) {
    await rm(stagingRoot, { recursive: true, force: true })
    throw error
  }
}

async function main(): Promise<void> {
  const inputRoot = resolve(process.argv[2] ?? 'data/bpm-usfm')
  const outputRoot = resolve(process.argv[3] ?? 'public/bible/bpm')
  console.log('\n📖 Importador BPM → JSON\n')
  console.log(`Entrada: ${inputRoot}`)
  console.log(`Saída:   ${outputRoot}\n`)

  const files = await walk(inputRoot)
  console.log(`Encontrados ${files.length} arquivos USFM/SFM/TXT.\n`)
  if (files.length === 0) throw new Error('Nenhum arquivo USFM, SFM ou TXT encontrado.')

  const parsedById = new Map<string, ParsedBook>()
  const ignoredIds = new Set<string>()
  const filesWithoutId: string[] = []

  for (const file of files) {
    const usfm = await readFile(file, 'utf8')
    const bookId = extractBookId(usfm)
    if (!bookId) {
      filesWithoutId.push(file)
      continue
    }
    const definition = BOOK_BY_ID.get(bookId)
    if (!definition) {
      ignoredIds.add(bookId)
      continue
    }
    if (parsedById.has(bookId)) throw new Error(`Livro duplicado na entrada: ${bookId}.`)
    console.log(`→ Processando ${definition.name}`)
    parsedById.set(bookId, parseBook(usfm, definition, file))
  }

  const missingBooks = BOOKS.filter((book) => !parsedById.has(book.id))
  const validationErrors = BOOKS.flatMap((definition) => {
    const parsed = parsedById.get(definition.id)
    return parsed ? validateBook(parsed) : []
  })

  if (missingBooks.length) {
    validationErrors.unshift(`Livros ausentes:\n${missingBooks.map((book) => `- ${book.name} (${book.id})`).join('\n')}`)
  }
  if (validationErrors.length) throw new Error(validationErrors.join('\n'))

  const parsedBooks = BOOKS.map((book) => parsedById.get(book.id)).filter((book): book is ParsedBook => book !== undefined)
  const omittedVerses = parsedBooks.flatMap((book) => book.omittedVerses)
  console.log('\n✅ Todos os 66 livros foram encontrados e validados.')
  if (omittedVerses.length) {
    console.log(`ℹ️  ${omittedVerses.length} marcadores sem texto, compostos apenas por nota editorial, foram omitidos:`)
    console.log(omittedVerses.map((reference) => `   ${reference}`).join('\n'))
  }
  const result = await writeImport(parsedBooks, outputRoot)

  console.log('\n🎉 Importação concluída.\n')
  console.log(`Livros:     ${parsedBooks.length}`)
  console.log(`Capítulos:  ${parsedBooks.reduce((total, book) => total + book.chapters.size, 0)}`)
  console.log(`Versículos: ${result.verses}`)
  console.log(`Arquivos:   ${result.files}`)
  console.log(`\nLivros fora do cânon ignorados: ${[...ignoredIds].sort().join(', ') || 'nenhum'}`)
  if (filesWithoutId.length) console.log(`Arquivos sem marcador \\id ignorados: ${filesWithoutId.length}`)
}

main().catch((error: unknown) => {
  console.error('\n❌ Falha ao importar a Bíblia.')
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
