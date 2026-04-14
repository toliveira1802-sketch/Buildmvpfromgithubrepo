// src/app/consultor/store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Consultor } from '../types'
import { SEED_CONSULTOR } from './seed'

interface AuthState {
  consultor: Consultor | null
  loading: boolean
  error: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      consultor: null,
      loading: false,
      error: null,
      login: async (email, senha) => {
        if (!email.trim()) throw new Error('Email obrigatório')
        if (!senha.trim()) throw new Error('Senha obrigatória')
        set({ loading: true, error: null })
        await new Promise((r) => setTimeout(r, 400))
        set({ consultor: SEED_CONSULTOR, loading: false })
      },
      logout: () => set({ consultor: null, error: null }),
    }),
    {
      name: 'dap-consultor/auth',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => globalThis.localStorage.getItem(name),
        setItem: (name, value) => globalThis.localStorage.setItem(name, value),
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      })),
    },
  ),
)
