import { useEffect, useState } from 'react'
import { Check, Cloud, Minus, Moon, Plus, Smartphone, Sun } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/app/settings-context'
import { bibleVersions } from '@/data/bible-versions'
import type { BibleVersionId } from '@/types/bible'
import type { ReaderTheme, Theme } from '@/types/user-data'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [offlineReady, setOfflineReady] = useState(false)
  useEffect(() => { if ('serviceWorker' in navigator) void navigator.serviceWorker.ready.then(() => setOfflineReady(true)) }, [])

  return (
    <PageShell eyebrow="Preferências" title="Configurações" description="Ajuste a leitura ao seu conforto. As escolhas ficam salvas neste dispositivo." width="reading">
      <div className="mt-10 space-y-10">
        <section aria-labelledby="text-title"><h2 id="text-title" className="text-lg font-bold">Texto da leitura</h2><p className="mt-1 text-sm text-muted-foreground">Tamanho e espaçamento dos versículos.</p>
          <div className="mt-5 rounded-2xl border bg-surface p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Tamanho</span><div className="flex items-center gap-3"><Button variant="secondary" size="icon" aria-label="Diminuir texto" disabled={settings.fontSize <= 16} onClick={() => updateSettings({ fontSize: settings.fontSize - 1 })}><Minus className="size-4" /></Button><span className="w-10 text-center font-bold">{settings.fontSize}</span><Button variant="secondary" size="icon" aria-label="Aumentar texto" disabled={settings.fontSize >= 28} onClick={() => updateSettings({ fontSize: settings.fontSize + 1 })}><Plus className="size-4" /></Button></div></div>
            <div className="mt-6"><span className="text-sm font-semibold">Espaçamento</span><div className="mt-3 grid grid-cols-3 gap-2">{([{ label: 'Compacto', value: 1.55 }, { label: 'Normal', value: 1.75 }, { label: 'Confortável', value: 1.95 }]).map((option) => <Choice key={option.label} selected={settings.lineHeight === option.value} label={option.label} onClick={() => updateSettings({ lineHeight: option.value })} />)}</div></div>
          </div>
        </section>

        <section aria-labelledby="version-title"><h2 id="version-title" className="text-lg font-bold">Tradução</h2><p className="mt-1 text-sm text-muted-foreground">Escolha a versão do texto bíblico.</p>
          <div className="mt-4 space-y-2">
            {bibleVersions.map((version) => (
              <button key={version.id} onClick={() => updateSettings({ version: version.id as BibleVersionId })} aria-pressed={settings.version === version.id} className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${settings.version === version.id ? 'border-primary bg-muted' : 'bg-surface hover:bg-muted'}`}>
                <span><span className="block text-sm font-bold">{version.name} ({version.abbreviation})</span><span className="mt-1 block text-xs text-muted-foreground">{version.license}</span></span>
                {settings.version === version.id && <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="app-theme-title"><h2 id="app-theme-title" className="text-lg font-bold">Tema do aplicativo</h2><div className="mt-4 grid grid-cols-3 gap-2">{([{ label: 'Claro', value: 'light' as Theme, icon: Sun }, { label: 'Escuro', value: 'dark' as Theme, icon: Moon }, { label: 'Sistema', value: 'system' as Theme, icon: Smartphone }]).map((option) => <Choice key={option.value} icon={option.icon} selected={settings.theme === option.value} label={option.label} onClick={() => updateSettings({ theme: option.value })} />)}</div></section>

        <section aria-labelledby="reader-theme-title"><h2 id="reader-theme-title" className="text-lg font-bold">Papel da leitura</h2><p className="mt-1 text-sm text-muted-foreground">Apenas o fundo do leitor bíblico.</p><div className="mt-4 grid grid-cols-3 gap-2">{([{ label: 'Claro', value: 'light' as ReaderTheme }, { label: 'Papel', value: 'paper' as ReaderTheme }, { label: 'Escuro', value: 'dark' as ReaderTheme }]).map((option) => <Choice key={option.value} selected={settings.readerTheme === option.value} label={option.label} onClick={() => updateSettings({ readerTheme: option.value })} />)}</div></section>

        <section className="rounded-2xl border bg-surface p-5" aria-labelledby="offline-title"><div className="flex gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted"><Cloud className="size-5" /></div><div><h2 id="offline-title" className="font-bold">{offlineReady ? 'Conteúdo disponível offline' : 'Preparando conteúdo offline…'}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Os capítulos, a pesquisa e seus dados pessoais permanecem neste dispositivo.</p></div></div></section>

        <footer className="space-y-4 border-t pt-8 text-xs leading-6 text-muted-foreground">
          {bibleVersions.map((version) => (
            <div key={version.id}><p className="font-bold text-foreground">{version.name} ({version.abbreviation})</p><p>{version.attribution} Licença: {version.license}.</p></div>
          ))}
        </footer>
      </div>
    </PageShell>
  )
}

function Choice({ label, selected, onClick, icon: Icon }: { label: string; selected: boolean; onClick: () => void; icon?: typeof Sun }) {
  return <button onClick={onClick} aria-pressed={selected} className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border px-2 text-xs font-semibold transition-colors ${selected ? 'border-primary bg-muted' : 'bg-surface hover:bg-muted'}`}>{Icon && <Icon className="size-4" aria-hidden="true" />}{label}{selected && <Check className="absolute right-2 top-2 size-3" aria-hidden="true" />}</button>
}
