import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidePanel } from '../SidePanel'

describe('SidePanel', () => {
  it('aberto mostra children e título', () => {
    render(<SidePanel open onOpenChange={() => {}} title="Detalhes"><p>Conteúdo</p></SidePanel>)
    expect(screen.getByText('Detalhes')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('dispara onOpenChange(false) ao clicar em close', async () => {
    const fn = vi.fn()
    render(<SidePanel open onOpenChange={fn} title="X"><p /></SidePanel>)
    await userEvent.click(screen.getByLabelText('Fechar'))
    expect(fn).toHaveBeenCalledWith(false)
  })
})
