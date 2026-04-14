// src/app/consultor/store/clientesStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Cliente } from '../types'
import { normalizaDigitos } from '../lib/formatters'

interface ClientesState {
  items: Cliente[]
  add: (c: Cliente) => void
  update: (id: string, patch: Partial<Cliente>) => void
  remove: (id: string) => void
  getById: (id: string) => Cliente | undefined
  search: (query: string) => Cliente[]
}

export const useClientesStore = create<ClientesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (c) => set((s) => ({ items: [...s.items, c] })),
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((c) => c.id !== id) })),
      getById: (id) => get().items.find((c) => c.id === id),
      search: (query) => {
        const q = query.trim().toLowerCase()
        if (!q) return get().items
        const qDigits = normalizaDigitos(q)
        return get().items.filter((c) => {
          if (c.nome.toLowerCase().includes(q)) return true
          if (qDigits && normalizaDigitos(c.cpf).includes(qDigits)) return true
          if (qDigits && normalizaDigitos(c.telefone).includes(qDigits)) return true
          if (c.email?.toLowerCase().includes(q)) return true
          return false
        })
      },
    }),
    {
      name: 'dap-consultor/clientes',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => globalThis.localStorage.getItem(name),
        setItem: (name, value) => globalThis.localStorage.setItem(name, value),
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      })),
    },
  ),
)
