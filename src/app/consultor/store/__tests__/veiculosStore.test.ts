// src/app/consultor/store/__tests__/veiculosStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useVeiculosStore } from '../veiculosStore'
import { resetAllStores } from './testUtils'
import type { Veiculo } from '../../types'

const makeVeiculo = (over: Partial<Veiculo> = {}): Veiculo => ({
  id: 'v-1',
  clienteId: 'c-1',
  marca: 'BMW',
  modelo: '330i',
  ano: 2022,
  placa: 'ABC1D23',
  cor: 'Preto',
  km: 10000,
  remap: 'stock',
  ...over,
})

describe('veiculosStore', () => {
  beforeEach(() => {
    resetAllStores()
    useVeiculosStore.setState({ items: [] })
  })

  it('add + getById', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    expect(useVeiculosStore.getState().getById('v-1')?.modelo).toBe('330i')
  })

  it('update patcheia km', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    useVeiculosStore.getState().update('v-1', { km: 25000 })
    expect(useVeiculosStore.getState().getById('v-1')?.km).toBe(25000)
  })

  it('remove apaga', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    useVeiculosStore.getState().remove('v-1')
    expect(useVeiculosStore.getState().items).toHaveLength(0)
  })

  it('getByCliente retorna só do cliente', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', clienteId: 'c-1' }))
    useVeiculosStore.getState().add(makeVeiculo({ id: 'b', clienteId: 'c-2' }))
    useVeiculosStore.getState().add(makeVeiculo({ id: 'c', clienteId: 'c-1' }))
    expect(useVeiculosStore.getState().getByCliente('c-1')).toHaveLength(2)
  })

  it('search por placa normalizada', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', placa: 'ABC1D23' }))
    expect(useVeiculosStore.getState().search('abc-1d23')).toHaveLength(1)
    expect(useVeiculosStore.getState().search('abc1')).toHaveLength(1)
  })

  it('search por modelo', () => {
    useVeiculosStore.getState().add(makeVeiculo({ id: 'a', modelo: 'M340i' }))
    expect(useVeiculosStore.getState().search('m340')).toHaveLength(1)
  })

  it('persiste key dap-consultor/veiculos', () => {
    useVeiculosStore.getState().add(makeVeiculo())
    expect(localStorage.getItem('dap-consultor/veiculos')).toBeTruthy()
  })
})
