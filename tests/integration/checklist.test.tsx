// tests/integration/checklist.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import AdminOSDetalhes from '@/app/pages/admin/AdminOSDetalhes'
import { useOSStore } from '@/app/consultor/store/osStore'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'

describe('Checklist integração', () => {
  beforeEach(() => {
    localStorage.clear()
    useClientesStore.setState({ items: [{ id: 'c-1', nome: 'Test', cpf: '11111111111', telefone: '1100000000', status: 'ativo', criadoEm: new Date().toISOString() }] })
    useVeiculosStore.setState({ items: [{ id: 'v-1', clienteId: 'c-1', marca: 'BMW', modelo: '330i', ano: 2022, placa: 'ABC1D23', cor: 'Preto', km: 10000, remap: 'stock' }] })
    useOSStore.setState({ items: [] })
    useOSStore.getState().create({ clienteId: 'c-1', veiculoId: 'v-1', tipoServico: 'revisao', kmEntrada: 10000, queixa: 'teste' })
  })

  it('marca item como OK e persiste', async () => {
    const os = useOSStore.getState().items[0]
    const router = createMemoryRouter([{ path: '/ordens-servico/:id', element: <AdminOSDetalhes /> }], { initialEntries: [`/ordens-servico/${os.id}`] })
    render(<RouterProvider router={router} />)
    await userEvent.click(screen.getByRole('tab', { name: /checklist/i }))
    // Escopa por dentro do tabpanel ativo pra evitar colisão
    const panel = await screen.findByRole('tabpanel')
    const okBtns = within(panel).getAllByRole('button', { name: /^OK$/ })
    await userEvent.click(okBtns[0])
    const after = useOSStore.getState().getById(os.id)!
    expect(after.checklist[0].status).toBe('ok')
  }, 15000)
})
