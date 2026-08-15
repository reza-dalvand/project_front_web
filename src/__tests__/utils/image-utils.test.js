// src/__tests__/utils/image-utils.test.js
import { getImageUrl, validateImageFile } from '@/utils/image-utils';

// Mock کردن متغیرهای محیطی
jest.mock('@/config/env', () => ({
  __esModule: true,
  default: {
    ARVAN_CDN_URL: 'https://cdn.example.com',
    API_BASE_URL: 'http://localhost:8000/api/v1',
  },
}));

describe('image-utils', () => {
  describe('getImageUrl', () => {
    it('برای مسیر نسبی از CDN استفاده کند', () => {
      const url = getImageUrl('/media/photos/1.jpg');
      expect(url).toBe('https://cdn.example.com//media/photos/1.jpg');
    });

    it('برای URL کامل همان را برگرداند', () => {
      const url = getImageUrl('https://other.com/img.jpg');
      expect(url).toBe('https://other.com/img.jpg');
    });

    it('برای null یا undefined null برگرداند', () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl('')).toBeNull();
    });
  });

  describe('validateImageFile', () => {
    it('فایل معتبر را تایید کند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('فایل با فرمت نامعتبر را رد کند', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('فرمت فایل مجاز نیست');
    });

    it('فایل حجیم (بیشتر از ۱۰ مگابایت) را رد کند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('حجم فایل');
    });
  });
});