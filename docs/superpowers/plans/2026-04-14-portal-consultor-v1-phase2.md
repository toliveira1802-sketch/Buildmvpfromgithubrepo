# Portal Consultor V1 — Fase 2: Componentes

> Continuação de `2026-04-14-portal-consultor-v1.md`. Só começar após checkpoint verde da Fase 1.

**Stack**: React 19, Radix UI (para comportamento a11y), Framer Motion (via `motion`), Lucide Icons, Tailwind v4.

**Convenção de teste por componente**: render smoke + 1–3 interações críticas. Não testar cor/estilo (visual).

---

## Task 2.1: Button

**Files:**
- Create: `src/app/consultor/components/__tests__/Button.test.tsx`
- Create: `src/app/consultor/components/Button.tsx`

- [ ] **Step 1: Teste**

```tsx
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
```

- [ ] **Step 2: Implementar**

```tsx
// src/app/consultor/components/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:opacity-50',
  secondary:
    'border border-[var(--border)] text-[var(--text-0)] hover:bg-[var(--bg-3)] hover:border-[var(--border-strong)] disabled:opacity-50',
  ghost:
    'text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] disabled:opacity-50',
  danger:
    'bg-[var(--danger)] text-white hover:opacity-90 disabled:opacity-50',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors duration-[140ms] focus-visible:outline-none ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {loading ? <span className="size-3 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
})
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/Button.test.tsx
git add src/app/consultor/components/Button.tsx src/app/consultor/components/__tests__/Button.test.tsx
git commit -m "feat(consultor): Button com 4 variantes e loading"
```

## Task 2.2: StatusBadge

**Files:**
- Create: `src/app/consultor/components/__tests__/StatusBadge.test.tsx`
- Create: `src/app/consultor/components/StatusBadge.tsx`

- [ ] **Step 1: Teste**

```tsx
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
```

- [ ] **Step 2: Implementar**

```tsx
// src/app/consultor/components/StatusBadge.tsx
import type { StatusOS, StatusCliente, AprovacaoOrcamento } from '../types'

type Tipo = 'os' | 'cliente' | 'aprovacao'
type Valor = StatusOS | StatusCliente | AprovacaoOrcamento

interface Props {
  tipo: Tipo
  valor: Valor
}

const labels: Record<string, string> = {
  aguardando: 'Aguardando',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  ativo: 'Ativo',
  inativo: 'Inativo',
  vip: 'VIP',
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
}

const colorVar: Record<string, string> = {
  aguardando: 'var(--warning)',
  em_andamento: 'var(--info)',
  concluida: 'var(--success)',
  cancelada: 'var(--danger)',
  ativo: 'var(--success)',
  inativo: 'var(--text-3)',
  vip: 'var(--vip)',
  pendente: 'var(--warning)',
  aprovado: 'var(--success)',
  rejeitado: 'var(--danger)',
}

export function StatusBadge({ tipo, valor }: Props) {
  const color = colorVar[valor] ?? 'var(--text-2)'
  return (
    <span
      data-tipo={tipo}
      data-variant={valor}
      className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-xs font-medium uppercase tracking-wide"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {labels[valor] ?? valor}
    </span>
  )
}
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/StatusBadge.test.tsx
git add src/app/consultor/components/StatusBadge.tsx src/app/consultor/components/__tests__/StatusBadge.test.tsx
git commit -m "feat(consultor): StatusBadge com variantes OS/cliente/aprovação"
```

## Task 2.3: SearchInput

**Files:**
- Create: `src/app/consultor/components/__tests__/SearchInput.test.tsx`
- Create: `src/app/consultor/components/SearchInput.tsx`

