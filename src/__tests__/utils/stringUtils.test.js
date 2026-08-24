import {
  truncateText,
  capitalizeFirst,
  cleanText,
  isEmpty,
  normalizeNumbers,
} from '@/utils/stringUtils';

describe('stringUtils', () => {
  describe('truncateText', () => {
    it('متن بلند را کوتاه می‌کند و سه‌نقطه اضافه می‌کند', () => {
      const longText = 'a'.repeat(400);
      const result = truncateText(longText, 300);
      expect(result).toHaveLength(303);
      expect(result.endsWith('...')).toBe(true);
    });

    it('برای متن کوتاه‌تر از حد، همان متن را برمی‌گرداند', () => {
      expect(truncateText('سلام', 300)).toBe('سلام');
    });

    it('برای متن خالی و نامعتبر، رشته خالی برمی‌گرداند', () => {
      expect(truncateText('', 300)).toBe('');
      expect(truncateText(null, 300)).toBe('');
      expect(truncateText(undefined)).toBe('');
    });
  });

  describe('capitalizeFirst', () => {
    it('حرف اول را بزرگ می‌کند', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('برای متن خالی، رشته خالی برمی‌گرداند', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst(null)).toBe('');
    });
  });

  describe('cleanText', () => {
    it('فاصله‌های اضافی را حذف می‌کند', () => {
      expect(cleanText('  hello   world  ')).toBe('hello world');
    });

    it('برای متن خالی، رشته خالی برمی‌گرداند', () => {
      expect(cleanText('')).toBe('');
      expect(cleanText(null)).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('متن خالی را تشخیص می‌دهد', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('  ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty('سلام')).toBe(false);
    });
  });

  describe('normalizeNumbers', () => {
    it('اعداد فارسی را به انگلیسی تبدیل می‌کند', () => {
      expect(normalizeNumbers('۱۲۳')).toBe('123');
    });

    it('برای متن خالی، رشته خالی برمی‌گرداند', () => {
      expect(normalizeNumbers('')).toBe('');
      expect(normalizeNumbers(null)).toBe('');
    });
  });
});
