// src/app/pages/Dashboard.tsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PlusCircle, ListChecks, ArrowRight } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { StatCard } from '@/app/consultor/components/StatCard'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { useAuthStore } from '@/app/consultor/store/authStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatDataExtensa, formatMoeda, formatDataRelativa } from '@/app/consultor/lib/formatters'
import type { OS } from '@/app/consultor/types'

function saudacao(d: Date): string {
  const h = d.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const consultor = useAuthStore((s) => s.consultor)
  const metrics = useOSStore((s) => s.metrics())
  const items = useOSStore((s) => s.items)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const hoje = useMemo(() => new Date(), [])
  const ultimas = useMemo(
    () => [...items].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5),
    [items],
  )

  const primeiroNome = (consultor?.nome ?? '').split(' ')[0] || 'Consultor'

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-7 space-y-8 max-w-[1400px]">
        <div>
          <h2 className="text-[32px] leading-[40px] font-semibold text-[var(--text-0)]">
            {saudacao(hoje)}, {primeiroNome}
          </h2>
          <p className="text-sm text-[var(--text-1)] mt-1 capitalize">{formatDataExtensa(hoje.toISOString())}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="OS do dia" valor={String(metrics.doDia)} />
          <StatCard label="Em andamento" valor={String(metrics.emAndamento)} />
          <StatCard label="Concluídas no mês" valor={String(metrics.concluidasMes)} />
          <StatCard label="Faturamento do mês" valor={formatMoeda(metrics.faturamentoMes)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/ordens-servico?wizard=open')}
            className="group text-left rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--brand)] p-5 transition-all duration-[180ms]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="size-10 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center mb-4">
                  <PlusCircle className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1">Nova OS</h3>
                <p className="text-sm text-[var(--text-1)]">Iniciar atendimento em 4 etapas</p>
              </div>
              <ArrowRight className="size-4 text-[var(--text-2)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          <button
            onClick={() => navigate('/ordens-servico?status=em_andamento')}
            className="group text-left rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--border-strong)] p-5 transition-all duration-[180ms]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="size-10 rounded-full bg-[var(--bg-3)] text-[var(--info)] flex items-center justify-center mb-4">
                  <ListChecks className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1">Ver OS abertas</h3>
                <p className="text-sm text-[var(--text-1)]">{metrics.emAndamento} em andamento agora</p>
              </div>
              <ArrowRight className="size-4 text-[var(--text-2)] group-hover:text-[var(--text-0)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--text-1)] uppercase tracking-wider mb-3">Últimas OS</h3>
          <DataTable<OS>
            data={ultimas}
            rowKey={(o) => o.id}
            onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
            emptyState={<div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] px-5 py-8 text-center text-sm text-[var(--text-2)]">Nenhuma OS ainda. Use o atalho acima para criar a primeira.</div>}
            columns={[
              { key: 'id', header: 'OS', render: (o) => <span className="mono text-[var(--text-0)]">{o.id}</span>, width: '140px' },
              { key: 'cliente', header: 'Cliente', render: (o) => clientes.find((c) => c.id === o.clienteId)?.nome ?? '—' },
              { key: 'veiculo', header: 'Veículo', render: (o) => {
                const v = veiculos.find((x) => x.id === o.veiculoId)
                return v ? `${v.marca} ${v.modelo}` : '—'
              }},
              { key: 'entrada', header: 'Entrada', render: (o) => <span className="text-[var(--text-1)]">{formatDataRelativa(o.criadoEm)}</span>, width: '140px' },
              { key: 'status', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
