// src/__tests__/utils/api-helpers.test.js
import {
  buildQueryString,
  buildApiUrl,
  extractApiError,
  isValidationError,
  isAuthError,
  isNetworkError,
  getUserFriendlyErrorMessage,
} from '@/utils/api-helpers';

describe('api-helpers', () => {
  describe('buildQueryString', () => {
    it('پارامترها را به query string تبدیل کند', () => {
      const qs = buildQueryString({ page: 1, limit: 10 });
      expect(qs).toBe('?page=1&limit=10');
    });

    it('مقادیر null و undefined را نادیده بگیرد', () => {
      // ✅ FIX: تغییر نام age به userAge برای جلوگیری از تداخل زیررشته‌ای با کلمه page
      const qs = buildQueryString({ page: 1, name: null, userAge: undefined, city: '' });
      expect(qs).toContain('page=1');
      expect(qs).not.toContain('name');
      expect(qs).not.toContain('userAge');
      expect(qs).not.toContain('city');
    });

    it('برای آبجکت خالی رشته خالی برگرداند', () => {
      expect(buildQueryString({})).toBe('');
      expect(buildQueryString(null)).toBe('');
    });
  });

  describe('buildApiUrl', () => {
    it('URL کامل با query string بسازد', () => {
      const url = buildApiUrl('/businesses/', { page: 1 });
      expect(url).toBe('/businesses/?page=1');
    });
  });

  describe('extractApiError', () => {
    it('خطای ApiError را استخراج کند', () => {
      const err = { isApiError: true, message: 'خطا', code: 'ERR', details: {} };
      const extracted = extractApiError(err);
      expect(extracted.message).toBe('خطا');
      expect(extracted.code).toBe('ERR');
    });
  });

  describe('isValidationError', () => {
    it('خطای اعتبارسنجی را تشخیص دهد', () => {
      expect(isValidationError({ code: 'VALIDATION_ERROR' })).toBe(true);
      expect(isValidationError({ code: 'NETWORK_ERROR' })).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('خطای شبکه را تشخیص دهد', () => {
      expect(isNetworkError({ code: 'NETWORK_ERROR' })).toBe(true);
      expect(isNetworkError({ code: 'VALIDATION_ERROR' })).toBe(false);
    });
  });
});
