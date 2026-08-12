// src/__tests__/utils/phoneUtils.test.js
import { validatePhone, maskPhone, cleanPhone } from '@/utils/phoneUtils';

describe('phoneUtils', () => {
  describe('validatePhone', () => {
    it('شماره‌های معتبر', () => {
      expect(validatePhone('09123456789')).toBe(true);
      expect(validatePhone('09901234567')).toBe(true);
      expect(validatePhone('09351111111')).toBe(true);
    });

    it('شماره‌های فارسی معتبر', () => {
      expect(validatePhone('۰۹۱۲۳۴۵۶۷۸۹')).toBe(true);
    });

    it('شماره‌های نامعتبر', () => {
      expect(validatePhone('08123456789')).toBe(false); // شروع با 08
      expect(validatePhone('0912345678')).toBe(false); // ۱۰ رقم
      expect(validatePhone('091234567890')).toBe(false); // ۱۲ رقم
      expect(validatePhone('12345678901')).toBe(false); // بدون 0 اول
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('maskPhone', () => {
    it('ماسک معکوس: ۴ رقم آخر + *** + ۴ رقم اول', () => {
      expect(maskPhone('09901232001')).toBe('2001***0990');
      expect(maskPhone('09123456789')).toBe('6789***0912');
    });

    it('شماره کوتاه‌تر از ۱۱ رقم', () => {
      expect(maskPhone('0912')).toBe('0912');
      expect(maskPhone('')).toBe('');
      expect(maskPhone(null)).toBe(null);
    });
  });

  describe('cleanPhone', () => {
    it('حذف کاراکترهای اضافی', () => {
      expect(cleanPhone('0912-345-6789')).toBe('09123456789');
      expect(cleanPhone('0912 345 6789')).toBe('09123456789');
      expect(cleanPhone('+989123456789')).toBe('+989123456789');
    });

    it('حفظ اعداد و +', () => {
      expect(cleanPhone('abc0912def')).toBe('0912');
    });
  });
});
