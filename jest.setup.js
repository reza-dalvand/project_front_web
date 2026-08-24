// jest.setup.js
import '@testing-library/jest-dom';

// Mock کردن URL.createObjectURL و URL.revokeObjectURL برای محیط JSDOM
if (typeof URL.createObjectURL === 'undefined') {
  Object.defineProperty(URL, 'createObjectURL', {
    value: jest.fn(() => 'blob:http://localhost/test-blob-url'),
    writable: true,
  });
}

if (typeof URL.revokeObjectURL === 'undefined') {
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: jest.fn(),
    writable: true,
  });
}
