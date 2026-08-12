// src/__tests__/utils/numberUtils.test.js
import {
  toPersianDigit,
  toEnglishDigits,
  parseNumber,
  formatPrice,
  formatPriceShort,
  formatPriceInput,
  formatPercentInput,
  calculateAppFee,
  APP_FEE_TIERS,
  MAX_APP_FEE,
  getCurrentFeeTier,
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

  // ═══════ calculateAppFee ═══════
  describe('calculateAppFee', () => {
    it('زیر ۲۵۰ هزار → ۷ هزار ثابت', () => {
      expect(calculateAppFee(100000)).toBe(7000);
      expect(calculateAppFee(200000)).toBe(7000);
      expect(calculateAppFee(249999)).toBe(7000);
    });

    it('۲۵۰ تا ۵۰۰ هزار → ۴٪', () => {
      expect(calculateAppFee(250000)).toBe(10000); // ۴٪ × ۲۵۰,۰۰۰
      expect(calculateAppFee(500000)).toBe(20000); // ۴٪ × ۵۰۰,۰۰۰
    });

    it('بالای ۵۰۰ هزار → ۵٪', () => {
      expect(calculateAppFee(600000)).toBe(30000); // ۵٪ × ۶۰۰,۰۰۰
      expect(calculateAppFee(1000000)).toBe(50000); // ۵٪ × ۱,۰۰۰,۰۰۰
    });

    it('سقف ۵۰ هزار', () => {
      expect(calculateAppFee(2000000)).toBe(50000); // ۵٪ × ۲M = 100K > 50K → سقف
      expect(calculateAppFee(5000000)).toBe(50000);
    });

    it('ورودی صفر یا منفی', () => {
      expect(calculateAppFee(0)).toBe(0);
      expect(calculateAppFee(-100)).toBe(0);
      expect(calculateAppFee(null)).toBe(0);
    });

    it('مقدار دقیق در مرز ۲۵۰ هزار', () => {
      expect(calculateAppFee(249999)).toBe(7000);
      expect(calculateAppFee(250000)).toBe(10000);
    });
  });

  // ═══════ APP_FEE_TIERS ═══════
  describe('APP_FEE_TIERS', () => {
    it('سه ردیف تعریف شده', () => {
      expect(APP_FEE_TIERS).toHaveLength(3);
    });

    it('ردیف اول: ثابت ۷ هزار', () => {
      expect(APP_FEE_TIERS[0].type).toBe('fixed');
      expect(APP_FEE_TIERS[0].fee).toBe(7000);
      expect(APP_FEE_TIERS[0].max).toBe(250000);
    });

    it('ردیف دوم: ۴٪', () => {
      expect(APP_FEE_TIERS[1].type).toBe('percent');
      expect(APP_FEE_TIERS[1].fee).toBe(4);
    });

    it('ردیف سوم: ۵٪', () => {
      expect(APP_FEE_TIERS[2].type).toBe('percent');
      expect(APP_FEE_TIERS[2].fee).toBe(5);
    });
  });

  // ═══════ getCurrentFeeTier ═══════
  describe('getCurrentFeeTier', () => {
    it('شناسایی ردیف صحیح', () => {
      expect(getCurrentFeeTier(100000).type).toBe('fixed');
      expect(getCurrentFeeTier(300000).type).toBe('percent');
      expect(getCurrentFeeTier(600000).type).toBe('percent');
    });

    it('ورودی صفر', () => {
      expect(getCurrentFeeTier(0)).toEqual(APP_FEE_TIERS[0]);
    });
  });
});
