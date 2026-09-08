import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { books } from './books.mjs'

const sourceRoot = resolve(process.argv[2] ?? '/private/tmp/biblialivre-source/textos/f4/tr')
const outputRoot = resolve('public/bible/blivre')
const searchIndex = []

function extractVerses(raw) {
  const withoutNotes = raw
    .replace(/^\uFEFF/, '')
    .replace(/\\fn[\s\S]*?\\\*fn/g, ' ')
    .replace(/\\key[\s\S]*?\\\*key/g, ' ')
    .replace(/\\added\s*([\s\S]*?)\\\*added/g, '$1')
    .replace(/\\[\w-]+\s*\n/g, ' ')
  const matches = [...withoutNotes.matchAll(/\\v\s+[^.]+\.(\d+)\.(\d+)\s*\n([\s\S]*?)(?=\\v\s+|$)/g)]
  return matches
    .map((match) => ({
      chapter: Number(match[1]),
      verse: Number(match[2]),
      text: match[3].replace(/\\\*?[\w-]+/g, ' ').replace(/\s+/g, ' ').trim()
    }))
    .filter((verse) => verse.text.length > 0)
}

await mkdir(outputRoot, { recursive: true })
const metadata = books.map(([id, slug, name, abbreviation, , chapters, testament], index) => ({
  id,
  slug,
  order: index + 1,
  name,
  abbreviation,
  testament,
  chapters
}))
await mkdir(resolve('src/data'), { recursive: true })
await writeFile(
  resolve('src/data/books.generated.ts'),
  `import type { BibleBook } from '@/types/bible'\n\nexport const bibleBooks = ${JSON.stringify(metadata, null, 2)} as const satisfies readonly BibleBook[]\n`
)

for (const [id, slug, , , sourceFile, chapterCount] of books) {
  const raw = await readFile(join(sourceRoot, `${sourceFile}.txt`), 'utf8')
  const verses = extractVerses(raw)
  const target = join(outputRoot, slug)
  await mkdir(target, { recursive: true })
  for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
    const chapterVerses = verses
      .filter((verse) => verse.chapter === chapter)
      .map(({ verse, text }) => ({ verse, text }))
    if (chapterVerses.length === 0) throw new Error(`Capítulo vazio: ${id} ${chapter}`)
    const payload = { version: 'BLIVRE', book: id, chapter, verses: chapterVerses }
    await writeFile(join(target, `${chapter}.json`), `${JSON.stringify(payload)}\n`)
    chapterVerses.forEach(({ verse, text }) => searchIndex.push({ bookId: id, chapter, verse, text }))
  }
}

await writeFile(join(outputRoot, 'metadata.json'), `${JSON.stringify({ version: {
  id: 'blivre', name: 'Bíblia Livre', abbreviation: 'BLIVRE', language: 'pt-BR',
  license: 'CC BY 3.0 BR', attribution: 'Bíblia Livre © Diego Santos, Mario Sérgio e Marco Teles — fevereiro de 2018.'
}, books: metadata }, null, 2)}\n`)
await writeFile(join(outputRoot, 'search-index.json'), `${JSON.stringify(searchIndex)}\n`)
console.log(`Gerados ${metadata.length} livros, ${books.reduce((sum, book) => sum + book[5], 0)} capítulos e ${searchIndex.length} versículos.`)
