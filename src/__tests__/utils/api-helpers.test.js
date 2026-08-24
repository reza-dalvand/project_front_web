import {
  buildQueryString,
  buildApiUrl,
  extractApiError,
  isValidationError,
  isAuthError,
  isNetworkError,
  getUserFriendlyErrorMessage,
  buildUploadPayload,
  buildMultiUploadPayload,
} from '@/utils/api-helpers';

describe('api-helpers', () => {
  describe('buildQueryString', () => {
    it('پارامترها را به رشته پرس‌وجو تبدیل می‌کند', () => {
      expect(buildQueryString({ page: 1, limit: 10 })).toBe('?page=1&limit=10');
    });

    it('برای آبجکت خالی و نامعتبر، رشته خالی برمی‌گرداند', () => {
      expect(buildQueryString({})).toBe('');
      expect(buildQueryString(null)).toBe('');
    });

    it('مقادیر خالی و نامعتبر را حذف می‌کند', () => {
      expect(buildQueryString({ a: null, b: undefined, c: '' })).toBe('');
      expect(buildQueryString({ page: 1, name: null })).toBe('?page=1');
    });
  });

  describe('buildApiUrl', () => {
    it('نشانی کامل را با پرس‌وجو می‌سازد', () => {
      expect(buildApiUrl('/businesses/', { page: 1 })).toBe('/businesses/?page=1');
    });

    it('بدون پارامتر، فقط مسیر را برمی‌گرداند', () => {
      expect(buildApiUrl('/businesses/')).toBe('/businesses/');
    });
  });

  describe('extractApiError', () => {
    it('خطای API را استخراج می‌کند', () => {
      const error = { isApiError: true, message: 'خطا', code: 'ERR', details: {} };
      const result = extractApiError(error);
      expect(result.message).toBe('خطا');
      expect(result.code).toBe('ERR');
    });

    it('برای خطای نامعتبر، مقدار پیش‌فرض برمی‌گرداند', () => {
      const result = extractApiError(null);
      expect(result.message).toBe('خطای ناشناخته');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('isValidationError', () => {
    it('خطای اعتبارسنجی را تشخیص می‌دهد', () => {
      expect(isValidationError({ code: 'VALIDATION_ERROR' })).toBe(true);
      expect(isValidationError({ code: 'NETWORK_ERROR' })).toBe(false);
      expect(isValidationError(null)).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('خطای احراز هویت را تشخیص می‌دهد', () => {
      expect(isAuthError({ code: 'UNAUTHORIZED' })).toBe(true);
      expect(isAuthError({ code: 'VALIDATION_ERROR' })).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('خطای شبکه را تشخیص می‌دهد', () => {
      expect(isNetworkError({ code: 'NETWORK_ERROR' })).toBe(true);
      expect(isNetworkError({ code: 'VALIDATION_ERROR' })).toBe(false);
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('پیام مناسب برای خطای شبکه برمی‌گرداند', () => {
      expect(getUserFriendlyErrorMessage({ code: 'NETWORK_ERROR' })).toContain('اتصال');
    });

    it('پیام مناسب برای خطای احراز هویت برمی‌گرداند', () => {
      expect(getUserFriendlyErrorMessage({ code: 'UNAUTHORIZED' })).toContain('حساب کاربری');
    });

    it('برای خطای نامعتبر، پیام پیش‌فرض برمی‌گرداند', () => {
      expect(getUserFriendlyErrorMessage(null)).toBe('خطای ناشناخته‌ای رخ داد');
    });
  });

  describe('buildUploadPayload', () => {
    it('یک FormData شامل فایل برمی‌گرداند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const formData = buildUploadPayload(file, 'file');
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(file);
    });
  });

  describe('buildMultiUploadPayload', () => {
    it('یک FormData شامل چند فایل برمی‌گرداند', () => {
      const files = [
        new File([''], 'a.jpg', { type: 'image/jpeg' }),
        new File([''], 'b.jpg', { type: 'image/jpeg' }),
      ];
      const formData = buildMultiUploadPayload(files, 'files');
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.getAll('files')).toHaveLength(2);
    });
  });
});
