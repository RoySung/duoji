import 'fake-indexeddb/auto'
import { webcrypto } from 'crypto'
import { db } from '@/lib/dexie'

// Polyfill for structuredClone in Node.js test environment
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}

// Polyfill crypto.randomUUID for the jsdom test environment
if (
  typeof globalThis.crypto === 'undefined' ||
  typeof (globalThis.crypto as Crypto).randomUUID !== 'function'
) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  })
}

if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })
}

afterEach(async () => {
  try {
    db.close()
  } catch (e) {
    // Ignore
  }
})

