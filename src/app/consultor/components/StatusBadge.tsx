// src/app/consultor/components/StatusBadge.tsx
import type { StatusOS, StatusCliente, AprovacaoOrcamento } from '../types'

type Tipo = 'os' | 'cliente' | 'aprovacao'
type Valor = StatusOS | StatusCliente | AprovacaoOrcamento

interface Props {
  tipo: Tipo
  valor: Valor
}

const labels: Record<string, string> = {
  aguardando: 'Aguardando',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  ativo: 'Ativo',
  inativo: 'Inativo',
  vip: 'VIP',
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
}

const colorVar: Record<string, string> = {
  aguardando: 'var(--warning)',
  em_andamento: 'var(--info)',
  concluida: 'var(--success)',
  cancelada: 'var(--danger)',
  ativo: 'var(--success)',
  inativo: 'var(--text-3)',
  vip: 'var(--vip)',
  pendente: 'var(--warning)',
  aprovado: 'var(--success)',
  rejeitado: 'var(--danger)',
}

export function StatusBadge({ tipo, valor }: Props) {
  const color = colorVar[valor] ?? 'var(--text-2)'
  return (
    <span
      data-tipo={tipo}
      data-variant={valor}
      className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-xs font-medium uppercase tracking-wide"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {labels[valor] ?? valor}
    </span>
  )
}
