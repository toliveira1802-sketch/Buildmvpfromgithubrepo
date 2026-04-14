// tests/integration/wizardNovaOS.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import AdminOrdensServico from '@/app/pages/admin/AdminOrdensServico'
import { useClientesStore } from '@/app/consultor/store/clientesStore'
import { useVeiculosStore } from '@/app/consultor/store/veiculosStore'
import { useOSStore } from '@/app/consultor/store/osStore'

describe('Wizard Nova OS', () => {
  beforeEach(() => {
    localStorage.clear()
    useClientesStore.setState({ items: [] })
    useVeiculosStore.setState({ items: [] })
    useOSStore.setState({ items: [] })
  })

  it('cria OS com cliente e veículo novos', async () => {
    const router = createMemoryRouter(
      [
        { path: '/ordens-servico', element: <AdminOrdensServico /> },
        { path: '/ordens-servico/:id', element: <div>DETALHE</div> },
      ],
      { initialEntries: ['/ordens-servico?wizard=open'] },
    )
    render(<RouterProvider router={router} />)

    // WizardDrawer renders in a Radix portal. Scope queries to the dialog
    // so the list page's SearchInput (also a textbox) doesn't collide.
    const drawer = () => within(screen.getByRole('dialog'))

    // Etapa 1 — cliente novo
    await userEvent.click(drawer().getByRole('button', { name: /cadastrar novo/i }))
    let inputs = drawer().getAllByRole('textbox')
    await userEvent.type(inputs[0], 'João Teste')
    await userEvent.type(inputs[1], '99988877766')
    await userEvent.type(inputs[2], '11999887766')
    await userEvent.click(drawer().getByRole('button', { name: /^continuar$/i }))

    // Etapa 2 — veículo novo (sem veículo existente para esse cliente)
    inputs = drawer().getAllByRole('textbox')
    await userEvent.type(inputs[0], 'BMW')      // marca
    await userEvent.type(inputs[1], '330i')     // modelo
    await userEvent.type(inputs[2], '2023')     // ano
    await userEvent.type(inputs[3], 'XYZ9A88')  // placa
    await userEvent.type(inputs[4], 'Preto')    // cor
    await userEvent.type(inputs[5], '15000')    // km
    await userEvent.click(drawer().getByRole('button', { name: /^continuar$/i }))

    // Etapa 3 — serviço
    await userEvent.click(drawer().getByRole('button', { name: /^revisão$/i }))
    await userEvent.type(drawer().getByPlaceholderText(/cliente relata/i), 'Revisão programada 20k')
    await userEvent.click(drawer().getByRole('button', { name: /^continuar$/i }))

    // Etapa 4 — resumo + criar
    await userEvent.click(drawer().getByRole('button', { name: /criar os/i }))

    await waitFor(() => expect(screen.getByText('DETALHE')).toBeInTheDocument())
    expect(useOSStore.getState().items).toHaveLength(1)
    expect(useClientesStore.getState().items).toHaveLength(1)
    expect(useVeiculosStore.getState().items).toHaveLength(1)
  }, 15000)
})
