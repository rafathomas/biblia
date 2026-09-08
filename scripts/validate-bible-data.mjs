import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'
import { books } from './books.mjs'

const verseSchema = z.object({ verse: z.number().int().positive(), text: z.string().trim().min(1) })
const chapterSchema = (versionId) =>
  z.object({
    version: z.literal(versionId),
    book: z.string().min(2),
    chapter: z.number().int().positive(),
    verses: z.array(verseSchema).min(1)
  })

// BPM's chapter/search-index shape predates this generator (nested `book` object, `label` field)
// and isn't wired into the app yet — skipped here on purpose, see README TODO.
const skip = new Set(['bpm'])

async function validateVersion(folder, versionId) {
  const root = resolve('public/bible', folder)
  const schema = chapterSchema(versionId)
  let chapterTotal = 0
  let verseTotal = 0

  for (const [id, slug, , , , chapters] of books) {
    for (let chapter = 1; chapter <= chapters; chapter += 1) {
      const file = resolve(root, slug, `${chapter}.json`)
      const parsed = schema.parse(JSON.parse(await readFile(file, 'utf8')))
      if (parsed.book !== id || parsed.chapter !== chapter) throw new Error(`Referência inválida em ${file}`)
      const unique = new Set(parsed.verses.map((verse) => verse.verse))
      if (unique.size !== parsed.verses.length) throw new Error(`Versículo duplicado em ${file}`)
      chapterTotal += 1
      verseTotal += parsed.verses.length
    }
  }
  if (books.length !== 66 || chapterTotal !== 1189) throw new Error(`Cânon ou capítulos incompletos em ${folder}`)
  console.log(`${versionId}: 66 livros, ${chapterTotal} capítulos, ${verseTotal} versículos.`)
}

const root = resolve('public/bible')
const entries = await readdir(root, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory() || skip.has(entry.name)) continue
  const metadata = JSON.parse(await readFile(resolve(root, entry.name, 'metadata.json'), 'utf8'))
  await validateVersion(entry.name, metadata.version.abbreviation)
}
