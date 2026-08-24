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
  describe('toPersianDigit', () => {
    it('اعداد انگلیسی را به فارسی تبدیل می‌کند', () => {
      expect(toPersianDigit('0123456789')).toBe('۰۱۲۳۴۵۶۷۸۹');
      expect(toPersianDigit('1403')).toBe('۱۴۰۳');
    });

    it('برای متن بدون عدد، همان متن را برمی‌گرداند', () => {
      expect(toPersianDigit('سلام')).toBe('سلام');
    });

    it('برای null و undefined رشته خالی برمی‌گرداند', () => {
      expect(toPersianDigit(null)).toBe('');
      expect(toPersianDigit(undefined)).toBe('');
    });
  });

  describe('toEnglishDigits', () => {
    it('اعداد فارسی را به انگلیسی تبدیل می‌کند', () => {
      expect(toEnglishDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789');
      expect(toEnglishDigits('۱۴۰۳')).toBe('1403');
    });

    it('اعداد عربی را به انگلیسی تبدیل می‌کند', () => {
      expect(toEnglishDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    });

    it('ترکیب فارسی و انگلیسی را یکجا تبدیل می‌کند', () => {
      expect(toEnglishDigits('۱۲34')).toBe('1234');
    });
  });

  describe('parseNumber', () => {
    it('عدد را از رشته فارسی استخراج می‌کند', () => {
      expect(parseNumber('۱,۲۳۴,۵۶۷')).toBe(1234567);
      expect(parseNumber('۷۵۰,۰۰۰ تومان')).toBe(750000);
    });

    it('برای ورودی خالی یا نامعتبر صفر برمی‌گرداند', () => {
      expect(parseNumber('')).toBe(0);
      expect(parseNumber('abc')).toBe(0);
      expect(parseNumber(null)).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('قیمت را با جداکننده هزارگان و تومان برمی‌گرداند', () => {
      expect(formatPrice(750000)).toBe('۷۵۰,۰۰۰ تومان');
      expect(formatPrice(1000000)).toBe('۱,۰۰۰,۰۰۰ تومان');
    });

    it('برای صفر و مقدار نامعتبر، صفر تومان برمی‌گرداند', () => {
      expect(formatPrice(0)).toBe('۰ تومان');
      expect(formatPrice(null)).toBe('۰ تومان');
    });
  });

  describe('formatPriceShort', () => {
    it('مقادیر میلیونی را با پسوند M برمی‌گرداند', () => {
      expect(formatPriceShort(2500000)).toBe('۲.۵M');
    });

    it('مقادیر هزار را با پسوند K برمی‌گرداند', () => {
      expect(formatPriceShort(750000)).toBe('۷۵۰K');
    });

    it('مقادیر کوچک را بدون پسوند برمی‌گرداند', () => {
      expect(formatPriceShort(500)).toBe('۵۰۰');
    });
  });

  describe('formatPriceInput', () => {
    it('ورودی را با جداکننده هزارگان فارسی برمی‌گرداند', () => {
      expect(formatPriceInput('750000')).toBe('۷۵۰,۰۰۰');
      expect(formatPriceInput('۷۵۰۰۰۰')).toBe('۷۵۰,۰۰۰');
    });

    it('برای ورودی خالی، رشته خالی برمی‌گرداند', () => {
      expect(formatPriceInput('')).toBe('');
    });
  });

  describe('formatPercentInput', () => {
    it('درصد را حداکثر تا ۱۰۰ محدود می‌کند', () => {
      expect(formatPercentInput('150')).toBe('۱۰۰');
      expect(formatPercentInput('50')).toBe('۵۰');
    });

    it('برای ورودی خالی، رشته خالی برمی‌گرداند', () => {
      expect(formatPercentInput('')).toBe('');
    });
  });
});
