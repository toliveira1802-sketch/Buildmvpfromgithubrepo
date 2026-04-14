// src/app/consultor/components/StatCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'

interface Props {
  label: string
  valor: string
  delta?: { valor: number; direcao: 'up' | 'down' } // valor em %
  hint?: string
  children?: ReactNode
}

export function StatCard({ label, valor, delta, hint, children }: Props) {
  return (
    <div className="group rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors duration-[140ms] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium">{label}</span>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs mono font-medium ${
              delta.direcao === 'up' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
            }`}
          >
            {delta.direcao === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta.valor.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mono text-[28px] leading-9 font-semibold text-[var(--text-0)]">{valor}</div>
      {hint && <div className="text-xs text-[var(--text-2)] mt-2">{hint}</div>}
      {children}
    </div>
  )
}
