// src/app/pages/admin/NovaOSWizard.tsx
import { useEffect, useMemo, useState } from 'react'
import { WizardDrawer } from '@/app/consultor/components/WizardDrawer'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'
import { uuid } from '@/app/consultor/lib/idGenerator'
import { formatCPF, formatTelefone, formatPlaca, normalizaDigitos, normalizaPlaca, formatKm } from '@/app/consultor/lib/formatters'
import type { Cliente, Veiculo, TipoServico } from '@/app/consultor/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialClienteId?: string
  initialVeiculoId?: string
  onCreated: (osId: string) => void
}

type ClienteMode = 'existente' | 'novo'
type VeiculoMode = 'existente' | 'novo'

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

export function NovaOSWizard({ open, onOpenChange, initialClienteId, initialVeiculoId, onCreated }: Props) {
  const clientes = useClientesStore((s) => s.items)
  const addCliente = useClientesStore((s) => s.add)
  const veiculos = useVeiculosStore((s) => s.items)
  const addVeiculo = useVeiculosStore((s) => s.add)
  const osStore = useOSStore()

  const [step, setStep] = useState(0)

  const [clienteMode, setClienteMode] = useState<ClienteMode>('existente')
  const [clienteQuery, setClienteQuery] = useState('')
  const [clienteSelId, setClienteSelId] = useState<string | null>(initialClienteId ?? null)
  const [novoCliente, setNovoCliente] = useState<{ nome: string; cpf: string; telefone: string }>({ nome: '', cpf: '', telefone: '' })

  const [veiculoMode, setVeiculoMode] = useState<VeiculoMode>('existente')
  const [veiculoSelId, setVeiculoSelId] = useState<string | null>(initialVeiculoId ?? null)
  const [novoVeiculo, setNovoVeiculo] = useState<{ marca: string; modelo: string; ano: string; placa: string; cor: string; km: string; remap: Veiculo['remap'] }>({ marca: '', modelo: '', ano: '', placa: '', cor: '', km: '', remap: 'stock' })

  const [tipoServico, setTipoServico] = useState<TipoServico | null>(null)
  const [queixa, setQueixa] = useState('')
  const [kmEntrada, setKmEntrada] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setStep(0)
      setClienteMode('existente'); setClienteQuery(''); setClienteSelId(initialClienteId ?? null)
      setNovoCliente({ nome: '', cpf: '', telefone: '' })
      setVeiculoMode('existente'); setVeiculoSelId(initialVeiculoId ?? null)
      setNovoVeiculo({ marca: '', modelo: '', ano: '', placa: '', cor: '', km: '', remap: 'stock' })
      setTipoServico(null); setQueixa(''); setKmEntrada('')
    }
  }, [open, initialClienteId, initialVeiculoId])

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

  const veiculosDoCliente = useMemo(() => clienteSelId ? veiculos.filter((v) => v.clienteId === clienteSelId) : [], [clienteSelId, veiculos])

  const canAdvance1 = clienteMode === 'existente'
    ? !!clienteSelId
    : novoCliente.nome.trim().length >= 3 && normalizaDigitos(novoCliente.cpf).length === 11 && normalizaDigitos(novoCliente.telefone).length >= 10

  const modoVeiculoEfetivo: VeiculoMode = veiculosDoCliente.length === 0 ? 'novo' : veiculoMode
  const canAdvance2 = modoVeiculoEfetivo === 'existente'
    ? !!veiculoSelId
    : !!(novoVeiculo.marca.trim() && novoVeiculo.modelo.trim() && Number(novoVeiculo.ano) >= 1990 && normalizaPlaca(novoVeiculo.placa).length === 7 && novoVeiculo.cor.trim() && Number(novoVeiculo.km) >= 0)

  const canAdvance3 = tipoServico !== null && queixa.trim().length >= 5 && Number(kmEntrada) >= 0

  const canAdvance4 = true

  const canAdvance = [canAdvance1, canAdvance2, canAdvance3, canAdvance4][step]

  function handleAdvance() {
    if (step < 3) { setStep(step + 1); return }
    let clienteId = clienteSelId
    if (clienteMode === 'novo') {
      const c: Cliente = {
        id: uuid(),
        nome: novoCliente.nome.trim(),
        cpf: normalizaDigitos(novoCliente.cpf),
        telefone: normalizaDigitos(novoCliente.telefone),
        status: 'ativo',
        criadoEm: new Date().toISOString(),
      }
      addCliente(c)
      clienteId = c.id
    }
    let veiculoId = veiculoSelId
    if (modoVeiculoEfetivo === 'novo' && clienteId) {
      const v: Veiculo = {
        id: uuid(),
        clienteId,
        marca: novoVeiculo.marca.trim(),
        modelo: novoVeiculo.modelo.trim(),
        ano: Number(novoVeiculo.ano),
        placa: normalizaPlaca(novoVeiculo.placa),
        cor: novoVeiculo.cor.trim(),
        km: Number(novoVeiculo.km),
        remap: novoVeiculo.remap,
      }
      addVeiculo(v)
      veiculoId = v.id
    }
    if (!clienteId || !veiculoId || !tipoServico) return
    const os = osStore.create({
      clienteId,
      veiculoId,
      tipoServico,
      kmEntrada: Number(kmEntrada),
      queixa: queixa.trim(),
    })
    onCreated(os.id)
    onOpenChange(false)
  }

  useEffect(() => {
    if (step === 2 && !kmEntrada) {
      const v = modoVeiculoEfetivo === 'existente'
        ? veiculos.find((x) => x.id === veiculoSelId)
        : null
      if (v) setKmEntrada(String(v.km))
      else if (novoVeiculo.km) setKmEntrada(novoVeiculo.km)
    }
  }, [step])

  const clienteEscolhido: Cliente | null = clienteMode === 'existente'
    ? clientes.find((c) => c.id === clienteSelId) ?? null
    : (novoCliente.nome ? { id: 'preview', nome: novoCliente.nome, cpf: novoCliente.cpf, telefone: novoCliente.telefone, status: 'ativo', criadoEm: '' } : null)
  const veiculoEscolhido: Pick<Veiculo, 'marca' | 'modelo' | 'placa' | 'ano'> | null = modoVeiculoEfetivo === 'existente'
    ? veiculos.find((v) => v.id === veiculoSelId) ?? null
    : (novoVeiculo.marca ? { marca: novoVeiculo.marca, modelo: novoVeiculo.modelo, placa: novoVeiculo.placa, ano: Number(novoVeiculo.ano) } : null)

  return (
    <WizardDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Ordem de Serviço"
      steps={['Cliente', 'Veículo', 'Serviço', 'Resumo']}
      current={step}
      canAdvance={canAdvance}
      onAdvance={handleAdvance}
      onBack={() => setStep(Math.max(0, step - 1))}
      onCancel={() => onOpenChange(false)}
    >
      {step === 0 && (
        <div className="space-y-5">
          <ModeTabs value={clienteMode} onChange={setClienteMode} options={[{ value: 'existente', label: 'Cliente existente' }, { value: 'novo', label: 'Cadastrar novo' }]} />
          {clienteMode === 'existente' ? (
            <div className="space-y-3">
              <input
                value={clienteQuery}
                onChange={(e) => setClienteQuery(e.target.value)}
                placeholder="Buscar por nome, CPF ou telefone"
                className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
              />
              <ul className="space-y-1">
                {clientesFiltrados.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setClienteSelId(c.id)}
                      className={`w-full text-left px-3 py-3 rounded-[6px] border ${clienteSelId === c.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                    >
                      <div className="text-sm text-[var(--text-0)]">{c.nome}</div>
                      <div className="text-xs text-[var(--text-2)] mt-0.5 mono">{formatCPF(c.cpf)} · {formatTelefone(c.telefone)}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <Campo label="Nome completo" value={novoCliente.nome} onChange={(v) => setNovoCliente({ ...novoCliente, nome: v })} />
              <Campo label="CPF" value={novoCliente.cpf} onChange={(v) => setNovoCliente({ ...novoCliente, cpf: v })} display={formatCPF(novoCliente.cpf)} mono />
              <Campo label="Telefone" value={novoCliente.telefone} onChange={(v) => setNovoCliente({ ...novoCliente, telefone: v })} display={formatTelefone(novoCliente.telefone)} mono />
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          {clienteSelId && veiculosDoCliente.length > 0 && (
            <ModeTabs value={veiculoMode} onChange={setVeiculoMode} options={[{ value: 'existente', label: `Veículos do cliente (${veiculosDoCliente.length})` }, { value: 'novo', label: 'Cadastrar novo' }]} />
          )}
          {veiculoMode === 'existente' && veiculosDoCliente.length > 0 ? (
            <ul className="space-y-2">
              {veiculosDoCliente.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => setVeiculoSelId(v.id)}
                    className={`w-full text-left px-4 py-3 rounded-[8px] border ${veiculoSelId === v.id ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[var(--text-0)] font-medium">{v.marca} {v.modelo}</div>
                        <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(v.placa)} · {v.ano} · {formatKm(v.km)}</div>
                      </div>
                      <span className="text-xs text-[var(--text-2)] mono">{v.remap.replace('_', ' ')}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Marca" value={novoVeiculo.marca} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, marca: v })} />
              <Campo label="Modelo" value={novoVeiculo.modelo} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, modelo: v })} />
              <Campo label="Ano" value={novoVeiculo.ano} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, ano: v.replace(/\D/g, '').slice(0, 4) })} mono />
              <Campo label="Placa" value={novoVeiculo.placa} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, placa: v })} display={formatPlaca(novoVeiculo.placa)} mono />
              <Campo label="Cor" value={novoVeiculo.cor} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, cor: v })} />
              <Campo label="KM atual" value={novoVeiculo.km} onChange={(v) => setNovoVeiculo({ ...novoVeiculo, km: v.replace(/\D/g, '') })} mono />
              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Remap</label>
                <div className="flex gap-2">
                  {(['stock', 'stage_1', 'stage_2', 'stage_3'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setNovoVeiculo({ ...novoVeiculo, remap: r })}
                      className={`h-9 px-3 rounded-[6px] text-xs mono ${novoVeiculo.remap === r ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-3)] text-[var(--text-1)] hover:text-[var(--text-0)]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">Tipo de serviço</label>
            <div className="flex flex-wrap gap-2">
              {tiposServico.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipoServico(t.value)}
                  className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${tipoServico === t.value ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-1)] hover:text-[var(--text-0)]'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Queixa / problema reportado</label>
            <textarea
              value={queixa}
              onChange={(e) => setQueixa(e.target.value)}
              placeholder="Cliente relata que..."
              rows={5}
              className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <Campo label="KM de entrada" value={kmEntrada} onChange={(v) => setKmEntrada(v.replace(/\D/g, ''))} mono />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <ResumoBox titulo="Cliente">
            {clienteEscolhido ? (
              <>
                <div className="text-sm text-[var(--text-0)]">{clienteEscolhido.nome}</div>
                <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatCPF(clienteEscolhido.cpf)} · {formatTelefone(clienteEscolhido.telefone)}</div>
              </>
            ) : <em>—</em>}
          </ResumoBox>
          <ResumoBox titulo="Veículo">
            {veiculoEscolhido ? (
              <>
                <div className="text-sm text-[var(--text-0)]">{veiculoEscolhido.marca} {veiculoEscolhido.modelo}</div>
                <div className="text-xs text-[var(--text-2)] mono mt-0.5">{formatPlaca(veiculoEscolhido.placa)} · {veiculoEscolhido.ano}</div>
              </>
            ) : <em>—</em>}
          </ResumoBox>
          <ResumoBox titulo="Serviço">
            <div className="text-sm text-[var(--text-0)]">{tiposServico.find((t) => t.value === tipoServico)?.label}</div>
            <div className="text-xs text-[var(--text-2)] mt-1">{queixa}</div>
            <div className="text-xs text-[var(--text-2)] mt-2 mono">KM entrada: {formatKm(Number(kmEntrada) || 0)}</div>
          </ResumoBox>
          <div className="rounded-[10px] border border-[var(--brand)]/30 bg-[var(--brand-subtle)] p-4">
            <div className="text-xs uppercase tracking-wider text-[var(--brand)] font-medium">Nova OS</div>
            <div className="mono text-lg text-[var(--text-0)] mt-1">
              OS-{new Date().getFullYear()}-{String(osStore.items.filter((o) => o.id.startsWith(`OS-${new Date().getFullYear()}-`)).length + 1).padStart(4, '0')}
            </div>
          </div>
        </div>
      )}
    </WizardDrawer>
  )
}

function ModeTabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex bg-[var(--bg-3)] rounded-[6px] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`h-8 px-3 rounded-[4px] text-xs font-medium transition-colors ${value === o.value ? 'bg-[var(--bg-1)] text-[var(--text-0)]' : 'text-[var(--text-2)] hover:text-[var(--text-0)]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Campo({ label, value, onChange, display, mono = false }: { label: string; value: string; onChange: (v: string) => void; display?: string; mono?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)] ${mono ? 'mono' : ''}`}
      />
      {display && value && display !== value && (
        <p className="text-xs text-[var(--text-2)] mt-1 mono">{display}</p>
      )}
    </div>
  )
}

function ResumoBox({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-4">
      <div className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-2">{titulo}</div>
      {children}
    </div>
  )
}