- [ ] **Step 1: Teste**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  it('chama onChange', async () => {
    const fn = vi.fn()
    render(<SearchInput value="" onChange={fn} placeholder="Buscar" />)
    await userEvent.type(screen.getByPlaceholderText('Buscar'), 'a')
    expect(fn).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Implementar**

```tsx
// src/app/consultor/components/SearchInput.tsx
import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar', autoFocus, className = '' }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  return (
    <div className={`relative ${className}`}>
      <Search className="size-4 text-[var(--text-2)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full pl-9 pr-9 rounded-[6px] bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text-0)] placeholder:text-[var(--text-2)] text-sm focus-visible:outline-none focus:border-[var(--brand)]"
      />
      <kbd className="mono absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-3)] border border-[var(--border)] rounded px-1 py-0.5 hidden sm:inline-block">
        ⌘K
      </kbd>
    </div>
  )
}
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/SearchInput.test.tsx
git add src/app/consultor/components/SearchInput.tsx src/app/consultor/components/__tests__/SearchInput.test.tsx
git commit -m "feat(consultor): SearchInput com atalho cmd+k"
```

## Task 2.4: EmptyState

**Files:**
- Create: `src/app/consultor/components/EmptyState.tsx`

- [ ] **Step 1: Implementar (sem teste — puramente apresentacional)**

```tsx
// src/app/consultor/components/EmptyState.tsx
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  titulo: string
  descricao?: string
  acao?: ReactNode
}

export function EmptyState({ icon: Icon, titulo, descricao, acao }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center mb-5">
        <Icon className="size-7 text-[var(--text-2)]" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-0)] mb-1.5">{titulo}</h3>
      {descricao && <p className="text-sm text-[var(--text-1)] max-w-sm mb-5">{descricao}</p>}
      {acao}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/components/EmptyState.tsx
git commit -m "feat(consultor): EmptyState"
```

## Task 2.5: StatCard

**Files:**
- Create: `src/app/consultor/components/StatCard.tsx`

- [ ] **Step 1: Implementar**

```tsx
// src/app/consultor/components/StatCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'

interface Props {
  label: string
  valor: string
  delta?: { valor: number; direcao: 'up' | 'down' } // valor em %
  hint?: string
  children?: ReactNode
}

export function StatCard({ label, valor, delta, hint, children }: Props) {
  return (
    <div className="group rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors duration-[140ms] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-[var(--text-2)] font-medium">{label}</span>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs mono font-medium ${
              delta.direcao === 'up' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
            }`}
          >
            {delta.direcao === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta.valor.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mono text-[28px] leading-9 font-semibold text-[var(--text-0)]">{valor}</div>
      {hint && <div className="text-xs text-[var(--text-2)] mt-2">{hint}</div>}
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/components/StatCard.tsx
git commit -m "feat(consultor): StatCard com delta opcional"
```

## Task 2.6: Stepper

**Files:**
- Create: `src/app/consultor/components/__tests__/Stepper.test.tsx`
- Create: `src/app/consultor/components/Stepper.tsx`

- [ ] **Step 1: Teste**

```tsx
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
```

- [ ] **Step 2: Implementar**

```tsx
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
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/Stepper.test.tsx
git add src/app/consultor/components/Stepper.tsx src/app/consultor/components/__tests__/Stepper.test.tsx
git commit -m "feat(consultor): Stepper horizontal"
```

## Task 2.7: DataTable

**Files:**
- Create: `src/app/consultor/components/__tests__/DataTable.test.tsx`
- Create: `src/app/consultor/components/DataTable.tsx`

- [ ] **Step 1: Teste**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from '../DataTable'

interface Row { id: string; nome: string; idade: number }
const data: Row[] = [
  { id: '1', nome: 'Ana', idade: 30 },
  { id: '2', nome: 'Bruno', idade: 25 },
]

describe('DataTable', () => {
  it('renderiza linhas', () => {
    render(
      <DataTable
        data={data}
        columns={[
          { key: 'nome', header: 'Nome', render: (r) => r.nome },
          { key: 'idade', header: 'Idade', render: (r) => r.idade },
        ]}
        rowKey={(r) => r.id}
      />,
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('dispara onRowClick', async () => {
    const fn = vi.fn()
    render(
      <DataTable
        data={data}
        columns={[{ key: 'nome', header: 'Nome', render: (r) => r.nome }]}
        rowKey={(r) => r.id}
        onRowClick={fn}
      />,
    )
    await userEvent.click(screen.getByText('Ana'))
    expect(fn).toHaveBeenCalledWith(data[0])
  })

  it('mostra emptyState quando vazio', () => {
    render(
      <DataTable
        data={[]}
        columns={[{ key: 'nome', header: 'Nome', render: (r: Row) => r.nome }]}
        rowKey={(r) => r.id}
        emptyState={<div>Sem dados</div>}
      />,
    )
    expect(screen.getByText('Sem dados')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Implementar**

```tsx
// src/app/consultor/components/DataTable.tsx
import { ReactNode, useMemo, useState } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'right' | 'center'
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: (r: T) => string
  onRowClick?: (r: T) => void
  emptyState?: ReactNode
  pageSize?: number
}

export function DataTable<T>({ data, columns, rowKey, onRowClick, emptyState, pageSize = 20 }: Props<T>) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(data.length / pageSize))
  const pageData = useMemo(
    () => data.slice(page * pageSize, (page + 1) * pageSize),
    [data, page, pageSize],
  )

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="rounded-[10px] bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--bg-2)]">
            <tr className="border-b border-[var(--border)]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-2)]"
                  style={{ width: c.width, textAlign: c.align ?? 'left' }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-[var(--border)] last:border-b-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-[var(--bg-3)]' : ''
                } transition-colors duration-[140ms]`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-4 py-3.5 text-[var(--text-0)]"
                    style={{ textAlign: c.align ?? 'left' }}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] text-xs text-[var(--text-2)]">
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} de {data.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 px-3 rounded-[6px] hover:bg-[var(--bg-3)] disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page >= pages - 1}
              className="h-8 px-3 rounded-[6px] hover:bg-[var(--bg-3)] disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/DataTable.test.tsx
git add src/app/consultor/components/DataTable.tsx src/app/consultor/components/__tests__/DataTable.test.tsx
git commit -m "feat(consultor): DataTable genérica com paginação"
```

