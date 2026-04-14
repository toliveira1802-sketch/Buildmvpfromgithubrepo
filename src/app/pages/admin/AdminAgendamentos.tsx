// src/app/pages/admin/AdminAgendamentos.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Calendar, Clock, User, Car as CarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Topbar } from '@/app/consultor/components/Topbar'
import { Button } from '@/app/consultor/components/Button'
import { SidePanel } from '@/app/consultor/components/SidePanel'
import { EmptyState } from '@/app/consultor/components/EmptyState'
import { useAgendamentosStore } from '@/app/consultor/store/agendamentosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatPlaca, formatTelefone } from '@/app/consultor/lib/formatters'
import type { Agendamento, StatusAgendamento, TipoServico } from '@/app/consultor/types'
import { NovoAgendamentoWizard } from './NovoAgendamentoWizard'

const statusColor: Record<StatusAgendamento, string> = {
  agendado: 'var(--warning)',
  confirmado: 'var(--info)',
  compareceu: 'var(--success)',
  faltou: 'var(--danger)',
  cancelado: 'var(--text-3)',
}
const statusLabel: Record<StatusAgendamento, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  compareceu: 'Compareceu',
  faltou: 'Faltou',
  cancelado: 'Cancelado',
}
const tipoLabel: Record<TipoServico, string> = {
  revisao: 'Revisão', remap_ecu: 'Remap ECU', remap_tcu: 'Remap TCU',
  diagnostico: 'Diagnóstico', manutencao: 'Manutenção',
  freios: 'Freios', suspensao: 'Suspensão', outro: 'Outro',
}

