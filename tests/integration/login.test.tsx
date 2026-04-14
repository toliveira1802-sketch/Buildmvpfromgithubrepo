// tests/integration/login.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import Login from '@/app/pages/Login'
import { useAuthStore } from '@/app/consultor/store/authStore'

describe('Login integração', () => {
  it('login bem sucedido redireciona pra /dashboard', async () => {
    useAuthStore.setState({ consultor: null, loading: false, error: null })
    localStorage.clear()
    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        { path: '/dashboard', element: <div>DASH</div> },
      ],
      { initialEntries: ['/login'] },
    )
    render(<RouterProvider router={router} />)
    await userEvent.type(screen.getByPlaceholderText(/voce@doctor/i), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'senha')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => expect(screen.getByText('DASH')).toBeInTheDocument())
    expect(useAuthStore.getState().consultor?.nome).toBe('Thales Oliveira')
  })
})
