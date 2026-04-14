import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  const store = new Map<string, string>()
  const mock: Storage = {
    get length() { return store.size },
    clear: () => store.clear(),
    getItem: (k) => store.get(k) ?? null,
    key: (i) => Array.from(store.keys())[i] ?? null,
    removeItem: (k) => { store.delete(k) },
    setItem: (k, v) => { store.set(k, String(v)) },
  }
  vi.stubGlobal('localStorage', mock)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
