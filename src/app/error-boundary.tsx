import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { if (import.meta.env.DEV) console.error(error, info) }

  render() {
    if (this.state.failed) return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div><p className="text-sm font-semibold text-muted-foreground">Algo saiu do lugar</p><h1 className="mt-2 text-2xl font-bold">Não foi possível abrir esta tela.</h1><p className="mt-3 text-muted-foreground">Seus dados continuam salvos neste dispositivo.</p><Button className="mt-6" onClick={() => window.location.reload()}>Tentar novamente</Button></div>
      </main>
    )
    return this.props.children
  }
}
