// jest.setup.js
/**
 * فایل Setup全局 برای Jest
 * این فایل قبل از هر فایل تست اجرا می‌شود
 */

// ═══════ Jest DOM Matchers ═══════
import '@testing-library/jest-dom';

// ═══════ Mock کردن window.matchMedia ═══════
// برای تست‌هایی که از useThemeStore استفاده می‌کنند
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

// ═══════ Mock کردن IntersectionObserver ═══════
// برای تست‌هایی که از PostGrid، AdSlider و... استفاده می‌کنند
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = [];
  }

  observe(element) {
    this.elements.push(element);
  }

  unobserve(element) {
    this.elements = this.elements.filter((el) => el !== element);
  }

  disconnect() {
    this.elements = [];
  }

  // شبیه‌سازی trigger
  trigger(entries) {
    this.callback(entries, this);
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// ═══════ Mock کردن ResizeObserver ═══════
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;

// ═══════ Mock کردن navigator.geolocation ═══════
// برای تست‌های مرتبط با موقعیت مکانی
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn().mockImplementation((success) => {
      success({
        coords: {
          latitude: 35.6892,
          longitude: 51.389,
          accuracy: 10,
        },
      });
    }),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  writable: true,
});

// ═══════ Mock کردن scrollTo ═══════
window.scrollTo = jest.fn();

// ═══════ Mock کردن localStorage ═══════
// (Zustand persist از localStorage استفاده می‌کند)
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ═══════ Mock کردن clipboard ═══════
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  writable: true,
});

// ═══════ Mock کردن navigator.share ═══════
Object.defineProperty(navigator, 'share', {
  value: jest.fn().mockResolvedValue(undefined),
  writable: true,
  configurable: true,
});

// ═══════ Suppress console.error در تست‌ها ═══════
// فقط خطاهای مربوط به React act() warning
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
