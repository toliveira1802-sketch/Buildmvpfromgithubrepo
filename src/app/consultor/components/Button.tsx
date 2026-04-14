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
