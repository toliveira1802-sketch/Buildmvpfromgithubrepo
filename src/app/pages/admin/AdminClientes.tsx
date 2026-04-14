// src/app/pages/admin/AdminClientes.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Users } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { Button } from '@/app/consultor/components/Button'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatCPF, formatTelefone, formatDataRelativa, formatMoeda } from '@/app/consultor/lib/formatters'
import type { Cliente } from '@/app/consultor/types'

export default function AdminClientes() {
  const navigate = useNavigate()
  const clientes = useClientesStore((s) => s.items)
  const search = useClientesStore((s) => s.search)
  const veiculos = useVeiculosStore((s) => s.items)
  const osStore = useOSStore()

  const [q, setQ] = useState('')
  const [selecionado, setSelecionado] = useState<Cliente | null>(null)

  const filtrados = useMemo(() => search(q), [q, clientes, search])

  function ultimaOSData(clienteId: string): string | null {
    const os = osStore.getByCliente(clienteId).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))[0]
    return os ? os.criadoEm : null
  }

  return (
    <>
      <Topbar
        title="Clientes"
        actions={
          <SearchInput value={q} onChange={setQ} placeholder="Buscar por nome, CPF ou telefone" />
        }
      />
      <div className="p-7">
        <DataTable<Cliente>
          data={filtrados}
          rowKey={(c) => c.id}
          onRowClick={(c) => setSelecionado(c)}
          emptyState={<EmptyState icon={Users} titulo="Nenhum cliente encontrado" descricao="Ajuste a busca ou cadastre o primeiro." />}
          columns={[
            { key: 'nome', header: 'Nome', render: (c) => (
              <div>
                <div className="text-[var(--text-0)] font-medium">{c.nome}</div>
                <div className="text-xs text-[var(--text-2)] mono">{formatCPF(c.cpf)}</div>
              </div>
            )},
            { key: 'tel', header: 'Telefone', render: (c) => <span className="mono text-[var(--text-1)]">{formatTelefone(c.telefone)}</span>, width: '180px' },
            { key: 'veiculos', header: 'Veículos', render: (c) => {
              const n = veiculos.filter((v) => v.clienteId === c.id).length
              return <span className="inline-flex items-center justify-center min-w-6 h-5 px-1.5 rounded text-xs bg-[var(--bg-3)] text-[var(--text-1)]">{n}</span>
            }, width: '120px' },
            { key: 'ultima', header: 'Última OS', render: (c) => {
              const d = ultimaOSData(c.id)
              return <span className="text-[var(--text-1)]">{d ? formatDataRelativa(d) : '—'}</span>
            }, width: '140px' },
            { key: 'status', header: 'Status', render: (c) => <StatusBadge tipo="cliente" valor={c.status} />, width: '120px' },
          ]}
        />
      </div>

      <SidePanel
        open={!!selecionado}
        onOpenChange={(v) => !v && setSelecionado(null)}
        title={selecionado?.nome ?? ''}
        subtitle={selecionado && <span className="mono">{formatCPF(selecionado.cpf)}</span>}
        footer={selecionado && (
          <>
            <Button variant="secondary" onClick={() => { navigate(`/clientes/${selecionado.id}`); setSelecionado(null) }}>
              Ver perfil completo
            </Button>
            <Button variant="primary" onClick={() => {
              navigate(`/ordens-servico?wizard=open&clienteId=${selecionado.id}`)
              setSelecionado(null)
            }}>
              Nova OS
            </Button>
          </>
        )}
      >
        {selecionado && (
          <ClienteDetalheInline cliente={selecionado} onVerVeiculo={(id) => { navigate(`/veiculos/${id}`); setSelecionado(null) }} onVerOS={(id) => { navigate(`/ordens-servico/${id}`); setSelecionado(null) }} />
        )}
      </SidePanel>
    </>
  )
}

function ClienteDetalheInline({
  cliente, onVerVeiculo, onVerOS,
}: { cliente: Cliente; onVerVeiculo: (id: string) => void; onVerOS: (id: string) => void }) {
  const veiculos = useVeiculosStore((s) => s.getByCliente(cliente.id))
  const osItems = useOSStore((s) => s.getByCliente(cliente.id))

  return (
    <div className="space-y-7">
      <Bloco titulo="Dados">
        <Linha label="Telefone" valor={formatTelefone(cliente.telefone)} mono />
        {cliente.email && <Linha label="Email" valor={cliente.email} />}
        <Linha label="Status" valor={<StatusBadge tipo="cliente" valor={cliente.status} />} />
        <Linha label="Cliente desde" valor={new Date(cliente.criadoEm).toLocaleDateString('pt-BR')} />
        {cliente.observacoes && <Linha label="Observações" valor={cliente.observacoes} />}
      </Bloco>

      <Bloco titulo={`Veículos (${veiculos.length})`}>
        {veiculos.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem veículos cadastrados.</p>
        ) : (
          <ul className="space-y-1">
            {veiculos.map((v) => (
              <li key={v.id}>
                <button onClick={() => onVerVeiculo(v.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--text-0)]">{v.marca} {v.modelo}</div>
                    <div className="text-xs text-[var(--text-2)] mono mt-0.5">{v.placa}</div>
                  </div>
                  <span className="text-xs text-[var(--text-2)]">{v.ano}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Bloco titulo={`Histórico de OS (${osItems.length})`}>
        {osItems.length === 0 ? (
          <p className="text-sm text-[var(--text-2)]">Sem OS.</p>
        ) : (
          <ul className="space-y-1">
            {osItems.slice().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 10).map((o) => {
              const total = o.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
              return (
                <li key={o.id}>
                  <button onClick={() => onVerOS(o.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mono text-xs text-[var(--text-0)]">{o.id}</div>
                      <div className="text-xs text-[var(--text-2)]">{formatDataRelativa(o.criadoEm)}</div>
                    </div>
                    <StatusBadge tipo="os" valor={o.status} />
                    <div className="mono text-sm text-[var(--text-1)] min-w-[90px] text-right">{formatMoeda(total)}</div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Bloco>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">{titulo}</h4>
      {children}
    </section>
  )
}

function Linha({ label, valor, mono = false }: { label: string; valor: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-2)]">{label}</span>
      <span className={`text-sm text-[var(--text-0)] ${mono ? 'mono' : ''}`}>{valor}</span>
    </div>
  )
}
