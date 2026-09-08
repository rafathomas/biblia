import { getDatabase } from '@/lib/db/database'
import type { Favorite } from '@/types/user-data'

export async function listFavorites() {
  const items = await (await getDatabase()).getAllFromIndex('favorites', 'by-created')
  return items.reverse()
}

export async function getFavorite(id: string) {
  return (await getDatabase()).get('favorites', id)
}

export async function saveFavorite(favorite: Favorite) {
  await (await getDatabase()).put('favorites', favorite)
}

export async function removeFavorite(id: string) {
  await (await getDatabase()).delete('favorites', id)
}
