// src/app/consultor/store/__tests__/clientesStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useClientesStore } from '../clientesStore'
import { resetAllStores } from './testUtils'
import type { Cliente } from '../../types'

const makeCliente = (over: Partial<Cliente> = {}): Cliente => ({
  id: 'c-1',
  nome: 'Teste',
  cpf: '11111111111',
  telefone: '11999990000',
  status: 'ativo',
  criadoEm: new Date().toISOString(),
  ...over,
})

describe('clientesStore', () => {
  beforeEach(() => {
    resetAllStores()
    useClientesStore.setState({ items: [] })
  })

  it('add insere cliente', () => {
    useClientesStore.getState().add(makeCliente())
    expect(useClientesStore.getState().items).toHaveLength(1)
  })

  it('update altera por id', () => {
    useClientesStore.getState().add(makeCliente())
    useClientesStore.getState().update('c-1', { nome: 'Novo' })
    expect(useClientesStore.getState().getById('c-1')?.nome).toBe('Novo')
  })

  it('remove apaga por id', () => {
    useClientesStore.getState().add(makeCliente())
    useClientesStore.getState().remove('c-1')
    expect(useClientesStore.getState().items).toHaveLength(0)
  })

  it('search por nome case-insensitive', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', nome: 'Rafael Moreira' }))
    useClientesStore.getState().add(makeCliente({ id: 'b', nome: 'Juliana Tavares' }))
    const result = useClientesStore.getState().search('rafa')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('search por cpf parcial (ignorando máscara)', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', cpf: '12345678901' }))
    const result = useClientesStore.getState().search('123.456')
    expect(result).toHaveLength(1)
  })

  it('search por telefone parcial', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a', telefone: '11987654321' }))
    const result = useClientesStore.getState().search('98765')
    expect(result).toHaveLength(1)
  })

  it('search vazio retorna tudo', () => {
    useClientesStore.getState().add(makeCliente({ id: 'a' }))
    useClientesStore.getState().add(makeCliente({ id: 'b' }))
    expect(useClientesStore.getState().search('')).toHaveLength(2)
  })

  it('persiste em localStorage key dap-consultor/clientes', () => {
    useClientesStore.getState().add(makeCliente())
    const raw = localStorage.getItem('dap-consultor/clientes')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.state.items).toHaveLength(1)
  })
})
