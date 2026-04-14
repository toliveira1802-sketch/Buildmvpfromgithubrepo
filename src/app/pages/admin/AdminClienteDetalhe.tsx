// src/app/pages/admin/AdminClienteDetalhe.tsx
import { useNavigate, useParams } from 'react-router'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { Tabs } from '@/app/consultor/components/Tabs'
import { DataTable } from '@/app/consultor/components/DataTable'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatCPF, formatTelefone, formatDataRelativa, formatKm, formatMoeda, formatPlaca } from '@/app/consultor/lib/formatters'
import { useState } from 'react'
import type { Veiculo, OS } from '@/app/consultor/types'

export default function AdminClienteDetalhe() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cliente = useClientesStore((s) => s.getById(id))
  const update = useClientesStore((s) => s.update)
  const veiculos = useVeiculosStore((s) => s.getByCliente(id))
  const osItems = useOSStore((s) => s.getByCliente(id))

  const [obs, setObs] = useState(cliente?.observacoes ?? '')
  const [tab, setTab] = useState('veiculos')

  if (!cliente) {
    return (
      <>
        <Topbar title="Cliente não encontrado" />
        <div className="p-7 text-[var(--text-1)]">Esse cliente não existe. <a className="text-[var(--brand)]" href="/clientes">Voltar</a></div>
      </>
    )
  }

  const iniciais = cliente.nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      <Topbar
        title={cliente.nome}
        breadcrumbs={[{ label: 'Clientes', to: '/clientes' }]}
        actions={
          <Button variant="primary" onClick={() => navigate(`/ordens-servico?wizard=open&clienteId=${cliente.id}`)}>Nova OS</Button>
        }
      />
      <div className="p-7 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-7 max-w-[1400px]">
        <aside className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center text-2xl font-semibold mb-4">
              {iniciais}
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-0)]">{cliente.nome}</h2>
            <div className="mono text-xs text-[var(--text-2)] mt-1">{formatCPF(cliente.cpf)}</div>
            <div className="mt-3"><StatusBadge tipo="cliente" valor={cliente.status} /></div>
          </div>

          <div className="mt-6 space-y-3">
            <Field label="Telefone" value={<span className="mono">{formatTelefone(cliente.telefone)}</span>} />
            {cliente.email && <Field label="Email" value={cliente.email} />}
            <Field label="Cliente desde" value={new Date(cliente.criadoEm).toLocaleDateString('pt-BR')} />
          </div>

          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Observações</label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              onBlur={() => update(cliente.id, { observacoes: obs })}
              placeholder="Anotações internas"
              rows={4}
              className="w-full p-2.5 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </aside>

        <section>
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'veiculos', label: `Veículos (${veiculos.length})`, content: (
                <DataTable<Veiculo>
                  data={veiculos}
                  rowKey={(v) => v.id}
                  onRowClick={(v) => navigate(`/veiculos/${v.id}`)}
                  columns={[
                    { key: 'v', header: 'Veículo', render: (v) => `${v.marca} ${v.modelo}` },
                    { key: 'p', header: 'Placa', render: (v) => <span className="mono uppercase">{formatPlaca(v.placa)}</span>, width: '130px' },
                    { key: 'a', header: 'Ano', render: (v) => v.ano, width: '80px' },
                    { key: 'k', header: 'KM', render: (v) => <span className="mono">{formatKm(v.km)}</span>, width: '120px' },
                  ]}
                />
              )},
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
              { value: 'fin', label: 'Financeiro', content: (
                <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 text-sm text-[var(--text-1)]">
                  Total gasto: <span className="mono text-[var(--text-0)]">{formatMoeda(osItems.filter((o) => o.status === 'concluida').reduce((a, o) => a + o.orcamento.linhas.reduce((s, l) => s + l.valorUnitario * l.quantidade, 0), 0))}</span>
                </div>
              )},
            ]}
          />
        </section>
      </div>
    </>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[var(--text-2)]">{label}</div>
      <div className="text-sm text-[var(--text-0)] mt-0.5">{value}</div>
    </div>
  )
}
