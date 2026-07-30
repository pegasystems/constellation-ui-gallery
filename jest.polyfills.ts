/**
 * CSS Custom Highlight API — used by @pega/cosmos-react-core (useHighlight).
 * jsdom does not implement Highlight / CSS.highlights.
 */
(globalThis as typeof globalThis & { Highlight: unknown }).Highlight = class Highlight {
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
};

const cssGlobal = globalThis as typeof globalThis & {
  CSS?: { highlights?: Map<string, unknown> };
};

if (!cssGlobal.CSS) {
  cssGlobal.CSS = { highlights: new Map() };
} else if (!cssGlobal.CSS.highlights) {
  Object.defineProperty(cssGlobal.CSS, 'highlights', {
    value: new Map(),
    configurable: true,
  });
}