function formatHour(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDurHint(min: number): string {
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h${m}`
}

function dayLabel(yyyyMmDd: string): string {
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowKey = tomorrow.toISOString().slice(0, 10)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)

  if (yyyyMmDd === today) return 'Hoje'
  if (yyyyMmDd === tomorrowKey) return 'Amanhã'
  if (yyyyMmDd === yesterdayKey) return 'Ontem'

  const d = new Date(yyyyMmDd + 'T12:00:00Z')
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function AdminAgendamentos() {
  const navigate = useNavigate()
  const items = useAgendamentosStore((s) => s.items)
  const updateStatus = useAgendamentosStore((s) => s.updateStatus)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)
  const createOS = useOSStore((s) => s.create)

  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)
  const [wizardOpen, setWizardOpen] = useState(false)

  const byDay = useMemo(() => {
    const m = new Map<string, Agendamento[]>()
    for (const a of items) {
      const k = a.dataHora.slice(0, 10)
      const arr = m.get(k) ?? []
      arr.push(a); m.set(k, arr)
    }
    for (const arr of m.values()) arr.sort((x, y) => x.dataHora.localeCompare(y.dataHora))
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [items])

  function handleCompareceu(ag: Agendamento) {
    if (!ag.veiculoId) {
      toast.error('Agendamento sem veículo associado', { description: 'Não dá pra criar OS automaticamente.' })
      return
    }
    const veiculo = veiculos.find((v) => v.id === ag.veiculoId)
    const os = createOS({
      clienteId: ag.clienteId,
      veiculoId: ag.veiculoId,
      tipoServico: ag.tipoServico,
      kmEntrada: veiculo?.km ?? 0,
      queixa: ag.observacoes || `Atendimento agendado — ${tipoLabel[ag.tipoServico]}`,
    })
    updateStatus(ag.id, 'compareceu', { osIdGerada: os.id })
    toast.success(`OS ${os.id} criada`, { description: 'Cliente marcado como compareceu.' })
    setSelecionado(null)
    navigate(`/ordens-servico/${os.id}`)
  }

  function handleStatusChange(ag: Agendamento, next: StatusAgendamento) {
    updateStatus(ag.id, next)
    toast.success(`Agendamento ${statusLabel[next].toLowerCase()}`)
    setSelecionado(null)
  }

  return (
    <>
      <Topbar
        title="Agendamentos"
        actions={<Button variant="primary" onClick={() => setWizardOpen(true)}>+ Novo agendamento</Button>}
      />
      <div className="p-7 max-w-[1100px] space-y-6">
        {byDay.length === 0 ? (
          <EmptyState icon={Calendar} titulo="Nenhum agendamento" descricao="Crie o primeiro pra começar a preencher o calendário." acao={<Button variant="primary" onClick={() => setWizardOpen(true)}>+ Novo agendamento</Button>} />
        ) : (
          byDay.map(([day, ags]) => (
            <section key={day}>
              <div className="sticky top-0 z-10 bg-[var(--bg-0)] py-2 mb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text-0)] capitalize">{dayLabel(day)}</h3>
                <p className="text-[11px] text-[var(--text-2)] mono">{new Date(day + 'T12:00:00Z').toLocaleDateString('pt-BR')} · {ags.length} agendamento(s)</p>
              </div>

              <ul className="space-y-2">
                {ags.map((ag) => {
                  const cliente = clientes.find((c) => c.id === ag.clienteId)
                  const veiculo = ag.veiculoId ? veiculos.find((v) => v.id === ag.veiculoId) : undefined
                  const color = statusColor[ag.status]
                  return (
                    <li key={ag.id}>
                      <button
                        onClick={() => setSelecionado(ag)}
                        className="w-full text-left rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors duration-[140ms] px-5 py-4 grid grid-cols-[100px_1fr_auto] gap-4 items-center"
                      >
                        <div>
                          <div className="mono text-lg font-semibold text-[var(--text-0)]">{formatHour(ag.dataHora)}</div>
                          <div className="text-[11px] text-[var(--text-2)] flex items-center gap-1 mt-0.5">
                            <Clock className="size-3" /> {formatDurHint(ag.duracaoMinutos)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[var(--text-0)] truncate">{cliente?.nome ?? '—'}</div>
                          <div className="text-xs text-[var(--text-1)] mt-0.5 flex items-center gap-3 flex-wrap">
                            {veiculo && (
                              <span className="flex items-center gap-1">
                                <CarIcon className="size-3" />
                                {veiculo.marca} {veiculo.modelo} · <span className="mono uppercase">{formatPlaca(veiculo.placa)}</span>
                              </span>
                            )}
                            <span className="text-[var(--text-2)]">{tipoLabel[ag.tipoServico]}</span>
                          </div>
                        </div>
                        <span
                          className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-xs font-medium uppercase tracking-wide"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                            color,
                          }}
                        >
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                          {statusLabel[ag.status]}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      <SidePanel
        open={!!selecionado}
        onOpenChange={(v) => !v && setSelecionado(null)}
        title={selecionado ? clientes.find((c) => c.id === selecionado.clienteId)?.nome ?? '—' : ''}
        subtitle={selecionado && (
          <span className="mono">
            {new Date(selecionado.dataHora).toLocaleString('pt-BR')} · {formatDurHint(selecionado.duracaoMinutos)}
          </span>
        )}
        footer={selecionado && (
          <AgendamentoActions
            ag={selecionado}
            onCompareceu={() => handleCompareceu(selecionado)}
            onChange={(next) => handleStatusChange(selecionado, next)}
          />
        )}
      >
        {selecionado && (
          <AgendamentoDetalhe ag={selecionado} onNavigateToOS={(osId) => { setSelecionado(null); navigate(`/ordens-servico/${osId}`) }} onNavigateToCliente={(id) => { setSelecionado(null); navigate(`/clientes/${id}`) }} />
        )}
      </SidePanel>

      <NovoAgendamentoWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  )
}

function AgendamentoDetalhe({
  ag, onNavigateToOS, onNavigateToCliente,
}: { ag: Agendamento; onNavigateToOS: (osId: string) => void; onNavigateToCliente: (id: string) => void }) {
  const cliente = useClientesStore((s) => s.getById(ag.clienteId))
  const veiculos = useVeiculosStore((s) => s.items)
  const veiculo = ag.veiculoId ? veiculos.find((v) => v.id === ag.veiculoId) : undefined
  return (
    <div className="space-y-5">
      <Bloco titulo="Cliente">
        {cliente ? (
          <button onClick={() => onNavigateToCliente(cliente.id)} className="w-full text-left px-3 py-2.5 rounded-[6px] hover:bg-[var(--bg-3)]">
            <div className="text-sm text-[var(--text-0)] flex items-center gap-2"><User className="size-3.5" /> {cliente.nome}</div>
            <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatTelefone(cliente.telefone)}</div>
          </button>
        ) : <em>—</em>}
      </Bloco>
      <Bloco titulo="Veículo">
        {veiculo ? (
          <div className="px-3 py-2.5">
            <div className="text-sm text-[var(--text-0)]">{veiculo.marca} {veiculo.modelo}</div>
            <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(veiculo.placa)} · {veiculo.ano}</div>
          </div>
        ) : <p className="text-sm text-[var(--text-2)]">Sem veículo associado</p>}
      </Bloco>
      <Bloco titulo="Tipo de serviço">
        <p className="text-sm text-[var(--text-0)]">{tipoLabel[ag.tipoServico]}</p>
      </Bloco>
      {ag.observacoes && (
        <Bloco titulo="Observações">
          <p className="text-sm text-[var(--text-1)] whitespace-pre-wrap">{ag.observacoes}</p>
        </Bloco>
      )}
      {ag.osIdGerada && (
        <Bloco titulo="OS gerada">
          <button onClick={() => onNavigateToOS(ag.osIdGerada!)} className="mono text-sm text-[var(--brand)] hover:underline">
            {ag.osIdGerada} →
          </button>
        </Bloco>
      )}
    </div>
  )
}

function AgendamentoActions({
  ag, onCompareceu, onChange,
}: { ag: Agendamento; onCompareceu: () => void; onChange: (next: StatusAgendamento) => void }) {
  const terminal = ag.status === 'compareceu' || ag.status === 'faltou' || ag.status === 'cancelado'
  if (terminal) return <span className="text-xs text-[var(--text-2)]">Agendamento finalizado</span>

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ag.status === 'agendado' && (
        <Button variant="secondary" size="sm" onClick={() => onChange('confirmado')}>Confirmar</Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => onChange('faltou')}>Faltou</Button>
      <Button variant="ghost" size="sm" onClick={() => onChange('cancelado')}>Cancelar</Button>
      <Button variant="primary" size="sm" onClick={onCompareceu}>Compareceu → criar OS</Button>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">{titulo}</h4>
      {children}
    </section>
  )
}
