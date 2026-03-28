import 'fake-indexeddb/auto'

// Polyfill for structuredClone in Node.js test environment
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
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
