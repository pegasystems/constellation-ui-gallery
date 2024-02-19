import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Wait time needed
const TIMEOUT = 300000;

// mocks ResizeObserver
window.ResizeObserver = jest.fn(() => ({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {}
}));

// mocks IntersectionObserver
window.IntersectionObserver = jest.fn(() => ({
  root: null,
  rootMargin: '0',
  thresholds: [],
  takeRecords: () => [],
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {}
}));

// Mocks the window.matchMedia function used in useBreakpoint hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

jest.setTimeout(TIMEOUT);

// speeds up *ByRole queries a bit
// https://github.com/testing-library/dom-testing-library/issues/552
configure({ defaultHidden: true });
