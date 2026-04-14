import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardDrawer } from '../WizardDrawer'

describe('WizardDrawer', () => {
  it('renderiza etapa atual', () => {
    render(
      <WizardDrawer
        open
        onOpenChange={() => {}}
        title="Novo"
        steps={['A', 'B']}
        current={0}
        canAdvance={true}
        onAdvance={() => {}}
        onBack={() => {}}
        onCancel={() => {}}
      >
        <p>Etapa A</p>
      </WizardDrawer>,
    )
    expect(screen.getByText('Etapa A')).toBeInTheDocument()
  })

  it('onAdvance dispara quando Continuar clicado', async () => {
    const fn = vi.fn()
    render(
      <WizardDrawer
        open
        onOpenChange={() => {}}
        title="Novo"
        steps={['A', 'B']}
        current={0}
        canAdvance={true}
        onAdvance={fn}
        onBack={() => {}}
        onCancel={() => {}}
      >
        <p>X</p>
      </WizardDrawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(fn).toHaveBeenCalled()
  })

  it('Continuar desabilitado quando canAdvance=false', () => {
    render(
      <WizardDrawer
        open
        onOpenChange={() => {}}
        title="Novo"
        steps={['A', 'B']}
        current={0}
        canAdvance={false}
        onAdvance={() => {}}
        onBack={() => {}}
        onCancel={() => {}}
      >
        <p />
      </WizardDrawer>,
    )
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })
})
