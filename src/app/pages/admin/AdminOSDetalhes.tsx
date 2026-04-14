// src/app/pages/admin/AdminOSDetalhes.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Tabs } from '@/app/consultor/components/Tabs'
import { StatusBadge } from '@/app/consultor/components/StatusBadge'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { formatPlaca, formatDataRelativa } from '@/app/consultor/lib/formatters'
import type { StatusOS } from '@/app/consultor/types'
import TabClienteVeiculo from './os-tabs/TabClienteVeiculo'
import TabChecklist from './os-tabs/TabChecklist'
import TabOrcamento from './os-tabs/TabOrcamento'
import TabEntrega from './os-tabs/TabEntrega'

const tipoLabel: Record<string, string> = {
  revisao: 'Revisão', remap_ecu: 'Remap ECU', remap_tcu: 'Remap TCU',
  diagnostico: 'Diagnóstico', manutencao: 'Manutenção',
  freios: 'Freios', suspensao: 'Suspensão', outro: 'Outro',
}

const TRANSITIONS: Record<StatusOS, StatusOS[]> = {
  aguardando: ['em_andamento', 'cancelada'],
  em_andamento: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
}

const statusLabel: Record<StatusOS, string> = {
  aguardando: 'Aguardando', em_andamento: 'Em andamento', concluida: 'Concluída', cancelada: 'Cancelada',
}

export default function AdminOSDetalhes() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const os = useOSStore((s) => s.getById(id))
  const updateStatus = useOSStore((s) => s.updateStatus)
  const cliente = useClientesStore((s) => s.getById(os?.clienteId ?? ''))
  const veiculo = useVeiculosStore((s) => s.getById(os?.veiculoId ?? ''))
  const [tab, setTab] = useState('cv')
  const [erro, setErro] = useState<string | null>(null)

  if (!os) {
    return (
      <>
        <Topbar title="OS não encontrada" />
        <div className="p-7"><a className="text-[var(--brand)]" href="/ordens-servico">Voltar</a></div>
      </>
    )
  }

  function handleStatusChange(next: StatusOS) {
    setErro(null)
    try {
      updateStatus(id, next)
      if (next === 'concluida' || next === 'cancelada') {
        const label = next === 'concluida' ? 'Concluída' : 'Cancelada'
        toast.success(`OS ${id} · ${label}`, { description: `Movida para ${label.toLowerCase()}s.` })
        navigate(`/ordens-servico?status=${next}`)
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro')
    }
  }

  const allowed = TRANSITIONS[os.status]

  return (
    <>
      <Topbar
        title={<span className="flex items-center gap-3">
          <span className="mono text-xl">{os.id}</span>
          <StatusBadge tipo="os" valor={os.status} />
        </span>}
        breadcrumbs={[{ label: 'Ordens de Serviço', to: '/ordens-servico' }]}
        actions={
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button variant="secondary" disabled={allowed.length === 0}>
                Alterar status <ChevronDown className="size-3.5 ml-1" />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content align="end" className="min-w-[200px] bg-[var(--bg-2)] border border-[var(--border)] rounded-[8px] p-1 shadow-[var(--shadow-panel)]">
                {allowed.map((s) => (
                  <Dropdown.Item
                    key={s}
                    onSelect={() => handleStatusChange(s)}
                    className="px-3 py-2 text-sm rounded-[4px] cursor-pointer text-[var(--text-0)] data-[highlighted]:bg-[var(--bg-3)] focus:outline-none"
                  >
                    → {statusLabel[s]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        }
      />
      <div className="p-7 space-y-5 max-w-[1400px]">
        <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] px-5 py-4 flex flex-wrap items-center gap-6 text-sm">
          <InfoChip label="Cliente" value={cliente?.nome ?? '—'} onClick={() => cliente && navigate(`/clientes/${cliente.id}`)} />
          <InfoChip label="Veículo" value={veiculo ? `${veiculo.marca} ${veiculo.modelo} · ${formatPlaca(veiculo.placa)}` : '—'} onClick={() => veiculo && navigate(`/veiculos/${veiculo.id}`)} />
          <InfoChip label="Tipo" value={tipoLabel[os.tipoServico]} />
          <InfoChip label="Entrada" value={formatDataRelativa(os.criadoEm)} />
        </div>

        {erro && <div className="rounded-[6px] bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-sm px-4 py-2">{erro}</div>}

        <Tabs
          value={tab}
          onValueChange={setTab}
          tabs={[
            { value: 'cv', label: 'Cliente & Veículo', content: <TabClienteVeiculo osId={id} /> },
            { value: 'check', label: 'Checklist', content: <TabChecklist osId={id} /> },
            { value: 'orc', label: 'Orçamento', content: <TabOrcamento osId={id} /> },
            { value: 'ent', label: 'Entrega', content: <TabEntrega osId={id} /> },
          ]}
        />
      </div>
    </>
  )
}

function InfoChip({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[var(--text-2)]">{label}</div>
      {onClick ? (
        <button onClick={onClick} className="text-sm text-[var(--text-0)] hover:text-[var(--brand)]">{value}</button>
      ) : (
        <div className="text-sm text-[var(--text-0)]">{value}</div>
      )}
    </div>
  )
}
