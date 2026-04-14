// src/app/consultor/components/WizardDrawer.tsx
import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
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
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild aria-describedby={undefined}>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 1 }}
                style={{ width: 680, maxWidth: '100vw' }}
                className="consultor fixed right-0 top-0 bottom-0 z-50 bg-[var(--bg-1)] border-l border-[var(--border)] flex flex-col focus:outline-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className="px-6 py-5 border-b border-[var(--border)]">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <Dialog.Title className="text-lg font-semibold text-[var(--text-0)]">{title}</Dialog.Title>
                    <Dialog.Close
                      aria-label="Fechar"
                      className="size-8 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]"
                    >
                      <X className="size-4" />
                    </Dialog.Close>
                  </div>
                  <Stepper steps={steps} current={current} />
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {children}
                </div>
                <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-between">
                  <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={onBack} disabled={current === 0}>Voltar</Button>
                    <Button variant="primary" onClick={onAdvance} disabled={!canAdvance}>{label}</Button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
