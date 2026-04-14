// src/app/consultor/store/__tests__/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import { resetAllStores } from './testUtils'

describe('authStore', () => {
  beforeEach(() => {
    resetAllStores()
    useAuthStore.setState({ consultor: null, loading: false, error: null })
  })

  it('inicia deslogado', () => {
    expect(useAuthStore.getState().consultor).toBeNull()
  })

  it('login seta consultor e persiste', async () => {
    await useAuthStore.getState().login('thales@doctor.com', 'senha')
    expect(useAuthStore.getState().consultor?.nome).toBe('Thales Oliveira')
    const persisted = JSON.parse(localStorage.getItem('dap-consultor/auth') || '{}')
    expect(persisted.state.consultor?.nome).toBe('Thales Oliveira')
  })

  it('login rejeita email vazio', async () => {
    await expect(useAuthStore.getState().login('', 'senha')).rejects.toThrow('Email obrigatório')
  })

  it('login rejeita senha vazia', async () => {
    await expect(useAuthStore.getState().login('a@b.com', '')).rejects.toThrow('Senha obrigatória')
  })

  it('logout limpa consultor', async () => {
    await useAuthStore.getState().login('a@b.com', 'x')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().consultor).toBeNull()
  })
})
