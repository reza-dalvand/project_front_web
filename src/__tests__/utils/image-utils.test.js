import {
  getImageUrl,
  getUploadUrl,
  getAvatarUrl,
  getBusinessLogoUrl,
  getBusinessCoverUrl,
  getGalleryImageUrl,
  getPortfolioImageUrl,
  getPostImageUrl,
  validateImageFile,
  createPreviewUrl,
  revokePreviewUrl,
} from '@/utils/image-utils';

describe('image-utils', () => {
  describe('getImageUrl', () => {
    it('برای مسیر خالی، خالی برمی‌گرداند', () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl('')).toBeNull();
    });

    it('برای نشانی کامل، همان را برمی‌گرداند', () => {
      expect(getImageUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg');
    });

    it('برای مسیر نسبی، نشانی کامل با دامنه می‌سازد', () => {
      const result = getImageUrl('/media/img.jpg');
      expect(result).toContain('/media/img.jpg');
      expect(result).toContain('http');
    });
  });

  describe('تابع‌های کمکی نشانی', () => {
    it('همه توابع برای مسیر خالی، خالی برمی‌گردانند', () => {
      expect(getUploadUrl(null)).toBeNull();
      expect(getAvatarUrl(null)).toBeNull();
      expect(getBusinessLogoUrl(null)).toBeNull();
      expect(getBusinessCoverUrl(null)).toBeNull();
      expect(getGalleryImageUrl(null)).toBeNull();
      expect(getPortfolioImageUrl(null)).toBeNull();
      expect(getPostImageUrl(null)).toBeNull();
    });
  });

  describe('validateImageFile', () => {
    it('برای فایل نامعتبر، خطا برمی‌گرداند', () => {
      expect(validateImageFile(null).valid).toBe(false);
    });

    it('برای فایل با نوع غیرمجاز، خطا برمی‌گرداند', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
    });

    it('برای فایل معتبر، مجاز برمی‌گرداند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(file).valid).toBe(true);
    });

    it('برای فایل حجیم، خطا برمی‌گرداند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
    });
  });

  describe('createPreviewUrl / revokePreviewUrl', () => {
    it('برای فایل خالی، خالی برمی‌گرداند', () => {
      expect(createPreviewUrl(null)).toBeNull();
    });

    it('برای فایل معتبر، نشانی حبابی برمی‌گرداند', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const url = createPreviewUrl(file);
      expect(typeof url).toBe('string');
      expect(url).toContain('blob:');
      expect(() => revokePreviewUrl(url)).not.toThrow();
    });
  });
});
