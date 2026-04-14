// src/app/consultor/store/veiculosStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Veiculo } from '../types'
import { normalizaPlaca } from '../lib/formatters'

interface VeiculosState {
  items: Veiculo[]
  add: (v: Veiculo) => void
  update: (id: string, patch: Partial<Veiculo>) => void
  remove: (id: string) => void
  getById: (id: string) => Veiculo | undefined
  getByCliente: (clienteId: string) => Veiculo[]
  search: (query: string) => Veiculo[]
}

export const useVeiculosStore = create<VeiculosState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (v) => set((s) => ({ items: [...s.items, v] })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((v) => v.id !== id) })),
      getById: (id) => get().items.find((v) => v.id === id),
      getByCliente: (clienteId) => get().items.filter((v) => v.clienteId === clienteId),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const placaQ = normalizaPlaca(q)
        return get().items.filter((v) => {
          if (placaQ && normalizaPlaca(v.placa).includes(placaQ)) return true
          if (v.modelo.toLowerCase().includes(q)) return true
          if (v.marca.toLowerCase().includes(q)) return true
          return false
        })
      },
    }),
    {
      name: 'dap-consultor/veiculos',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => globalThis.localStorage.getItem(name),
        setItem: (name, value) => globalThis.localStorage.setItem(name, value),
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      })),
    },
  ),
)
