// src/app/pages/admin/os-tabs/TabChecklist.tsx
import { useMemo } from 'react'
import { useOSStore } from '@/app/consultor/store/osStore'
import type { ChecklistItem, ChecklistStatus } from '@/app/consultor/types'

const statusOptions: { value: Exclude<ChecklistStatus, null>; label: string; color: string }[] = [
  { value: 'ok', label: 'OK', color: 'var(--success)' },
  { value: 'atencao', label: 'Atenção', color: 'var(--warning)' },
  { value: 'critico', label: 'Crítico', color: 'var(--danger)' },
  { value: 'nao_aplicavel', label: 'N/A', color: 'var(--text-2)' },
]

export default function TabChecklist({ osId }: { osId: string }) {
  const os = useOSStore((s) => s.getById(osId))!
  const update = useOSStore((s) => s.updateChecklist)

  const porCategoria = useMemo(() => {
    const m = new Map<string, ChecklistItem[]>()
    os.checklist.forEach((it) => {
      const arr = m.get(it.categoria) ?? []
      arr.push(it); m.set(it.categoria, arr)
    })
    return Array.from(m.entries())
  }, [os.checklist])

  const inspecionados = os.checklist.filter((i) => i.status !== null).length
  const total = os.checklist.length
  const pct = total > 0 ? (inspecionados / total) * 100 : 0

  function patch(id: string, patchObj: Partial<ChecklistItem>) {
    const novo = os.checklist.map((i) => (i.id === id ? { ...i, ...patchObj } : i))
    update(osId, novo)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[var(--text-1)]">{inspecionados} de {total} itens inspecionados</span>
          <span className="mono text-sm text-[var(--text-0)]">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-3)] overflow-hidden">
          <div className="h-full bg-[var(--brand)] transition-all duration-[360ms]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {porCategoria.map(([categoria, itens]) => (
        <div key={categoria} className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--text-0)]">{categoria}</h4>
            <span className="text-xs text-[var(--text-2)] mono">{itens.filter((i) => i.status !== null).length}/{itens.length}</span>
          </div>
          <ul>
            {itens.map((it) => (
              <li key={it.id} className="px-5 py-4 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                  <span className="text-sm text-[var(--text-0)]">{it.item}</span>
                  <div className="flex gap-1">
                    {statusOptions.map((opt) => {
                      const ativo = it.status === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => patch(it.id, { status: opt.value })}
                          className="h-7 px-3 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: ativo ? `color-mix(in srgb, ${opt.color} 20%, transparent)` : 'transparent',
                            color: ativo ? opt.color : 'var(--text-2)',
                            border: `1px solid ${ativo ? opt.color : 'var(--border)'}`,
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <input
                  value={it.observacao ?? ''}
                  onChange={(e) => patch(it.id, { observacao: e.target.value })}
                  placeholder="Observação (opcional)"
                  className="h-8 w-full px-2 rounded-[4px] bg-[var(--bg-3)] border border-[var(--border)] text-xs text-[var(--text-1)] focus-visible:outline-none focus:border-[var(--brand)]"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
