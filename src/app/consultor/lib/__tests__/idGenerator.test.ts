import { describe, it, expect } from 'vitest'
import { nextOSId, uuid } from '../idGenerator'

describe('nextOSId', () => {
  it('retorna OS-YYYY-0001 quando lista vazia', () => {
    expect(nextOSId([], 2026)).toBe('OS-2026-0001')
  })
  it('incrementa do maior existente do mesmo ano', () => {
    expect(nextOSId(['OS-2026-0001', 'OS-2026-0005'], 2026)).toBe('OS-2026-0006')
  })
  it('reinicia a sequência em novo ano', () => {
    expect(nextOSId(['OS-2025-0099'], 2026)).toBe('OS-2026-0001')
  })
  it('pad 4 dígitos', () => {
    expect(nextOSId(['OS-2026-0042'], 2026)).toBe('OS-2026-0043')
  })
  it('ignora IDs com formato estranho', () => {
    expect(nextOSId(['foo', 'OS-2026-0003'], 2026)).toBe('OS-2026-0004')
  })
})

describe('uuid', () => {
  it('gera string de 36 chars (v4)', () => {
    const id = uuid()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
  it('gera valores únicos', () => {
    const a = uuid()
    const b = uuid()
    expect(a).not.toBe(b)
  })
})
