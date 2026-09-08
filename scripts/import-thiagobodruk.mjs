import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { books } from './books.mjs'

const sourceRoot = resolve(
  process.argv[2] ??
    '/private/tmp/claude-501/-Users-rafaelthomas-Desktop-Biblia/63def2c3-f280-43cc-a0a4-3b2293d53409/scratchpad/biblia'
)

const attribution =
  'Traduções bíblicas de autoria e propriedade intelectual da Sociedade Bíblica Internacional (NVI), da Sociedade Bíblica Trinitariana (ACF) e da Imprensa Bíblica Brasileira (AA). Todos os direitos reservados aos autores.'

const translations = [
  { id: 'acf', versionId: 'ACF', name: 'Almeida Corrigida e Fiel', file: 'acf.json' },
  { id: 'aa', versionId: 'AA', name: 'Almeida Revisada Imprensa Bíblica', file: 'aa.json' },
  { id: 'nvi', versionId: 'NVI', name: 'Nova Versão Internacional', file: 'nvi.json' }
]

for (const translation of translations) {
  const raw = await readFile(join(sourceRoot, 'json', translation.file), 'utf8')
  const source = JSON.parse(raw.replace(/^﻿/, ''))
  const outputRoot = resolve('public/bible', translation.id)
  await mkdir(outputRoot, { recursive: true })
  const searchIndex = []
  let chapterTotal = 0

  for (const [bookIndex, [id, slug, , , , chapterCount]] of books.entries()) {
    const sourceBook = source[bookIndex]
    if (!sourceBook || sourceBook.chapters.length !== chapterCount) {
      throw new Error(`Livro divergente em ${translation.id}: ${id}`)
    }
    const target = join(outputRoot, slug)
    await mkdir(target, { recursive: true })
    for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
      const chapterVerses = sourceBook.chapters[chapter - 1]
        .map((text, verseIndex) => ({ verse: verseIndex + 1, text: text.trim() }))
        .filter((verse) => verse.text.length > 0)
      if (chapterVerses.length === 0) throw new Error(`Capítulo vazio: ${translation.id} ${id} ${chapter}`)
      const payload = { version: translation.versionId, book: id, chapter, verses: chapterVerses }
      await writeFile(join(target, `${chapter}.json`), `${JSON.stringify(payload)}\n`)
      chapterVerses.forEach(({ verse, text }) => searchIndex.push({ bookId: id, chapter, verse, text }))
      chapterTotal += 1
    }
  }

  const metadata = books.map(([id, slug, name, abbreviation, , chapters, testament], order) => ({
    id,
    slug,
    order: order + 1,
    name,
    abbreviation,
    testament,
    chapters
  }))
  await writeFile(
    join(outputRoot, 'metadata.json'),
    `${JSON.stringify(
      {
        version: {
          id: translation.id,
          name: translation.name,
          abbreviation: translation.versionId,
          language: 'pt-BR',
          license: 'CC BY-NC (uso não comercial)',
          attribution
        },
        books: metadata
      },
      null,
      2
    )}\n`
  )
  await writeFile(join(outputRoot, 'search-index.json'), `${JSON.stringify(searchIndex)}\n`)
  console.log(`${translation.versionId}: ${metadata.length} livros, ${chapterTotal} capítulos, ${searchIndex.length} versículos.`)
}
