// src/app/consultor/store/osStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { OS, CreateOSDraft, StatusOS, Orcamento, Entrega, ChecklistItem } from '../types'
import { nextOSId } from '../lib/idGenerator'
import { buildChecklist, SEED_CONSULTOR } from './seed'
import { normalizaPlaca } from '../lib/formatters'

const VALID_TRANSITIONS: Record<StatusOS, StatusOS[]> = {
  aguardando: ['em_andamento', 'cancelada'],
  em_andamento: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
}

interface OSMetrics {
  doDia: number
  emAndamento: number
  concluidasMes: number
  faturamentoMes: number
}

interface OSState {
  items: OS[]
  create: (draft: CreateOSDraft) => OS
  updateStatus: (id: string, next: StatusOS) => void
  updateChecklist: (id: string, items: ChecklistItem[]) => void
  updateOrcamento: (id: string, orc: Omit<Orcamento, 'aprovadoEm'> & { aprovadoEm?: string }) => void
  updateEntrega: (id: string, entrega: Entrega) => void
  getById: (id: string) => OS | undefined
  search: (query: string) => OS[]
  filterByStatus: (status: StatusOS | 'todos') => OS[]
  getByCliente: (clienteId: string) => OS[]
  getByVeiculo: (veiculoId: string) => OS[]
  metrics: () => OSMetrics
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth()
}

function totalOrcamento(o: Orcamento): number {
  return o.linhas.reduce((acc, l) => acc + l.quantidade * l.valorUnitario, 0)
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      items: [],
      create: (draft) => {
        const now = new Date().toISOString()
        const id = nextOSId(get().items.map((o) => o.id), new Date().getFullYear())
        const os: OS = {
          id,
          clienteId: draft.clienteId,
          veiculoId: draft.veiculoId,
          tipoServico: draft.tipoServico,
          kmEntrada: draft.kmEntrada,
          queixa: draft.queixa,
          status: 'aguardando',
          checklist: buildChecklist(),
          orcamento: { linhas: [], aprovacao: 'pendente' },
          entrega: {},
          criadoEm: now,
          atualizadoEm: now,
          consultorId: SEED_CONSULTOR.id,
        }
        set((s) => ({ items: [...s.items, os] }))
        return os
      },
      updateStatus: (id, nextStatus) => {
        const os = get().items.find((o) => o.id === id)
        if (!os) throw new Error('OS não encontrada')
        const allowed = VALID_TRANSITIONS[os.status]
        if (!allowed.includes(nextStatus)) {
          throw new Error(`Transição inválida: ${os.status} → ${nextStatus}`)
        }
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, status: nextStatus, atualizadoEm: new Date().toISOString() } : o,
          ),
        }))
      },
      updateChecklist: (id, items) =>
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, checklist: items, atualizadoEm: new Date().toISOString() } : o,
          ),
        })),
      updateOrcamento: (id, orc) => {
        const now = new Date().toISOString()
        set((s) => ({
          items: s.items.map((o) => {
            if (o.id !== id) return o
            const aprovadoEm = orc.aprovacao === 'aprovado' ? orc.aprovadoEm ?? now : undefined
            return {
              ...o,
              orcamento: { linhas: orc.linhas, aprovacao: orc.aprovacao, aprovadoEm },
              atualizadoEm: now,
            }
          }),
        }))
      },
      updateEntrega: (id, entrega) =>
        set((s) => ({
          items: s.items.map((o) =>
            o.id === id ? { ...o, entrega: { ...o.entrega, ...entrega }, atualizadoEm: new Date().toISOString() } : o,
          ),
        })),
      getById: (id) => get().items.find((o) => o.id === id),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const placaQ = normalizaPlaca(q)
        return get().items.filter((o) => {
          if (o.id.toLowerCase().includes(q)) return true
          if (placaQ && o.id.replace(/-/g, '').toLowerCase().includes(placaQ.toLowerCase())) return true
          return false
        })
      },
      filterByStatus: (status) =>
        status === 'todos' ? get().items : get().items.filter((o) => o.status === status),
      getByCliente: (clienteId) => get().items.filter((o) => o.clienteId === clienteId),
      getByVeiculo: (veiculoId) => get().items.filter((o) => o.veiculoId === veiculoId),
      metrics: () => {
        const items = get().items
        const doDia = items.filter((o) => isToday(o.criadoEm)).length
        const emAndamento = items.filter((o) => o.status === 'em_andamento').length
        const concluidasMes = items.filter((o) => o.status === 'concluida' && isThisMonth(o.atualizadoEm)).length
        const faturamentoMes = items
          .filter((o) => o.status === 'concluida' && isThisMonth(o.atualizadoEm))
          .reduce((acc, o) => acc + totalOrcamento(o.orcamento), 0)
        return { doDia, emAndamento, concluidasMes, faturamentoMes }
      },
    }),
    {
      name: 'dap-consultor/os',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => globalThis.localStorage.getItem(name),
        setItem: (name, value) => globalThis.localStorage.setItem(name, value),
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      })),
    },
  ),
)
