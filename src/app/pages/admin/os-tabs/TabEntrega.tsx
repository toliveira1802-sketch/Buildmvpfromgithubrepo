// src/app/pages/admin/os-tabs/TabEntrega.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { formatMoeda, formatKm } from '@/app/consultor/lib/formatters'
import type { FormaPagamento } from '@/app/consultor/types'

export default function TabEntrega({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const updateEntrega = useOSStore((s) => s.updateEntrega)
  const updateStatus = useOSStore((s) => s.updateStatus)
  const navigate = useNavigate()

  const [kmSaida, setKmSaida] = useState<string>(String(os.entrega.kmSaida ?? ''))
  const [forma, setForma] = useState<FormaPagamento | ''>(os.entrega.formaPagamento ?? '')
  const [obs, setObs] = useState(os.entrega.observacoes ?? '')
  const [erro, setErro] = useState<string | null>(null)

  const total = os.orcamento.linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)
  const podeFinalizar = os.status === 'em_andamento' && os.orcamento.aprovacao === 'aprovado'

  function handleFinalizar() {
    setErro(null)
    try {
      updateEntrega(osId, {
        kmSaida: Number(kmSaida) || undefined,
        formaPagamento: forma || undefined,
        observacoes: obs,
        finalizadaEm: new Date().toISOString(),
      })
      updateStatus(osId, 'concluida')
      toast.success(`OS ${os.id} finalizada`, { description: 'Movida para concluídas.' })
      navigate('/ordens-servico?status=concluida')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro')
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5 space-y-4">
        <Campo label="KM de saída" value={kmSaida} onChange={(v) => setKmSaida(v.replace(/\D/g, ''))} onBlur={() => updateEntrega(osId, { kmSaida: Number(kmSaida) || undefined })} mono placeholder={formatKm(os.kmEntrada)} />
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Forma de pagamento</label>
          <select
            value={forma}
            onChange={(e) => { const f = e.target.value as FormaPagamento | ''; setForma(f); updateEntrega(osId, { formaPagamento: f || undefined }) }}
            className="h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
          >
            <option value="">Selecione</option>
            <option value="pix">PIX</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">Observações</label>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            onBlur={() => updateEntrega(osId, { observacoes: obs })}
            rows={4}
            className="w-full p-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)]"
          />
        </div>
      </div>

      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[var(--text-1)]">Total da OS</span>
          <span className="mono text-xl font-semibold text-[var(--text-0)]">{formatMoeda(total)}</span>
        </div>
        {!podeFinalizar && (
          <p className="text-xs text-[var(--text-2)] mb-3">Para finalizar: status deve ser <strong>Em andamento</strong> e orçamento <strong>Aprovado</strong>.</p>
        )}
        {erro && <p className="text-sm text-[var(--danger)] mb-2">{erro}</p>}
        <Button variant="primary" size="lg" onClick={handleFinalizar} disabled={!podeFinalizar} className="w-full">Finalizar OS</Button>
      </div>

      {os.entrega.finalizadaEm && (
        <div className="rounded-[10px] bg-[var(--success)]/10 border border-[var(--success)]/30 px-4 py-3 text-sm text-[var(--success)]">
          Finalizada em {new Date(os.entrega.finalizadaEm).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )
}

function Campo({ label, value, onChange, onBlur, mono = false, placeholder }: { label: string; value: string; onChange: (v: string) => void; onBlur?: () => void; mono?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-10 w-full px-3 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-sm text-[var(--text-0)] focus-visible:outline-none focus:border-[var(--brand)] ${mono ? 'mono' : ''}`}
      />
    </div>
  )
}
