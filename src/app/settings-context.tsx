import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { defaultSettings, getSettings, saveSettings } from '@/repositories/settings.repository'
import type { ReaderSettings } from '@/types/user-data'

interface SettingsContextValue {
  settings: ReaderSettings
  updateSettings: (updates: Partial<ReaderSettings>) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => { void getSettings().then(setSettings) }, [])

  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = settings.theme === 'dark' || (settings.theme === 'system' && systemDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
    document.documentElement.style.setProperty('--reader-font-size', `${settings.fontSize}px`)
    document.documentElement.style.setProperty('--reader-line-height', `${settings.lineHeight}`)
  }, [settings])

  function updateSettings(updates: Partial<ReaderSettings>) {
    setSettings((current) => {
      const next = { ...current, ...updates }
      void saveSettings(next)
      return next
    })
  }

  return <SettingsContext value={{ settings, updateSettings }}>{children}</SettingsContext>
}

export function useSettings() {
  const context = use(SettingsContext)
  if (!context) throw new Error('useSettings precisa estar dentro de SettingsProvider')
  return context
}
