// src/app/consultor/components/Topbar.tsx
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface Crumb { label: string; to?: string }

interface Props {
  title: ReactNode
  breadcrumbs?: Crumb[]
  actions?: ReactNode
}

export function Topbar({ title, breadcrumbs, actions }: Props) {
  return (
    <header className="h-14 px-7 border-b border-[var(--border)] bg-[var(--bg-0)] flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-[var(--text-2)] mr-2">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {c.to ? (
                  <a href={c.to} className="hover:text-[var(--text-0)]">{c.label}</a>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="size-3" />}
              </span>
            ))}
            <ChevronRight className="size-3" />
          </nav>
        )}
        <h1 className="text-xl font-semibold text-[var(--text-0)] truncate">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
