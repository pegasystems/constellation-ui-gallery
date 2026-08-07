/**
 * window.matchMedia — used by @pega/cosmos-react-core at module load
 * (isTouchDevice). Must run before setupFiles imports Storybook preview / cosmos.
 * jsdom does not implement matchMedia.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * structuredClone — used by @dagrejs/dagre. Available in Node, but not on the
 * jsdom global used by Jest.
 */
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
}

/**
 * CSS Custom Highlight API — used by @pega/cosmos-react-core (useHighlight).
 * jsdom does not implement Highlight / CSS.highlights.
 */
class HighlightPolyfill {
  #ranges = new Set<unknown>();

  constructor(...ranges: unknown[]) {
    for (const range of ranges) {
      this.#ranges.add(range);
    }
  }

  add(range: unknown) {
    this.#ranges.add(range);
  }

  clear() {
    this.#ranges.clear();
  }

  delete(range: unknown) {
    return this.#ranges.delete(range);
  }

  has(range: unknown) {
    return this.#ranges.has(range);
  }

  get size() {
    return this.#ranges.size;
  }
}

Object.assign(globalThis, { Highlight: HighlightPolyfill });

const cssGlobal = globalThis as typeof globalThis & {
  CSS?: typeof CSS & { highlights?: Map<string, unknown> };
};

if (!cssGlobal.CSS) {
  Object.assign(globalThis, { CSS: { highlights: new Map() } });
} else if (!cssGlobal.CSS.highlights) {
  Object.defineProperty(cssGlobal.CSS, 'highlights', {
    value: new Map(),
    configurable: true,
  });
}
