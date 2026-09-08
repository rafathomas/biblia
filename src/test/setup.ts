import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'

window.matchMedia ??= (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false
}) as MediaQueryList
