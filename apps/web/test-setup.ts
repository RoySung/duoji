import 'fake-indexeddb/auto'

// Polyfill for structuredClone in Node.js test environment
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}
