import { clearDatabaseForTests } from '@/lib/db/database'
import { getFavorite, removeFavorite, saveFavorite } from './favorites.repository'
import { getLastReading, saveReading } from './reading-history.repository'

beforeEach(() => clearDatabaseForTests())

describe('repositories', () => {
  it('salva e remove favorito', async () => {
    const favorite = { id: 'JHN-3-16', bookId: 'JHN', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo.', createdAt: new Date().toISOString() }
    await saveFavorite(favorite)
    expect(await getFavorite(favorite.id)).toEqual(favorite)
    await removeFavorite(favorite.id)
    expect(await getFavorite(favorite.id)).toBeUndefined()
  })

  it('recupera última leitura', async () => {
    const reading = { id: 'JHN', bookId: 'JHN', chapter: 3, verse: 16, scrollPosition: 900, updatedAt: new Date().toISOString() }
    await saveReading(reading)
    expect(await getLastReading()).toEqual(reading)
  })
})
