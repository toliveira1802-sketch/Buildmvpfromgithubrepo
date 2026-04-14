// src/app/consultor/store/__tests__/osStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useOSStore } from '../osStore'
import { useClientesStore } from '../clientesStore'
import { useVeiculosStore } from '../veiculosStore'
import { resetAllStores } from './testUtils'
import type { CreateOSDraft } from '../../types'

const baseDraft: CreateOSDraft = {
  clienteId: 'c-1',
  veiculoId: 'v-1',
  tipoServico: 'revisao',
  kmEntrada: 10000,
  queixa: 'Revisão',
}

describe('osStore', () => {
  beforeEach(() => {
    resetAllStores()
    useOSStore.setState({ items: [] })
    useClientesStore.setState({ items: [] })
    useVeiculosStore.setState({ items: [] })
  })

  describe('create', () => {
    it('gera id OS-YYYY-0001 quando vazio', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.id).toMatch(/^OS-\d{4}-0001$/)
    })

    it('incrementa id na criação subsequente', () => {
      useOSStore.getState().create(baseDraft)
      const os = useOSStore.getState().create(baseDraft)
      expect(os.id).toMatch(/0002$/)
    })

    it('inicializa checklist template com 14 itens', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.checklist).toHaveLength(14)
      expect(os.checklist[0].status).toBeNull()
    })

    it('inicializa orcamento pendente vazio', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.orcamento.linhas).toEqual([])
      expect(os.orcamento.aprovacao).toBe('pendente')
    })

    it('status inicial aguardando', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(os.status).toBe('aguardando')
    })
  })

  describe('updateStatus — transições', () => {
    it('aguardando → em_andamento OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('em_andamento')
    })

    it('aguardando → concluida inválido', () => {
      const os = useOSStore.getState().create(baseDraft)
      expect(() => useOSStore.getState().updateStatus(os.id, 'concluida')).toThrow(/transição inválida/i)
    })

    it('em_andamento → concluida OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      useOSStore.getState().updateStatus(os.id, 'concluida')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('concluida')
    })

    it('concluida é terminal', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'em_andamento')
      useOSStore.getState().updateStatus(os.id, 'concluida')
      expect(() => useOSStore.getState().updateStatus(os.id, 'em_andamento')).toThrow()
    })

    it('cancelada é terminal', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'cancelada')
      expect(() => useOSStore.getState().updateStatus(os.id, 'em_andamento')).toThrow()
    })

    it('aguardando → cancelada OK', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(os.id, 'cancelada')
      expect(useOSStore.getState().getById(os.id)?.status).toBe('cancelada')
    })
  })

  describe('updateChecklist', () => {
    it('substitui checklist', () => {
      const os = useOSStore.getState().create(baseDraft)
      const updated = os.checklist.map((i, idx) => ({ ...i, status: idx === 0 ? 'ok' as const : null }))
      useOSStore.getState().updateChecklist(os.id, updated)
      expect(useOSStore.getState().getById(os.id)?.checklist[0].status).toBe('ok')
    })
  })

  describe('updateOrcamento', () => {
    it('atualiza linhas', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(os.id, {
        linhas: [{ id: 'l1', tipo: 'servico', descricao: 'X', quantidade: 1, valorUnitario: 10000 }],
        aprovacao: 'pendente',
      })
      expect(useOSStore.getState().getById(os.id)?.orcamento.linhas).toHaveLength(1)
    })

    it('aprovado seta aprovadoEm', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(os.id, { linhas: [], aprovacao: 'aprovado' })
      expect(useOSStore.getState().getById(os.id)?.orcamento.aprovadoEm).toBeTruthy()
    })
  })

  describe('updateEntrega', () => {
    it('grava dados de entrega', () => {
      const os = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateEntrega(os.id, {
        kmSaida: 10100,
        formaPagamento: 'pix',
        observacoes: 'ok',
      })
      const after = useOSStore.getState().getById(os.id)!
      expect(after.entrega.kmSaida).toBe(10100)
      expect(after.entrega.formaPagamento).toBe('pix')
    })
  })

  describe('filterByStatus', () => {
    it('filtra por status único', () => {
      const a = useOSStore.getState().create(baseDraft)
      useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(a.id, 'em_andamento')
      expect(useOSStore.getState().filterByStatus('em_andamento')).toHaveLength(1)
      expect(useOSStore.getState().filterByStatus('aguardando')).toHaveLength(1)
    })
  })

  describe('search', () => {
    beforeEach(() => {
      useOSStore.getState().create(baseDraft)
    })
    it('busca por id parcial', () => {
      expect(useOSStore.getState().search('0001')).toHaveLength(1)
    })
    it('busca case-insensitive', () => {
      expect(useOSStore.getState().search('os-')).toHaveLength(1)
    })
    it('vazio retorna tudo', () => {
      expect(useOSStore.getState().search('')).toHaveLength(1)
    })

    it('busca por nome do cliente', () => {
      useClientesStore.getState().add({
        id: 'c-1', nome: 'Rafael Moreira', cpf: '11111111111',
        telefone: '11999990000', status: 'ativo', criadoEm: new Date().toISOString(),
      })
      expect(useOSStore.getState().search('rafael')).toHaveLength(1)
    })

    it('busca por placa do veículo', () => {
      useVeiculosStore.getState().add({
        id: 'v-1', clienteId: 'c-1', marca: 'BMW', modelo: '330i',
        ano: 2022, placa: 'ABC1D23', cor: 'Preto', km: 10000, remap: 'stock',
      })
      expect(useOSStore.getState().search('abc1d23')).toHaveLength(1)
    })
  })

  describe('metrics', () => {
    it('conta OS do dia', () => {
      useOSStore.getState().create(baseDraft)
      expect(useOSStore.getState().metrics().doDia).toBe(1)
    })
    it('conta em_andamento', () => {
      const o = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateStatus(o.id, 'em_andamento')
      expect(useOSStore.getState().metrics().emAndamento).toBe(1)
    })
    it('soma faturamento do mês (concluídas)', () => {
      const o = useOSStore.getState().create(baseDraft)
      useOSStore.getState().updateOrcamento(o.id, {
        linhas: [{ id: 'l', tipo: 'servico', descricao: 'X', quantidade: 2, valorUnitario: 50000 }],
        aprovacao: 'aprovado',
      })
      useOSStore.getState().updateStatus(o.id, 'em_andamento')
      useOSStore.getState().updateStatus(o.id, 'concluida')
      expect(useOSStore.getState().metrics().faturamentoMes).toBe(100000)
    })
  })
})
