// src/app/consultor/components/WizardDrawer.tsx
import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Stepper } from './Stepper'
import { Button } from './Button'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: ReactNode
  steps: string[]
  current: number
  canAdvance: boolean
  onAdvance: () => void
  onBack: () => void
  onCancel: () => void
  advanceLabel?: string
  children: ReactNode
}

export function WizardDrawer({
  open, onOpenChange, title, steps, current, canAdvance,
  onAdvance, onBack, onCancel, advanceLabel, children,
}: Props) {
  const isLast = current === steps.length - 1
  const label = advanceLabel ?? (isLast ? 'Criar OS' : 'Continuar')
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          style={{ width: 680 }}
          className="fixed right-0 top-0 bottom-0 z-50 bg-[var(--bg-1)] border-l border-[var(--border)] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right duration-300 focus:outline-none"
        >
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <Dialog.Title className="text-lg font-semibold text-[var(--text-0)]">{title}</Dialog.Title>
              <Dialog.Close aria-label="Fechar" className="size-8 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]">
                <X className="size-4" />
              </Dialog.Close>
            </div>
            <Stepper steps={steps} current={current} />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-between">
            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onBack} disabled={current === 0}>Voltar</Button>
              <Button variant="primary" onClick={onAdvance} disabled={!canAdvance}>{label}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
