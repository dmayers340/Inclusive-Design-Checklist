import '@testing-library/jest-dom';
import 'whatwg-fetch';          // fetch polyfill
import 'jest-canvas-mock';      // mock canvas for Chart.js
// jest-axe provides a matcher; we’ll import per-test to keep bundle small.
// If you prefer globally:
import { toHaveNoViolations } from 'jest-axe';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

beforeAll(() => {
  // Provide a dummy canvas context
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => []),
    putImageData: jest.fn(),
    createLinearGradient: jest.fn(() => ({})),
    createRadialGradient: jest.fn(() => ({})),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    setTransform: jest.fn(),
    strokeRect: jest.fn(),
    fill: jest.fn(),
  }));
});

expect.extend(toHaveNoViolations);
