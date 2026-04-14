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
