// src/__tests__/utils/validators.test.js
import { validateNationalId, validateSheba, validateCardNumber } from '@/utils/validators';

describe('validators', () => {
  describe('validateNationalId', () => {
    it('کد ملی معتبر', () => {
      expect(validateNationalId('0012345679')).toBe(true);
    });

    it('کد ملی با ارقام فارسی', () => {
      expect(validateNationalId('۰۰۱۲۳۴۵۶۷۹')).toBe(true);
    });

    it('کد ملی نامعتبر - طول اشتباه', () => {
      expect(validateNationalId('123456789')).toBe(false); // ۹ رقم
      expect(validateNationalId('12345678901')).toBe(false); // ۱۱ رقم
    });

    it('کد ملی نامعتبر - ارقام تکراری', () => {
      expect(validateNationalId('1111111111')).toBe(false);
      expect(validateNationalId('0000000000')).toBe(false);
    });

    it('کد ملی نامعتبر - checksum اشتباه', () => {
      expect(validateNationalId('0012345678')).toBe(false);
    });
  });

  describe('validateSheba', () => {
    it('شبا معتبر', () => {
      expect(validateSheba('IR062960000000100324200001')).toBe(true);
    });

    it('شبا با حروف کوچک', () => {
      expect(validateSheba('ir062960000000100324200001')).toBe(true);
    });

    it('شبا بدون IR', () => {
      expect(validateSheba('062960000000100324200001')).toBe(false);
    });

    it('شبا با طول اشتباه', () => {
      expect(validateSheba('IR06296000000010032420001')).toBe(false); // ۲۳ رقم
    });
  });

  describe('validateCardNumber', () => {
    it('کارت معتبر ۱۶ رقمی', () => {
      expect(validateCardNumber('6037991812345678')).toBe(true);
      expect(validateCardNumber('۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸')).toBe(true);
    });

    it('کارت با طول اشتباه', () => {
      expect(validateCardNumber('603799181234567')).toBe(false); // ۱۵ رقم
      expect(validateCardNumber('60379918123456789')).toBe(false); // ۱۷ رقم
    });
  });
});
