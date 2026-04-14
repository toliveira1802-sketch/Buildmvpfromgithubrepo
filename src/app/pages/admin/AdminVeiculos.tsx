// src/app/pages/admin/AdminVeiculos.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Car } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { Button } from '@/app/consultor/components/Button'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatPlaca, formatKm, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { Veiculo } from '@/app/consultor/types'

const remapLabel: Record<Veiculo['remap'], string> = {
  stock: 'Stock', stage_1: 'Stage 1', stage_2: 'Stage 2', stage_3: 'Stage 3',
}
const remapColor: Record<Veiculo['remap'], string> = {
  stock: 'var(--text-2)', stage_1: 'var(--info)', stage_2: 'var(--warning)', stage_3: 'var(--brand)',
}

export default function AdminVeiculos() {
  const navigate = useNavigate()
  const veiculos = useVeiculosStore((s) => s.items)
  const search = useVeiculosStore((s) => s.search)
  const clientes = useClientesStore((s) => s.items)

  const [q, setQ] = useState('')
  const [selecionado, setSelecionado] = useState<Veiculo | null>(null)

  const filtrados = useMemo(() => {
    const base = search(q)
    if (!q) return base
    const qLow = q.toLowerCase()
    const extras = veiculos.filter((v) => {
      if (base.includes(v)) return false
      const c = clientes.find((cc) => cc.id === v.clienteId)
      return c?.nome.toLowerCase().includes(qLow) ?? false
    })
    return [...base, ...extras]
  }, [q, veiculos, clientes, search])

  return (
    <>
      <Topbar
        title="Veículos"
        actions={<SearchInput value={q} onChange={setQ} placeholder="Buscar por placa, modelo ou proprietário" />}
      />
      <div className="p-7">
        <DataTable<Veiculo>
          data={filtrados}
          rowKey={(v) => v.id}
          onRowClick={(v) => setSelecionado(v)}
          emptyState={<EmptyState icon={Car} titulo="Nenhum veículo encontrado" />}
          columns={[
            { key: 'v', header: 'Veículo', render: (v) => (
              <div>
                <div className="text-[var(--text-0)] font-medium">{v.marca} {v.modelo}</div>
                <div className="text-xs text-[var(--text-2)]">{v.cor}</div>
              </div>
            )},
            { key: 'p', header: 'Placa', render: (v) => <span className="mono uppercase text-[var(--text-0)]">{formatPlaca(v.placa)}</span>, width: '130px' },
            { key: 'a', header: 'Ano', render: (v) => <span className="mono text-[var(--text-1)]">{v.ano}</span>, width: '80px' },
            { key: 'pro', header: 'Proprietário', render: (v) => {
              const c = clientes.find((cc) => cc.id === v.clienteId)
              if (!c) return '—'
              return (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${c.id}`) }}
                  className="text-[var(--text-1)] hover:text-[var(--brand)] text-left"
                >
                  {c.nome}
                </button>
              )
            }},
            { key: 'km', header: 'KM', render: (v) => <span className="mono text-[var(--text-1)]">{formatKm(v.km)}</span>, width: '130px' },
            { key: 'r', header: 'Remap', render: (v) => (
              <span
                className="inline-flex items-center h-5 px-2 rounded text-xs font-medium"
                style={{
                  color: remapColor[v.remap],
                  backgroundColor: `color-mix(in srgb, ${remapColor[v.remap]} 14%, transparent)`,
                }}
              >
                {remapLabel[v.remap]}
              </span>
            ), width: '110px' },
          ]}
        />
      </div>

      <SidePanel
        open={!!selecionado}
        onOpenChange={(v) => !v && setSelecionado(null)}
        title={selecionado ? `${selecionado.marca} ${selecionado.modelo}` : ''}
        subtitle={selecionado && <span className="mono uppercase">{formatPlaca(selecionado.placa)}</span>}
        footer={selecionado && (
          <>
            <Button variant="secondary" onClick={() => { navigate(`/veiculos/${selecionado.id}`); setSelecionado(null) }}>
              Ver perfil completo
            </Button>
            <Button variant="primary" onClick={() => {
              navigate(`/ordens-servico?wizard=open&veiculoId=${selecionado.id}&clienteId=${selecionado.clienteId}`)
              setSelecionado(null)
            }}>
              Nova OS
            </Button>
          </>
        )}
      >
        {selecionado && <VeiculoPanel veiculo={selecionado} onVerCliente={(id) => { navigate(`/clientes/${id}`); setSelecionado(null) }} onVerOS={(id) => { navigate(`/ordens-servico/${id}`); setSelecionado(null) }} />}
      </SidePanel>
    </>
  )
}

function VeiculoPanel({ veiculo, onVerCliente, onVerOS }: { veiculo: Veiculo; onVerCliente: (id: string) => void; onVerOS: (id: string) => void }) {
  const cliente = useClientesStore((s) => s.getById(veiculo.clienteId))
  const osItems = useOSStore((s) => s.getByVeiculo(veiculo.id))
  return (
    <div className="space-y-7">
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Dados</h4>
        <div className="space-y-2">
          <Row label="Ano" value={<span className="mono">{veiculo.ano}</span>} />
          <Row label="Cor" value={veiculo.cor} />
          <Row label="KM atual" value={<span className="mono">{formatKm(veiculo.km)}</span>} />
          <Row label="Remap" value={<span className="mono">{remapLabel[veiculo.remap]}</span>} />
          {veiculo.chassi && <Row label="Chassi" value={<span className="mono">{veiculo.chassi}</span>} />}
        </div>
      </section>
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Proprietário</h4>
        {cliente ? (
          <button onClick={() => onVerCliente(cliente.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)]">
            <div className="text-sm text-[var(--text-0)]">{cliente.nome}</div>
            <div className="text-xs text-[var(--text-2)] mt-0.5">{cliente.telefone}</div>
          </button>
        ) : <p className="text-sm text-[var(--text-2)]">—</p>}
      </section>
      <section>
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Histórico de OS ({osItems.length})</h4>
        {osItems.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem OS.</p>
        ) : (
          <ul className="space-y-1">
            {[...osItems].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).map((o) => {
              const total = o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
              return (
                <li key={o.id}>
                  <button onClick={() => onVerOS(o.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between gap-3">
                    <div>
                      <div className="mono text-xs text-[var(--text-0)]">{o.id}</div>
                      <div className="text-xs text-[var(--text-2)] mt-0.5">{formatDataRelativa(o.criadoEm)}</div>
                    </div>
                    <StatusBadge tipo="os" valor={o.status} />
                    <div className="mono text-sm text-[var(--text-1)] min-w-[90px] text-right">{formatMoeda(total)}</div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
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
