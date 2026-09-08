import { parseBibleReference } from './parse-bible-reference'

describe('parseBibleReference', () => {
  it.each([
    ['João 3:16', { bookId: 'JHN', chapter: 3, verse: 16, endVerse: undefined }],
    ['joao 3:16', { bookId: 'JHN', chapter: 3, verse: 16, endVerse: undefined }],
    ['Jo 3 16', { bookId: 'JHN', chapter: 3, verse: 16, endVerse: undefined }],
    ['Jó 1:1', { bookId: 'JOB', chapter: 1, verse: 1, endVerse: undefined }],
    ['1Co 13:4', { bookId: '1CO', chapter: 13, verse: 4, endVerse: undefined }],
    ['Salmos 23', { bookId: 'PSA', chapter: 23, verse: undefined, endVerse: undefined }],
    ['Gn 1:1', { bookId: 'GEN', chapter: 1, verse: 1, endVerse: undefined }]
  ])('interpreta %s', (input, expected) => expect(parseBibleReference(input)).toEqual(expected))

  it('rejeita capítulo inexistente', () => expect(parseBibleReference('João 99:1')).toBeUndefined())
})
