// src/__tests__/utils/numberUtils.test.js
/**
 * ✅ FIX P1: تست‌های کمیسیون به priceUtils.test.js منتقل شدند
 * این فایل فقط فرمت اعداد را تست می‌کند
 */
import {
  toPersianDigit,
  toEnglishDigits,
  parseNumber,
  formatPrice,
  formatPriceShort,
  formatPriceInput,
  formatPercentInput,
} from '@/utils/numberUtils';

describe('numberUtils', () => {
  // ═══════ toPersianDigit ═══════
  describe('toPersianDigit', () => {
    it('تبدیل اعداد انگلیسی به فارسی', () => {
      expect(toPersianDigit('0123456789')).toBe('۰۱۲۳۴۵۶۷۸۹');
      expect(toPersianDigit('1403')).toBe('۱۴۰۳');
    });

    it('متن بدون عدد', () => {
      expect(toPersianDigit('سلام')).toBe('سلام');
    });

    it('ورودی null/undefined', () => {
      expect(toPersianDigit(null)).toBe('');
      expect(toPersianDigit(undefined)).toBe('');
    });
  });

  // ═══════ toEnglishDigits ═══════
  describe('toEnglishDigits', () => {
    it('تبدیل اعداد فارسی به انگلیسی', () => {
      expect(toEnglishDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789');
      expect(toEnglishDigits('۱۴۰۳')).toBe('1403');
    });

    it('تبدیل اعداد عربی به انگلیسی', () => {
      expect(toEnglishDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    });

    it('ترکیب فارسی و انگلیسی', () => {
      expect(toEnglishDigits('۱۲34')).toBe('1234');
    });
  });

  // ═══════ parseNumber ═══════
  describe('parseNumber', () => {
    it('استخراج عدد از رشته فارسی', () => {
      expect(parseNumber('۱,۲۳۴,۵۶۷')).toBe(1234567);
      expect(parseNumber('۷۵۰,۰۰۰ تومان')).toBe(750000);
    });

    it('ورودی خالی', () => {
      expect(parseNumber('')).toBe(0);
      expect(parseNumber('abc')).toBe(0);
    });
  });

  // ═══════ formatPrice ═══════
  describe('formatPrice', () => {
    it('فرمت قیمت با جداکننده هزارگان', () => {
      expect(formatPrice(750000)).toBe('۷۵۰,۰۰۰ تومان');
      expect(formatPrice(1000000)).toBe('۱,۰۰۰,۰۰۰ تومان');
    });

    it('قیمت صفر', () => {
      expect(formatPrice(0)).toBe('۰ تومان');
    });
  });

  // ═══════ formatPriceShort ═══════
  describe('formatPriceShort', () => {
    it('فرمت کوتاه میلیون', () => {
      expect(formatPriceShort(2500000)).toBe('۲.۵M');
    });

    it('فرمت کوتاه هزار', () => {
      expect(formatPriceShort(750000)).toBe('۷۵۰K');
    });
  });

  // ═══════ formatPriceInput ═══════
  describe('formatPriceInput', () => {
    it('فرمت ورودی قیمت', () => {
      expect(formatPriceInput('750000')).toBe('۷۵۰,۰۰۰');
      expect(formatPriceInput('۷۵۰۰۰۰')).toBe('۷۵۰,۰۰۰');
    });

    it('ورودی خالی', () => {
      expect(formatPriceInput('')).toBe('');
    });
  });

  // ═══════ formatPercentInput ═══════
  describe('formatPercentInput', () => {
    it('محدودیت حداکثر ۱۰۰', () => {
      expect(formatPercentInput('150')).toBe('۱۰۰');
      expect(formatPercentInput('50')).toBe('۵۰');
    });
  });
});
