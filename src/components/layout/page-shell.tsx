import type { ReactNode } from 'react'

export function PageShell({ eyebrow, title, description, action, children, width = 'wide' }: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  width?: 'wide' | 'reading'
}) {
  return (
    <div className={`mx-auto min-h-dvh px-5 py-7 sm:px-8 sm:py-10 ${width === 'reading' ? 'max-w-3xl' : 'max-w-6xl'}`}>
      <header className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </div>
  )
}
