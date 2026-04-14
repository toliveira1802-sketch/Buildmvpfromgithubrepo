import { describe, it, expect } from 'vitest'
import { slaStatusFor, formatSLA, minutosNaEtapa } from '../slaHelpers'
import type { OS } from '../../types'

describe('slaStatusFor', () => {
  it('ok quando <75% do SLA', () => {
    expect(slaStatusFor('diagnostico', 120)).toBe('ok')
  })
  it('atencao quando entre 75% e 100%', () => {
    expect(slaStatusFor('diagnostico', 200)).toBe('atencao')
  })
  it('critico quando >100%', () => {
    expect(slaStatusFor('diagnostico', 300)).toBe('critico')
  })
  it('terminal pra etapas sem SLA', () => {
    expect(slaStatusFor('entregue', 999)).toBe('terminal')
    expect(slaStatusFor('cancelada', 999)).toBe('terminal')
  })
})

describe('formatSLA', () => {
  it('formata minutos', () => {
    expect(formatSLA(35)).toBe('35min')
    expect(formatSLA(60)).toBe('1h')
    expect(formatSLA(135)).toBe('2h 15min')
    expect(formatSLA(1440)).toBe('1d')
    expect(formatSLA(1500)).toBe('1d 1h')
  })
})

describe('minutosNaEtapa', () => {
  it('calcula minutos desde a última entrada', () => {
    const now = new Date('2026-04-14T12:00:00Z')
    const os = {
      etapaHistorico: [{ etapa: 'diagnostico', entradaEm: '2026-04-14T10:00:00Z' }],
    } as unknown as OS
    expect(minutosNaEtapa(os, now)).toBe(120)
  })
})
