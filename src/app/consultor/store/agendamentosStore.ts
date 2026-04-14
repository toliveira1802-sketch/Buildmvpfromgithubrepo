// src/app/consultor/store/agendamentosStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Agendamento, StatusAgendamento } from '../types'

interface AgendamentosState {
  items: Agendamento[]
  add: (a: Agendamento) => void
  update: (id: string, patch: Partial<Agendamento>) => void
  remove: (id: string) => void
  getById: (id: string) => Agendamento | undefined
  updateStatus: (id: string, next: StatusAgendamento, meta?: { osIdGerada?: string }) => void
  byDay: () => Map<string, Agendamento[]> // key = 'YYYY-MM-DD'
}

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}

export const useAgendamentosStore = create<AgendamentosState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (a) => set((s) => ({ items: [...s.items, a] })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((a) => a.id !== id) })),
      getById: (id) => get().items.find((a) => a.id === id),
      updateStatus: (id, next, meta) =>
        set((s) => ({
          items: s.items.map((a) =>
            a.id === id ? { ...a, status: next, ...(meta?.osIdGerada ? { osIdGerada: meta.osIdGerada } : {}) } : a,
          ),
        })),
      byDay: () => {
        const m = new Map<string, Agendamento[]>()
        for (const a of get().items) {
          const k = dayKey(a.dataHora)
          const arr = m.get(k) ?? []
          arr.push(a)
          m.set(k, arr)
        }
        for (const arr of m.values()) {
          arr.sort((x, y) => x.dataHora.localeCompare(y.dataHora))
        }
        return m
      },
    }),
    {
      name: 'dap-consultor/agendamentos',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => globalThis.localStorage.getItem(name),
        setItem: (name, value) => globalThis.localStorage.setItem(name, value),
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      })),
    },
  ),
)
