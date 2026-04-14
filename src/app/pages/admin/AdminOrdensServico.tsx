import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ClipboardList } from 'lucide-react'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { SearchInput } from '@/app/consultor/components/SearchInput'
import { DataTable } from '@/app/consultor/components/DataTable'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatDataRelativa, formatPlaca } from '@/app/consultor/lib/formatters'
import type { OS, StatusOS, TipoServico } from '@/app/consultor/types'
import { NovaOSWizard } from './NovaOSWizard'

const filtros: { key: StatusOS | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'em_andamento', label: 'Em andamento' },
  { key: 'concluida', label: 'Concluída' },
  { key: 'cancelada', label: 'Cancelada' },
]

const tipoLabel: Record<TipoServico, string> = {
  revisao: 'Revisão', remap_ecu: 'Remap ECU', remap_tcu: 'Remap TCU',
  diagnostico: 'Diagnóstico', manutencao: 'Manutenção',
  freios: 'Freios', suspensao: 'Suspensão', outro: 'Outro',
}

export default function AdminOrdensServico() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const items = useOSStore((s) => s.items)
  const filterByStatus = useOSStore((s) => s.filterByStatus)
  const search = useOSStore((s) => s.search)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const initialStatus = (params.get('status') as StatusOS | 'todos') ?? 'todos'
  const [statusAtivo, setStatusAtivo] = useState<StatusOS | 'todos'>(initialStatus)
  const [q, setQ] = useState('')
  const [wizardOpen, setWizardOpen] = useState(params.get('wizard') === 'open')

  useEffect(() => {
    if (params.get('wizard') === 'open') setWizardOpen(true)
  }, [params])

  const filtrados = useMemo(() => {
    const base = q ? search(q) : items
    return statusAtivo === 'todos' ? base : base.filter((o) => o.status === statusAtivo)
  }, [q, statusAtivo, items, search])

  const contagens = useMemo(() => {
    return filtros.reduce<Record<string, number>>((acc, f) => {
      acc[f.key] = f.key === 'todos' ? items.length : filterByStatus(f.key as StatusOS).length
      return acc
    }, {})
  }, [items, filterByStatus])

  const initialCliente = params.get('clienteId') ?? undefined
  const initialVeiculo = params.get('veiculoId') ?? undefined

  function closeWizard() {
    setWizardOpen(false)
    const np = new URLSearchParams(params)
    np.delete('wizard'); np.delete('clienteId'); np.delete('veiculoId')
    setParams(np, { replace: true })
  }

  return (
    <>
      <Topbar
        title="Ordens de Serviço"
        actions={
          <>
            <SearchInput value={q} onChange={setQ} placeholder="Buscar por ID, cliente ou placa" />
            <Button variant="primary" onClick={() => setWizardOpen(true)}>+ Nova OS</Button>
          </>
        }
      />

      <div className="p-7 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          {filtros.map((f) => {
            const ativo = statusAtivo === f.key
            return (
              <button
                key={f.key}
                onClick={() => setStatusAtivo(f.key)}
                className={`h-8 px-3 rounded-full text-xs font-medium flex items-center gap-2 transition-colors duration-[140ms] ${
                  ativo
                    ? 'bg-[var(--brand-subtle)] text-[var(--brand)] border border-[var(--brand)]/30'
                    : 'bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--border)] hover:text-[var(--text-0)]'
                }`}
              >
                {f.label}
                <span className="mono opacity-70">{contagens[f.key] ?? 0}</span>
              </button>
            )
          })}
        </div>

        <DataTable<OS>
          data={filtrados}
          rowKey={(o) => o.id}
          onRowClick={(o) => navigate(`/ordens-servico/${o.id}`)}
          emptyState={<EmptyState icon={ClipboardList} titulo="Nenhuma OS encontrada" />}
          columns={[
            { key: 'id', header: 'OS', render: (o) => <span className="mono text-[var(--text-0)]">{o.id}</span>, width: '140px' },
            { key: 'cli', header: 'Cliente', render: (o) => clientes.find((c) => c.id === o.clienteId)?.nome ?? '—' },
            { key: 'v', header: 'Veículo', render: (o) => {
              const v = veiculos.find((x) => x.id === o.veiculoId)
              if (!v) return '—'
              return (
                <div>
                  <div className="text-[var(--text-0)]">{v.marca} {v.modelo}</div>
                  <div className="text-xs text-[var(--text-2)] mono">{formatPlaca(v.placa)}</div>
                </div>
              )
            }},
            { key: 't', header: 'Tipo', render: (o) => <span className="text-[var(--text-1)]">{tipoLabel[o.tipoServico]}</span>, width: '140px' },
            { key: 'e', header: 'Entrada', render: (o) => <span className="text-[var(--text-1)]">{formatDataRelativa(o.criadoEm)}</span>, width: '140px' },
            { key: 's', header: 'Status', render: (o) => <StatusBadge tipo="os" valor={o.status} />, width: '160px' },
          ]}
        />
      </div>

      <NovaOSWizard
        open={wizardOpen}
        onOpenChange={(v) => v ? setWizardOpen(true) : closeWizard()}
        initialClienteId={initialCliente}
        initialVeiculoId={initialVeiculo}
        onCreated={(osId) => navigate(`/ordens-servico/${osId}`)}
      />
    </>
  )
}
