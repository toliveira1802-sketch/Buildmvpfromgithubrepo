// src/app/consultor/lib/formatters.ts
export function normalizaDigitos(input: string): string {
  return input.replace(/\D/g, '')
}

export function formatCPF(input: string): string {
  const digits = normalizaDigitos(input)
  if (digits.length !== 11) return input
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function formatTelefone(input: string): string {
  const d = normalizaDigitos(input)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6, 10)}`
  return input
}

export function normalizaPlaca(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export function formatPlaca(input: string): string {
  const n = normalizaPlaca(input)
  if (n.length !== 7) return input.toUpperCase()
  return `${n.slice(0, 3)}-${n.slice(3, 7)}`
}

export function formatMoeda(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(centavos / 100)
    .replace(/\u00a0/g, ' ')
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('pt-BR').format(km)} km`
}

export function formatDataExtensa(iso: string, locale = 'pt-BR'): string {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDataRelativa(iso: string, now: Date = new Date()): string {
  const then = new Date(iso)
  const msPerDay = 86_400_000
  const days = Math.floor((startOfDay(now).getTime() - startOfDay(then).getTime()) / msPerDay)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days > 1 && days < 30) return `há ${days} dias`
  if (days >= 30 && days < 365) return `há ${Math.floor(days / 30)} meses`
  if (days >= 365) return `há ${Math.floor(days / 365)} anos`
  if (days === -1) return 'amanhã'
  return `em ${Math.abs(days)} dias`
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
