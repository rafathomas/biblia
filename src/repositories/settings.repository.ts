import { getDatabase } from '@/lib/db/database'
import type { ReaderSettings } from '@/types/user-data'

export const defaultSettings: ReaderSettings = {
  id: 'reader',
  fontSize: 19,
  lineHeight: 1.85,
  theme: 'system',
  readerTheme: 'paper',
  version: 'blivre'
}

export async function getSettings() {
  try {
    const stored = await (await getDatabase()).get('settings', 'reader')
    return stored ? { ...defaultSettings, ...stored } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export async function saveSettings(settings: ReaderSettings) {
  try {
    await (await getDatabase()).put('settings', settings)
  } catch (error) {
    if (import.meta.env.DEV) console.error('Não foi possível salvar as preferências.', error)
  }
}
