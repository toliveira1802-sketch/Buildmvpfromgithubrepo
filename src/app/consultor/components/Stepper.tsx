// src/app/consultor/components/Stepper.tsx
import { Check } from 'lucide-react'

interface Props {
  steps: string[]
  current: number
}

type State = 'completo' | 'ativo' | 'pendente'

function stateOf(i: number, current: number): State {
  if (i < current) return 'completo'
  if (i === current) return 'ativo'
  return 'pendente'
}

export function Stepper({ steps, current }: Props) {
  return (
    <ol className="flex items-center gap-0 w-full">
      {steps.map((label, i) => {
        const state = stateOf(i, current)
        const isLast = i === steps.length - 1
        return (
          <li key={label} data-state={state} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-3">
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-[220ms] ${
                  state === 'ativo'
                    ? 'bg-[var(--brand)] text-white'
                    : state === 'completo'
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-[var(--bg-3)] text-[var(--text-2)]'
                }`}
              >
                {state === 'completo' ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={`text-xs font-medium tracking-wide ${
                  state === 'pendente' ? 'text-[var(--text-2)]' : 'text-[var(--text-0)]'
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-px mx-3 bg-[var(--border-strong)]">
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-[360ms]"
                  style={{ width: state === 'completo' ? '100%' : '0%' }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
