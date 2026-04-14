// src/app/consultor/lib/__tests__/formatters.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatCPF,
  formatTelefone,
  formatPlaca,
  formatMoeda,
  formatKm,
  formatDataRelativa,
  formatDataExtensa,
  normalizaPlaca,
  normalizaDigitos,
} from '../formatters'

describe('formatCPF', () => {
  it('formats 11 digits into XXX.XXX.XXX-XX', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })
  it('accepts partially formatted input', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
  })
  it('returns original when invalid length', () => {
    expect(formatCPF('123')).toBe('123')
  })
})

describe('formatTelefone', () => {
  it('formats 11 digits into (XX) XXXXX-XXXX', () => {
    expect(formatTelefone('11987654321')).toBe('(11) 98765-4321')
  })
  it('formats 10 digits into (XX) XXXX-XXXX', () => {
    expect(formatTelefone('1133334444')).toBe('(11) 3333-4444')
  })
})

describe('formatPlaca', () => {
  it('uppercases and inserts hyphen at position 3', () => {
    expect(formatPlaca('abc1d23')).toBe('ABC-1D23')
  })
  it('accepts already formatted placa', () => {
    expect(formatPlaca('ABC-1D23')).toBe('ABC-1D23')
  })
})

describe('normalizaPlaca', () => {
  it('remove hyphens e caixa alta', () => {
    expect(normalizaPlaca('abc-1d23')).toBe('ABC1D23')
  })
})

describe('formatMoeda', () => {
  it('formats centavos as BRL', () => {
    expect(formatMoeda(12345)).toBe('R$ 123,45')
  })
  it('formats zero', () => {
    expect(formatMoeda(0)).toBe('R$ 0,00')
  })
  it('formats milhar', () => {
    expect(formatMoeda(1234567)).toBe('R$ 12.345,67')
  })
})

describe('formatKm', () => {
  it('separates milhar with dot', () => {
    expect(formatKm(123456)).toBe('123.456 km')
  })
  it('handles zero', () => {
    expect(formatKm(0)).toBe('0 km')
  })
})

describe('formatDataRelativa', () => {
  it('returns "hoje" for same day', () => {
    const now = new Date()
    expect(formatDataRelativa(now.toISOString(), now)).toBe('hoje')
  })
  it('returns "há 3 dias"', () => {
    const now = new Date('2026-04-14T12:00:00Z')
    const past = new Date('2026-04-11T12:00:00Z')
    expect(formatDataRelativa(past.toISOString(), now)).toBe('há 3 dias')
  })
  it('returns "ontem" for -1 day', () => {
    const now = new Date('2026-04-14T12:00:00Z')
    const past = new Date('2026-04-13T12:00:00Z')
    expect(formatDataRelativa(past.toISOString(), now)).toBe('ontem')
  })
})

describe('normalizaDigitos', () => {
  it('keeps only digits', () => {
    expect(normalizaDigitos('(11) 98765-4321')).toBe('11987654321')
  })
})
