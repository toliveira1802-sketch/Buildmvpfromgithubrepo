import { describe, it, expect, beforeEach } from 'vitest'
import { useAgendamentosStore } from '../agendamentosStore'
import { resetAllStores } from './testUtils'
import type { Agendamento } from '../../types'

const make = (over: Partial<Agendamento> = {}): Agendamento => ({
  id: 'ag-1',
  clienteId: 'c-1',
  veiculoId: 'v-1',
  dataHora: '2026-04-14T10:00:00Z',
  duracaoMinutos: 60,
  tipoServico: 'revisao',
  status: 'agendado',
  criadoEm: '2026-04-10T10:00:00Z',
  ...over,
})

describe('agendamentosStore', () => {
  beforeEach(() => {
    resetAllStores()
    useAgendamentosStore.setState({ items: [] })
  })

  it('add + getById', () => {
    useAgendamentosStore.getState().add(make())
    expect(useAgendamentosStore.getState().getById('ag-1')?.status).toBe('agendado')
  })

  it('updateStatus muda status', () => {
    useAgendamentosStore.getState().add(make())
    useAgendamentosStore.getState().updateStatus('ag-1', 'confirmado')
    expect(useAgendamentosStore.getState().getById('ag-1')?.status).toBe('confirmado')
  })

  it('updateStatus compareceu grava osIdGerada', () => {
    useAgendamentosStore.getState().add(make())
    useAgendamentosStore.getState().updateStatus('ag-1', 'compareceu', { osIdGerada: 'OS-2026-0099' })
    expect(useAgendamentosStore.getState().getById('ag-1')?.osIdGerada).toBe('OS-2026-0099')
  })

  it('persiste em dap-consultor/agendamentos', () => {
    useAgendamentosStore.getState().add(make())
    expect(localStorage.getItem('dap-consultor/agendamentos')).toBeTruthy()
  })
})
