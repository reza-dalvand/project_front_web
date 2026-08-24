import { validatePhone, maskPhone, cleanPhone } from '@/utils/phoneUtils';

describe('phoneUtils', () => {
  describe('validatePhone', () => {
    it('شماره‌های معتبر را می‌پذیرد', () => {
      expect(validatePhone('09123456789')).toBe(true);
      expect(validatePhone('09901232001')).toBe(true);
    });

    it('شماره‌های فارسی معتبر را می‌پذیرد', () => {
      expect(validatePhone('۰۹۱۲۳۴۵۶۷۸۹')).toBe(true);
    });

    it('شماره‌های نامعتبر را رد می‌کند', () => {
      expect(validatePhone('08123456789')).toBe(false); // با 08 شروع شده
      expect(validatePhone('0912345678')).toBe(false); // 10 رقم
      expect(validatePhone('091234567890')).toBe(false); // 12 رقم
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('maskPhone', () => {
    it('شماره را به صورت معکوس ماسک می‌کند (4 رقم آخر *** 4 رقم اول)', () => {
      expect(maskPhone('09901232001')).toBe('2001***0990');
      expect(maskPhone('09123456789')).toBe('6789***0912');
    });

    it('برای شماره کوتاه‌تر از ۱۱ رقم، همان را برمی‌گرداند', () => {
      expect(maskPhone('0912')).toBe('0912');
    });

    it('برای رشته خالی و نامعتبر، همان را برمی‌گرداند', () => {
      expect(maskPhone('')).toBe('');
      expect(maskPhone(null)).toBe(null);
      expect(maskPhone(undefined)).toBe(undefined);
    });
  });

  describe('cleanPhone', () => {
    it('کاراکترهای اضافی را حذف می‌کند', () => {
      expect(cleanPhone('0912-345-6789')).toBe('09123456789');
      expect(cleanPhone('0912 345 6789')).toBe('09123456789');
    });

    it('علامت + را نگه می‌دارد', () => {
      expect(cleanPhone('+989123456789')).toBe('+989123456789');
    });
  });
});
