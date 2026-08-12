// src/__tests__/utils/stringUtils.test.js
import {
  truncateText,
  capitalizeFirst,
  cleanText,
  isEmpty,
  normalizeNumbers,
} from '@/utils/stringUtils';

describe('stringUtils', () => {
  describe('truncateText', () => {
    it('کوتاه کردن متن بلند', () => {
      const longText = 'a'.repeat(400);
      const result = truncateText(longText, 300);
      expect(result.length).toBeLessThanOrEqual(304); // 300 + "..."
      expect(result.endsWith('...')).toBe(true);
    });

    it('متن کوتاه‌تر از حداکثر', () => {
      expect(truncateText('سلام', 300)).toBe('سلام');
    });

    it('ورودی خالی', () => {
      expect(truncateText('', 300)).toBe('');
      expect(truncateText(null, 300)).toBe('');
    });
  });

  describe('cleanText', () => {
    it('حذف فاصله‌های اضافی', () => {
      expect(cleanText('  سلام   دنیا  ')).toBe('سلام دنیا');
    });
  });

  describe('isEmpty', () => {
    it('شناسایی متن خالی', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty('سلام')).toBe(false);
    });
  });
});
