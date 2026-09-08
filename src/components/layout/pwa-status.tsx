import { useEffect, useState } from 'react'
import { CloudOff, RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'

export function PwaStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  const [dismissed, setDismissed] = useState(false)
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])

  if (needRefresh) return (
    <div role="status" className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border bg-surface p-3 shadow-xl md:bottom-6">
      <RefreshCw className="size-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm">Uma nova versão está disponível.</p>
      <Button size="default" onClick={() => void updateServiceWorker(true)}>Atualizar</Button>
      <Button size="icon" variant="ghost" aria-label="Fechar aviso" onClick={() => setNeedRefresh(false)}><X className="size-4" /></Button>
    </div>
  )

  if (!online && !dismissed) return (
    <div role="status" className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-xl md:bottom-6">
      <CloudOff className="size-5" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">Você está offline. A leitura continua disponível.</p>
      <button className="size-11 rounded-lg" aria-label="Fechar aviso" onClick={() => setDismissed(true)}><X className="mx-auto size-4" /></button>
    </div>
  )
  return null
}