## Task 2.8: SidePanel

**Files:**
- Create: `src/app/consultor/components/__tests__/SidePanel.test.tsx`
- Create: `src/app/consultor/components/SidePanel.tsx`

- [ ] **Step 1: Teste**

```tsx
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
```

- [ ] **Step 2: Implementar**

```tsx
// src/app/consultor/components/SidePanel.tsx
import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
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
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          style={{ width }}
          className="fixed right-0 top-0 bottom-0 z-50 bg-[var(--bg-1)] border-l border-[var(--border)] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right duration-300 focus:outline-none"
        >
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold text-[var(--text-0)] truncate">{title}</Dialog.Title>
              {subtitle && <Dialog.Description asChild><div className="text-sm text-[var(--text-1)] mt-1">{subtitle}</div></Dialog.Description>}
            </div>
            <Dialog.Close aria-label="Fechar" className="size-8 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-2)] flex items-center justify-end gap-2">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/SidePanel.test.tsx
git add src/app/consultor/components/SidePanel.tsx src/app/consultor/components/__tests__/SidePanel.test.tsx
git commit -m "feat(consultor): SidePanel baseado em Radix Dialog"
```

## Task 2.9: WizardDrawer

**Files:**
- Create: `src/app/consultor/components/__tests__/WizardDrawer.test.tsx`
- Create: `src/app/consultor/components/WizardDrawer.tsx`

- [ ] **Step 1: Teste**

```tsx
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
        steps={['A']}
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
```

- [ ] **Step 2: Implementar**

```tsx
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
```

- [ ] **Step 3: Passar + commit**

```bash
npx vitest run src/app/consultor/components/__tests__/WizardDrawer.test.tsx
git add src/app/consultor/components/WizardDrawer.tsx src/app/consultor/components/__tests__/WizardDrawer.test.tsx
git commit -m "feat(consultor): WizardDrawer 680px com Stepper + footer"
```

## Task 2.10: Tabs

**Files:**
- Create: `src/app/consultor/components/Tabs.tsx`

- [ ] **Step 1: Implementar (wrap Radix Tabs)**

```tsx
// src/app/consultor/components/Tabs.tsx
import { ReactNode } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'

interface Tab {
  value: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: Tab[]
  value: string
  onValueChange: (v: string) => void
}

export function Tabs({ tabs, value, onValueChange }: Props) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className="w-full">
      <RadixTabs.List className="flex items-center gap-1 border-b border-[var(--border)] mb-5">
        {tabs.map((t) => (
          <RadixTabs.Trigger
            key={t.value}
            value={t.value}
            className="relative px-4 py-2.5 text-sm font-medium text-[var(--text-1)] data-[state=active]:text-[var(--text-0)] hover:text-[var(--text-0)] transition-colors duration-[140ms] focus-visible:outline-none data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:inset-x-3 data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[var(--brand)]"
          >
            {t.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((t) => (
        <RadixTabs.Content key={t.value} value={t.value} className="focus-visible:outline-none">
          {t.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/components/Tabs.tsx
git commit -m "feat(consultor): Tabs wrap Radix com indicador"
```

