// src/app/consultor/components/SidePanel.tsx
import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: ReactNode
  subtitle?: ReactNode
  footer?: ReactNode
  children: ReactNode
  width?: number // default 460
}

export function SidePanel({ open, onOpenChange, title, subtitle, footer, children, width = 460 }: Props) {
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

            <Dialog.Content
              asChild
              aria-describedby={undefined}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
                style={{ width }}
                className="consultor fixed right-0 top-0 bottom-0 z-50 bg-[var(--bg-1)] border-l border-[var(--border)] flex flex-col focus:outline-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className="px-6 py-5 border-b border-[var(--border)] flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Dialog.Title className="text-lg font-semibold text-[var(--text-0)] truncate">{title}</Dialog.Title>
                    {subtitle && (
                      <Dialog.Description asChild>
                        <div className="text-sm text-[var(--text-1)] mt-1">{subtitle}</div>
                      </Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close
                    aria-label="Fechar"
                    className="size-8 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && (
                  <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-end gap-2">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
