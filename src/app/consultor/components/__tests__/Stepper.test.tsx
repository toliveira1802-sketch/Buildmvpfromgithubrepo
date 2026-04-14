import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from '../Stepper'

describe('Stepper', () => {
  it('renderiza n steps', () => {
    render(<Stepper steps={['Um', 'Dois', 'Três']} current={0} />)
    expect(screen.getByText('Um')).toBeInTheDocument()
    expect(screen.getByText('Três')).toBeInTheDocument()
  })
  it('marca current e passados com data-state', () => {
    render(<Stepper steps={['A', 'B', 'C']} current={1} />)
    expect(screen.getByText('A').closest('[data-state]')).toHaveAttribute('data-state', 'completo')
    expect(screen.getByText('B').closest('[data-state]')).toHaveAttribute('data-state', 'ativo')
    expect(screen.getByText('C').closest('[data-state]')).toHaveAttribute('data-state', 'pendente')
  })
})