## Task 2.11: Sidebar

**Files:**
- Create: `src/app/consultor/components/Sidebar.tsx`

- [ ] **Step 1: Implementar**

```tsx
// src/app/consultor/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router'
import { LayoutDashboard, Users, Car, ClipboardList, LogOut, RotateCcw } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { resetConsultorMocks } from '../bootstrap'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/veiculos', label: 'Veículos', icon: Car },
  { to: '/ordens-servico', label: 'Ordens de Serviço', icon: ClipboardList },
]

export function Sidebar() {
  const navigate = useNavigate()
  const consultor = useAuthStore((s) => s.consultor)
  const logout = useAuthStore((s) => s.logout)

  const iniciais = (consultor?.nome ?? 'C')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="w-[220px] shrink-0 bg-[var(--bg-1)] border-r border-[var(--border)] flex flex-col">
      <div className="px-5 h-14 flex items-center gap-2 border-b border-[var(--border)]">
        <div className="size-2 rounded-full bg-[var(--brand)]" aria-hidden />
        <span className="font-semibold tracking-tight text-[var(--text-0)]">DAP</span>
        <span className="text-xs text-[var(--text-2)] ml-1">Consultor</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 h-9 px-3 rounded-[6px] text-sm transition-colors duration-[140ms] ${
                isActive
                  ? 'bg-[var(--bg-3)] text-[var(--text-0)] font-medium'
                  : 'text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--brand)] rounded-r" />}
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)] space-y-2">
        <button
          onClick={resetConsultorMocks}
          className="w-full flex items-center gap-2 h-8 px-3 rounded-[6px] text-xs text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)]"
          title="Resetar mocks para seed inicial"
        >
          <RotateCcw className="size-3.5" />
          Resetar mocks
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-[var(--bg-2)] border border-[var(--border)]">
          <div className="size-8 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center text-xs font-semibold">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[var(--text-0)] truncate">{consultor?.nome ?? '—'}</div>
            <div className="text-[11px] text-[var(--text-2)]">Consultor</div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            aria-label="Sair"
            className="size-7 rounded-[6px] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--danger)] hover:bg-[var(--bg-3)]"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/components/Sidebar.tsx
git commit -m "feat(consultor): Sidebar 220px com nav, reset mocks, avatar, logout"
```

## Task 2.12: Topbar

**Files:**
- Create: `src/app/consultor/components/Topbar.tsx`

- [ ] **Step 1: Implementar**

```tsx
// src/app/consultor/components/Topbar.tsx
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface Crumb { label: string; to?: string }

interface Props {
  title: ReactNode
  breadcrumbs?: Crumb[]
  actions?: ReactNode
}

export function Topbar({ title, breadcrumbs, actions }: Props) {
  return (
    <header className="h-14 px-7 border-b border-[var(--border)] bg-[var(--bg-0)] flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-[var(--text-2)] mr-2">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {c.to ? (
                  <a href={c.to} className="hover:text-[var(--text-0)]">{c.label}</a>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="size-3" />}
              </span>
            ))}
            <ChevronRight className="size-3" />
          </nav>
        )}
        <h1 className="text-xl font-semibold text-[var(--text-0)] truncate">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/consultor/components/Topbar.tsx
git commit -m "feat(consultor): Topbar 56px com breadcrumbs e slot de ações"
```

## Task 2.13: Checkpoint Fase 2

- [ ] **Step 1: Suite completa**

```bash
npm test
```

Expected: 100% verde, incluindo todos os componentes novos.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: sem erros TS.

- [ ] **Step 3: Tag**

```bash
git tag consultor-v1-phase2-green
```

---

## Próximo

Ver `2026-04-14-portal-consultor-v1-phase3.md` (Layout) e seguinte `-phase4.md` (Telas), `-phase5.md` (Polimento).
