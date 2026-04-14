// tests/integration/navegacao.test.tsx
// In vitest's jsdom env, global.AbortController/AbortSignal come from jsdom
// but global.Request is Node's — so `new Request(url, { signal })` rejects
// jsdom's AbortSignal. Patch Request to strip jsdom signals (we do not need
// actual aborts in a memory router test).
{
  const OrigRequest = globalThis.Request
  class PatchedRequest extends OrigRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init && 'signal' in init) {
        const { signal: _discard, ...rest } = init
        super(input, rest)
      } else {
        super(input, init)
      }
    }
  }
  ;(globalThis as any).Request = PatchedRequest
}

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router'
import ConsultorLayout from '@/app/components/ConsultorLayout'
import { useAuthStore } from '@/app/consultor/store/authStore'
import { SEED_CONSULTOR } from '@/app/consultor/store/seed'

function Shell() {
  return <ConsultorLayout><Outlet /></ConsultorLayout>
}

describe('Sidebar nav', () => {
  it('clica em Clientes e muda a rota', async () => {
    useAuthStore.setState({ consultor: SEED_CONSULTOR, loading: false, error: null })
    const router = createMemoryRouter(
      [
        {
          Component: Shell,
          children: [
            { path: '/dashboard', element: <div>DASH</div> },
            { path: '/clientes', element: <div>CLI</div> },
            { path: '/veiculos', element: <div>VEI</div> },
            { path: '/ordens-servico', element: <div>OS</div> },
          ],
        },
      ],
      { initialEntries: ['/dashboard'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText('DASH')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: /clientes/i }))
    expect(screen.getByText('CLI')).toBeInTheDocument()
  })
})
