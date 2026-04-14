// src/app/pages/admin/os-tabs/TabOrcamento.tsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/app/consultor/components/Button'
import { useOSStore } from '@/app/consultor/store/osStore'
import { uuid } from '@/app/consultor/lib/idGenerator'
import { formatMoeda } from '@/app/consultor/lib/formatters'
import type { OrcamentoLinha, AprovacaoOrcamento } from '@/app/consultor/types'

export default function TabOrcamento({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const update = useOSStore((s) => s.updateOrcamento)
  const [linhas, setLinhas] = useState<OrcamentoLinha[]>(os.orcamento.linhas)

  function save(next: OrcamentoLinha[], aprovacao: AprovacaoOrcamento = os.orcamento.aprovacao) {
    setLinhas(next)
    update(osId, { linhas: next, aprovacao })
  }
  function addLinha(tipo: 'servico' | 'peca') {
    save([...linhas, { id: uuid(), tipo, descricao: '', quantidade: 1, valorUnitario: 0 }])
  }
  function patch(id: string, p: Partial<OrcamentoLinha>) {
    save(linhas.map((l) => (l.id === id ? { ...l, ...p } : l)))
  }
  function remove(id: string) {
    save(linhas.filter((l) => l.id !== id))
  }
  const total = linhas.reduce((a, l) => a + l.valorUnitario * l.quantidade, 0)

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--text-0)]">Linhas do orçamento</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => addLinha('servico')}><Plus className="size-3.5" /> Serviço</Button>
            <Button size="sm" variant="ghost" onClick={() => addLinha('peca')}><Plus className="size-3.5" /> Peça</Button>
          </div>
        </div>
        {linhas.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[var(--text-2)]">Nenhuma linha ainda. Adicione um serviço ou peça.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)]">Tipo</th>
                <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)]">Descrição</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-20">Qtd</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-32">Unit.</th>
                <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-2)] w-32">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-2">
                    <select
                      value={l.tipo}
                      onChange={(e) => patch(l.id, { tipo: e.target.value as 'servico' | 'peca' })}
                      className="h-8 px-2 rounded-[4px] bg-[var(--bg-3)] border border-[var(--border)] text-xs text-[var(--text-0)]"
                    >
                      <option value="servico">Serviço</option>
                      <option value="peca">Peça</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input value={l.descricao} onChange={(e) => patch(l.id, { descricao: e.target.value })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] text-sm text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={1} value={l.quantidade} onChange={(e) => patch(l.id, { quantidade: Math.max(1, Number(e.target.value) || 1) })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] mono text-sm text-right text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={0} step={1} value={l.valorUnitario / 100} onChange={(e) => patch(l.id, { valorUnitario: Math.round(Number(e.target.value) * 100) || 0 })} className="h-8 w-full px-2 rounded-[4px] bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--brand)] mono text-sm text-right text-[var(--text-0)] focus-visible:outline-none" />
                  </td>
                  <td className="px-4 py-2 text-right mono text-sm text-[var(--text-0)]">{formatMoeda(l.quantidade * l.valorUnitario)}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => remove(l.id)} aria-label="Remover" className="size-7 rounded-[4px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--danger)] hover:bg-[var(--bg-3)]">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-xs uppercase tracking-wider text-[var(--text-2)]">Total</td>
                <td className="px-4 py-3 text-right mono text-xl font-semibold text-[var(--text-0)]">{formatMoeda(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium mb-3">Aprovação do cliente</h4>
        <div className="flex gap-2">
          {(['pendente', 'aprovado', 'rejeitado'] as const).map((s) => {
            const ativo = os.orcamento.aprovacao === s
            const color = s === 'aprovado' ? 'var(--success)' : s === 'rejeitado' ? 'var(--danger)' : 'var(--warning)'
            return (
              <button
                key={s}
                onClick={() => save(linhas, s)}
                className="h-9 px-4 rounded-full text-xs font-medium uppercase tracking-wide"
                style={{
                  backgroundColor: ativo ? `color-mix(in srgb, ${color} 18%, transparent)` : 'transparent',
                  color: ativo ? color : 'var(--text-2)',
                  border: `1px solid ${ativo ? color : 'var(--border)'}`,
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
        {os.orcamento.aprovadoEm && (
          <p className="text-xs text-[var(--text-2)] mt-3">Aprovado em {new Date(os.orcamento.aprovadoEm).toLocaleString('pt-BR')}</p>
        )}
      </div>
    </div>
  )
}
