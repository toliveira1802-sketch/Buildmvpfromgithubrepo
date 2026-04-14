// src/app/pages/admin/AdminVeiculoDetalhe.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { Tabs } from '@/app/consultor/components/Tabs'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatPlaca, formatKm, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { OS } from '@/app/consultor/types'

const remapLabel = { stock: 'Stock', stage_1: 'Stage 1', stage_2: 'Stage 2', stage_3: 'Stage 3' } as const

export default function AdminVeiculoDetalhe() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const veiculo = useVeiculosStore((s) => s.getById(id))
  const update = useVeiculosStore((s) => s.update)
  const cliente = useClientesStore((s) => s.getById(veiculo?.clienteId ?? ''))
  const osItems = useOSStore((s) => s.getByVeiculo(id))
  const [tab, setTab] = useState('historico')
  const [chassi, setChassi] = useState(veiculo?.chassi ?? '')

  if (!veiculo) {
    return (
      <>
        <Topbar title="Veículo não encontrado" />
        <div className="p-7"><a className="text-[var(--brand)]" href="/veiculos">Voltar</a></div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title={`${veiculo.marca} ${veiculo.modelo}`}
        breadcrumbs={[{ label: 'Veículos', to: '/veiculos' }]}
        actions={
          <Button variant="primary" onClick={() => navigate(`/ordens-servico?wizard=open&veiculoId=${veiculo.id}&clienteId=${veiculo.clienteId}`)}>
            Nova OS
          </Button>
        }
      />
      <div className="p-7 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7 max-w-[1400px]">
        <aside className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 h-fit">
          <div className="text-center">
            <div className="mono uppercase text-3xl font-semibold tracking-wider text-[var(--text-0)] bg-[var(--bg-3)] border border-[var(--border)] rounded-[10px] py-4 px-3 mb-4">
              {formatPlaca(veiculo.placa)}
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-0)]">{veiculo.marca} {veiculo.modelo}</h2>
            <p className="text-sm text-[var(--text-1)] mt-0.5">{veiculo.ano} · {veiculo.cor}</p>
          </div>
          <div className="mt-6 space-y-2">
            <Row label="KM atual" value={<span className="mono">{formatKm(veiculo.km)}</span>} />
            <Row label="Remap" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
            {cliente && (
              <Row label="Proprietário" value={
                <button className="text-[var(--brand)] hover:underline" onClick={() => navigate(`/clientes/${cliente.id}`)}>{cliente.nome}</button>
              } />
            )}
          </div>
        </aside>
        <section>
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'historico', label: `Histórico de OS (${osItems.length})`, content: (
                <DataTable<OS>
                  data={[...osItems].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))}
                  rowKey={(o) => o.id}
                  onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
                  columns={[
                    { key: 'id', header: 'OS', render: (o) => <span className="mono">{o.id}</span>, width: '140px' },
                    { key: 'd', header: 'Entrada', render: (o) => formatDataRelativa(o.criadoEm), width: '140px' },
                    { key: 's', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
                    { key: 't', header: 'Total', render: (o) => <span className="mono">{formatMoeda(o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0))}</span>, align: 'right' },
                  ]}
                />
              )},
              { value: 'tec', label: 'Técnico', content: (
                <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Chassi</label>
                    <input
                      value={chassi}
                      onChange={(e) => setChassi(e.target.value)}
                      onBlur={() => update(veiculo.id, { chassi })}
                      placeholder="ABCD1234EFGH5678"
                      className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] mono text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                  <Row label="Estágio atual" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
                </div>
              )},
            ]}
          />
        </section>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className="text-sm text-[var(--text-0)]">{value}</span>
    </div>
  )
}
