// src/app/consultor/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
  it('dispara onClick', async () => {
    const fn = vi.fn()
    render(<Button onClick={fn}>Ok</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledOnce()
  })
  it('desabilita quando disabled', async () => {
    const fn = vi.fn()
    render(<Button onClick={fn} disabled>Ok</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).not.toHaveBeenCalled()
  })
  it('aplica variante via data-variant', () => {
    render(<Button variant="primary">Ok</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary')
  })
})
