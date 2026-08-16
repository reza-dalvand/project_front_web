// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // مسیر پروژه Next.js
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // ═══════ فایل‌های Setup ═══════
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],

  // ═══════ محیط تست ═══════
  testEnvironment: 'jest-environment-jsdom',

  // ═══════ الگوهای فایل تست ═══════
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{js,jsx}',
    '<rootDir>/src/__tests__/**/*.spec.{js,jsx}',
  ],

  // ═══════ نادیده گرفتن ═══════
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/out/'],

  // ═══════ ماژول‌های Mock ═══════
  moduleNameMapper: {
    // Alias @/ → src/
    '^@/(.*)$': '<rootDir>/src/$1',

    // Mock فایل‌های استاتیک (تصاویر، فونت‌ها)
    '\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',

    // Mock فایل‌های CSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Mock فونت‌ها
    '\\.(woff|woff2|ttf|eot|otf)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },

  // ═══════ Transform ═══════
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // ═══════ Coverage ═══════
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/data/**',
    '!src/app/layout.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // ═══════ تنظیمات دیگر ═══════
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transformIgnorePatterns: ['/node_modules/(?!(react-icons|embla-carousel-react)/)'],

  // ═══════ Timeout ═══════
  testTimeout: 15000,

  // ═══════ Clear Mocks بین تست‌ها ═══════
  clearMocks: true,
  restoreMocks: true,
};

module.exports = createJestConfig(customJestConfig);
