import { chapterSchema, noteContentSchema } from './bible'

describe('schemas', () => {
  it('aceita capítulo válido', () => expect(chapterSchema.safeParse({ version: 'BLIVRE', book: 'JHN', chapter: 3, verses: [{ verse: 16, text: 'Porque Deus amou o mundo.' }] }).success).toBe(true))
  it('rejeita versículo vazio', () => expect(chapterSchema.safeParse({ version: 'BLIVRE', book: 'JHN', chapter: 3, verses: [{ verse: 16, text: '' }] }).success).toBe(false))
  it('aceita outras versões suportadas', () => expect(chapterSchema.safeParse({ version: 'NVI', book: 'JHN', chapter: 3, verses: [{ verse: 16, text: 'Porque Deus amou o mundo.' }] }).success).toBe(true))
  it('rejeita versão desconhecida', () => expect(chapterSchema.safeParse({ version: 'KJV', book: 'JHN', chapter: 3, verses: [{ verse: 16, text: 'x' }] }).success).toBe(false))
  it('rejeita nota vazia', () => expect(noteContentSchema.safeParse('  ').success).toBe(false))
})
