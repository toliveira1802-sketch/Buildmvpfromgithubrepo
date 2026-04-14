// src/app/consultor/components/EmptyState.tsx
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  titulo: string
  descricao?: string
  acao?: ReactNode
}

export function EmptyState({ icon: Icon, titulo, descricao, acao }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center mb-5">
        <Icon className="size-7 text-[var(--text-2)]" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1.5">{titulo}</h3>
      {descricao && <p className="text-sm text-[var(--text-1)] max-w-sm mb-5">{descricao}</p>}
      {acao}
    </div>
  )
}
