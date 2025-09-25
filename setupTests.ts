import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Wait time needed
const TIMEOUT = 300000;

// mocks open
global.open = jest.fn();

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(() => 'xxx'),
    arrayBuffer: () => Promise.resolve(() => 'yyy'),
  }),
) as jest.Mock;

window.URL.createObjectURL = jest.fn();

// mocks ResizeObserver
window.ResizeObserver = jest.fn(() => ({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
}));

// mocks IntersectionObserver
window.IntersectionObserver = jest.fn(() => ({
  root: null,
  rootMargin: '0',
  thresholds: [],
  takeRecords: () => [],
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
}));

// mocks createSVGPoint
Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGPoint', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    matrixTransform: jest.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
    })),
  })),
});

// mocks getBBox on SVGTextElement
(global.SVGElement.prototype as any).getBBox = () => {
  return {
    x: 0,
    y: 0,
    width: 30,
    height: 15,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    toJSON: () => '',
  };
};

// Mocks the window.matchMedia function used in useBreakpoint hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Web Animations API
Object.defineProperty(Element.prototype, 'animate', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    finish: jest.fn(),
    cancel: jest.fn(),
    reverse: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.setTimeout(TIMEOUT);
