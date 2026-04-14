// src/app/pages/PatioKanban.tsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Topbar } from '@/app/consultor/components/Topbar'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { minutosNaEtapa, slaStatusFor, formatSLA, type SLAStatus } from '@/app/consultor/lib/slaHelpers'
import { formatPlaca } from '@/app/consultor/lib/formatters'
import {
  ETAPAS_ORDENADAS,
  ETAPA_LABELS,
  SLA_POR_ETAPA_MINUTOS,
  type EtapaOS,
  type OS,
} from '@/app/consultor/types'
import { AlertTriangle, CheckCircle2, Clock, MinusCircle } from 'lucide-react'

const slaColor: Record<SLAStatus, string> = {
  ok: 'var(--success)',
  atencao: 'var(--warning)',
  critico: 'var(--danger)',
  terminal: 'var(--text-3)',
}

const slaIcon: Record<SLAStatus, typeof Clock> = {
  ok: CheckCircle2,
  atencao: Clock,
  critico: AlertTriangle,
  terminal: MinusCircle,
}

export default function PatioKanban() {
  const navigate = useNavigate()
  const items = useOSStore((s) => s.items)
  const clientes = useClientesStore((s) => s.items)
  const veiculos = useVeiculosStore((s) => s.items)

  const grouped = useMemo(() => {
    const m = new Map<EtapaOS, OS[]>()
    ETAPAS_ORDENADAS.forEach((e) => m.set(e, []))
    items.forEach((o) => m.get(o.etapa)?.push(o))
    return m
  }, [items])

  return (
    <>
      <Topbar title="Pátio Kanban" />
      <div className="p-7">
        <p className="text-sm text-[var(--text-1)] mb-5">
          Cada coluna é uma etapa do fluxo. O tempo na etapa é medido contra o SLA (verde dentro, amarelo atenção, vermelho estouro).
        </p>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-7 px-7" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {ETAPAS_ORDENADAS.map((etapa) => {
            const osNaColuna = grouped.get(etapa) ?? []
            const slaAlvo = SLA_POR_ETAPA_MINUTOS[etapa]
            return (
              <div
                key={etapa}
                className="flex-shrink-0 w-[280px] rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] flex flex-col"
              >
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-0)]">{ETAPA_LABELS[etapa]}</h3>
                    <p className="text-[10px] text-[var(--text-2)] mono mt-0.5">
                      {slaAlvo === null ? 'sem SLA' : `SLA: ${formatSLA(slaAlvo)}`}
                    </p>
                  </div>
                  <span className="mono text-xs text-[var(--text-1)] bg-[var(--bg-3)] px-2 py-0.5 rounded">
                    {osNaColuna.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {osNaColuna.length === 0 ? (
                    <p className="text-xs text-[var(--text-3)] text-center py-8">—</p>
                  ) : (
                    osNaColuna.map((o) => {
                      const mins = minutosNaEtapa(o)
                      const sla = slaStatusFor(etapa, mins)
                      const color = slaColor[sla]
                      const Icon = slaIcon[sla]
                      const cli = clientes.find((c) => c.id === o.clienteId)
                      const vei = veiculos.find((v) => v.id === o.veiculoId)
                      return (
                        <button
                          key={o.id}
                          onClick={() => navigate(`/ordens-servico/${o.id}`)}
                          className="w-full text-left rounded-[6px] bg-[var(--bg-1)] border border-[var(--border)] hover:border-[var(--border-strong)] p-3 transition-colors duration-[140ms]"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="mono text-[11px] text-[var(--text-2)]">{o.id}</span>
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
                              style={{ color, backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)` }}
                              title={sla === 'terminal' ? 'Etapa terminal' : `SLA alvo ${slaAlvo ? formatSLA(slaAlvo) : ''}`}
                            >
                              <Icon className="size-3" />
                              {formatSLA(mins)}
                            </span>
                          </div>
                          <div className="text-sm text-[var(--text-0)] font-medium leading-tight truncate">
                            {cli?.nome ?? '—'}
                          </div>
                          {vei && (
                            <div className="text-xs text-[var(--text-2)] mt-0.5 flex items-center gap-2">
                              <span>{vei.marca} {vei.modelo}</span>
                              <span className="mono uppercase">{formatPlaca(vei.placa)}</span>
                            </div>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
