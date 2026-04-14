// src/app/pages/admin/NovoAgendamentoWizard.tsx
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { WizardDrawer } from '@/app/consultor/components/WizardDrawer'
import { useAgendamentosStore } from '@/app/consultor/store/agendamentosStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { uuid } from '@/app/consultor/lib/idGenerator'
import { formatCPF, formatTelefone, formatPlaca, normalizaDigitos } from '@/app/consultor/lib/formatters'
import type { TipoServico } from '@/app/consultor/types'

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

const tiposServico: { value: TipoServico; label: string }[] = [
  { value: 'revisao', label: 'Revisão' },
  { value: 'remap_ecu', label: 'Remap ECU' },
  { value: 'remap_tcu', label: 'Remap TCU' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'freios', label: 'Freios' },
  { value: 'suspensao', label: 'Suspensão' },
  { value: 'outro', label: 'Outro' },
]

const duracoes: { value: number; label: string }[] = [
  { value: 30, label: '30min' },
  { value: 60, label: '1h' },
  { value: 120, label: '2h' },
  { value: 240, label: '4h' },
]

function nextBusinessDayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  return d.toISOString().slice(0, 16) // 'YYYY-MM-DDTHH:mm'
}

export function NovoAgendamentoWizard({ open, onOpenChange }: Props) {
  const addAg = useAgendamentosStore((s) => s.add)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const [step, setStep] = useState(0)
  const [clienteQuery, setClienteQuery] = useState('')
  const [clienteSelId, setClienteSelId] = useState<string | null>(null)
  const [veiculoSelId, setVeiculoSelId] = useState<string | null>(null)
  const [dataHoraLocal, setDataHoraLocal] = useState<string>(nextBusinessDayISO())
  const [tipoServico, setTipoServico] = useState<TipoServico | null>(null)
  const [duracao, setDuracao] = useState<number>(60)
  const [obs, setObs] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setStep(0); setClienteQuery(''); setClienteSelId(null); setVeiculoSelId(null)
      setDataHoraLocal(nextBusinessDayISO()); setTipoServico(null); setDuracao(60); setObs('')
    }
  }, [open])

  const clientesFiltrados = useMemo(() => {
    const q = clienteQuery.toLowerCase()
    const qd = normalizaDigitos(q)
    if (!q) return clientes.slice(0, 8)
    return clientes.filter((c) =>
      c.nome.toLowerCase().includes(q) ||
      (qd && normalizaDigitos(c.cpf).includes(qd)) ||
      (qd && normalizaDigitos(c.telefone).includes(qd)),
    ).slice(0, 8)
  }, [clienteQuery, clientes])

  const veiculosDoCliente = useMemo(
    () => clienteSelId ? veiculos.filter((v) => v.clienteId === clienteSelId) : [],
    [clienteSelId, veiculos],
  )

  const canAdvance1 = !!clienteSelId
  const canAdvance2 = !!tipoServico && !!dataHoraLocal
  const canAdvance3 = true
  const canAdvance = [canAdvance1, canAdvance2, canAdvance3][step]

  function handleAdvance() {
    if (step < 2) { setStep(step + 1); return }
    if (!clienteSelId || !tipoServico) return
    addAg({
      id: uuid(),
      clienteId: clienteSelId,
      veiculoId: veiculoSelId ?? undefined,
      dataHora: new Date(dataHoraLocal).toISOString(),
      duracaoMinutos: duracao,
      tipoServico,
      status: 'agendado',
      observacoes: obs.trim() || undefined,
      criadoEm: new Date().toISOString(),
    })
    toast.success('Agendamento criado', { description: new Date(dataHoraLocal).toLocaleString('pt-BR') })
    onOpenChange(false)
  }

  const clienteEscolhido = clientes.find((c) => c.id === clienteSelId)
  const veiculoEscolhido = veiculoSelId ? veiculos.find((v) => v.id === veiculoSelId) : undefined

  return (
    <WizardDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Novo agendamento"
      steps={['Cliente & Veículo', 'Data & Serviço', 'Confirmação']}
      current={step}
      canAdvance={canAdvance}
      onAdvance={handleAdvance}
      onBack={() => setStep(Math.max(0, step - 1))}
      onCancel={() => onOpenChange(false)}
      advanceLabel={step === 2 ? 'Criar agendamento' : undefined}
    >
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Cliente</label>
            <input
              value={clienteQuery}
              onChange={(e) => setClienteQuery(e.target.value)}
              placeholder="Buscar por nome, CPF ou telefone"
              className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
            <ul className="space-y-1 mt-2">
              {clientesFiltrados.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => { setClienteSelId(c.id); setVeiculoSelId(null) }}
                    className={`w-full text-left px-3 py-3 rounded-[6px] border ${clienteSelId === c.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                  >
                    <div className="text-sm text-[var(--text-0)]">{c.nome}</div>
                    <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatCPF(c.cpf)} · {formatTelefone(c.telefone)}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {clienteSelId && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Veículo (opcional)</label>
              {veiculosDoCliente.length === 0 ? (
                <p className="text-xs text-[var(--text-2)]">Cliente sem veículos cadastrados — cliente pode agendar sem veículo; depois cadastrar no check-in.</p>
              ) : (
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setVeiculoSelId(null)}
                      className={`w-full text-left px-3 py-2 rounded-[6px] text-xs border ${veiculoSelId === null ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]' : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-2)] hover:text-[var(--text-0)]'}`}
                    >
                      Sem veículo (definir no check-in)
                    </button>
                  </li>
                  {veiculosDoCliente.map((v) => (
                    <li key={v.id}>
                      <button
                        onClick={() => setVeiculoSelId(v.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-[6px] border ${veiculoSelId === v.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                      >
                        <div className="text-sm text-[var(--text-0)]">{v.marca} {v.modelo}</div>
                        <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(v.placa)} · {v.ano}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Data e hora</label>
            <input
              type="datetime-local"
              value={dataHoraLocal}
              onChange={(e) => setDataHoraLocal(e.target.value)}
              className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Duração estimada</label>
            <div className="flex gap-2">
              {duracoes.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuracao(d.value)}
                  className={`h-9 px-4 rounded-full text-xs font-medium ${duracao === d.value ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text-1)]'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Tipo de serviço</label>
            <div className="flex flex-wrap gap-2">
              {tiposServico.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipoServico(t.value)}
                  className={`h-9 px-4 rounded-full text-sm font-medium ${tipoServico === t.value ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-1)]'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Observações (opcional)</label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={4}
              placeholder="Detalhes adicionais pro consultor…"
              className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Resumo titulo="Cliente">{clienteEscolhido?.nome ?? '—'}</Resumo>
          <Resumo titulo="Veículo">{veiculoEscolhido ? `${veiculoEscolhido.marca} ${veiculoEscolhido.modelo} · ${formatPlaca(veiculoEscolhido.placa)}` : 'Sem veículo (definir no check-in)'}</Resumo>
          <Resumo titulo="Quando">{new Date(dataHoraLocal).toLocaleString('pt-BR')} · {duracoes.find((d) => d.value === duracao)?.label}</Resumo>
          <Resumo titulo="Serviço">{tiposServico.find((t) => t.value === tipoServico)?.label}</Resumo>
          {obs && <Resumo titulo="Observações">{obs}</Resumo>}
        </div>
      )}
    </WizardDrawer>
  )
}

function Resumo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-4">
      <div className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">{titulo}</div>
      <div className="text-sm text-[var(--text-0)] whitespace-pre-wrap">{children}</div>
    </div>
  )
}
