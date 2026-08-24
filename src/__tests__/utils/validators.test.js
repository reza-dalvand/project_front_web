import { validateNationalId, validateSheba, validateCardNumber } from '@/utils/validators';

describe('validators', () => {
  describe('validateNationalId', () => {
    it('کد ملی معتبر را می‌پذیرد', () => {
      // checksum: sum=112, 112%11=2, 11-2=9 → رقم آخر 9 ✅
      expect(validateNationalId('0012345679')).toBe(true);
    });

    it('کد ملی فارسی معتبر را می‌پذیرد', () => {
      expect(validateNationalId('۰۰۱۲۳۴۵۶۷۹')).toBe(true);
    });

    it('کد ملی نامعتبر را رد می‌کند', () => {
      // checksum غلط: رقم آخر باید 9 باشد نه 5
      expect(validateNationalId('0012345675')).toBe(false);
      // 9 رقم
      expect(validateNationalId('123456789')).toBe(false);
      // 11 رقم
      expect(validateNationalId('12345678901')).toBe(false);
      // همه رقم یکسان
      expect(validateNationalId('1111111111')).toBe(false);
      expect(validateNationalId('')).toBe(false);
    });
  });

  describe('validateSheba', () => {
    it('شماره شبای معتبر را می‌پذیرد', () => {
      expect(validateSheba('IR062960000000100324200001')).toBe(true);
    });

    it('شبای بدون پیشوند IR را رد می‌کند', () => {
      expect(validateSheba('062960000000100324200001')).toBe(false);
    });

    it('شبای با طول نامعتبر را رد می‌کند', () => {
      expect(validateSheba('IR123')).toBe(false);
    });
  });

  describe('validateCardNumber', () => {
    it('شماره کارت ۱۶ رقمی را می‌پذیرد', () => {
      expect(validateCardNumber('6037991812345678')).toBe(true);
      expect(validateCardNumber('۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸')).toBe(true);
    });

    it('شماره کارت با طول نامعتبر را رد می‌کند', () => {
      expect(validateCardNumber('603799181234567')).toBe(false);
      expect(validateCardNumber('')).toBe(false);
    });
  });
});
