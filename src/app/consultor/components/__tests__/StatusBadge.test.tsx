import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('OS aguardando', () => {
    render(<StatusBadge tipo="os" valor="aguardando" />)
    expect(screen.getByText('Aguardando')).toBeInTheDocument()
  })
  it('cliente vip', () => {
    render(<StatusBadge tipo="cliente" valor="vip" />)
    expect(screen.getByText('VIP')).toBeInTheDocument()
  })
  it('data-variant reflete valor', () => {
    render(<StatusBadge tipo="os" valor="concluida" />)
    expect(screen.getByText('Concluída').closest('[data-variant]')).toHaveAttribute('data-variant', 'concluida')
  })
})
