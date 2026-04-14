import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// In vitest's jsdom env, global.AbortController/AbortSignal come from jsdom
// but global.Request is Node's — so `new Request(url, { signal })` rejects
// jsdom's AbortSignal. Patch Request to strip jsdom signals (we do not need
// actual aborts in memory router tests).
{
  const OrigRequest = globalThis.Request
  class PatchedRequest extends OrigRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init && 'signal' in init) {
        const { signal: _discard, ...rest } = init
        super(input, rest)
      } else {
        super(input, init)
      }
    }
  }
  ;(globalThis as any).Request = PatchedRequest
}

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
