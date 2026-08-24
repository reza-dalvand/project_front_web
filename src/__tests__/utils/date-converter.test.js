import {
  toJalaaliKey,
  fromJalaaliKey,
  dateObjToKey,
  keyToDateObj,
  gregorianToJalaaliKey,
  buildAppointmentPayload,
  formatJalaaliKeyForDisplay,
  compareJalaaliKeys,
  isFutureKey,
  isPastKey,
} from '@/utils/date-converter';

describe('date-converter', () => {
  describe('toJalaaliKey', () => {
    it('تاریخ جلالی را به فرمت کلید تبدیل می‌کند', () => {
      expect(toJalaaliKey(1403, 4, 15)).toBe('1403/04/15');
      expect(toJalaaliKey(1403, 12, 29)).toBe('1403/12/29');
      expect(toJalaaliKey(1403, 1, 1)).toBe('1403/01/01');
    });

    it('برای مقادیر نامعتبر، رشته خالی برمی‌گرداند', () => {
      expect(toJalaaliKey(0, 0, 0)).toBe('');
      expect(toJalaaliKey(null, 4, 15)).toBe('');
    });
  });

  describe('fromJalaaliKey', () => {
    it('کلید را به آبجکت تاریخ جلالی تبدیل می‌کند', () => {
      expect(fromJalaaliKey('1403/04/15')).toEqual({ jy: 1403, jm: 4, jd: 15 });
    });

    it('برای کلید خالی و نامعتبر، مقدار صفر برمی‌گرداند', () => {
      expect(fromJalaaliKey('')).toEqual({ jy: 0, jm: 0, jd: 0 });
      expect(fromJalaaliKey('invalid')).toEqual({ jy: 0, jm: 0, jd: 0 });
    });
  });

  describe('dateObjToKey / keyToDateObj', () => {
    it('رفت و برگشت بین آبجکت و کلید', () => {
      const obj = { jy: 1403, jm: 4, jd: 15 };
      const key = dateObjToKey(obj);
      expect(key).toBe('1403/04/15');
      expect(keyToDateObj(key)).toEqual(obj);
    });
  });

  describe('gregorianToJalaaliKey', () => {
    it('تاریخ میلادی را به کلید جلالی تبدیل می‌کند', () => {
      // نوروز 1403 = 20 مارس 2024
      const key = gregorianToJalaaliKey(new Date(2024, 2, 20));
      expect(key).toMatch(/^1403\/\d{2}\/\d{2}$/);
    });
  });

  describe('buildAppointmentPayload', () => {
    it('پیلود مناسب برای ارسال به بک‌اند می‌سازد', () => {
      const payload = buildAppointmentPayload({
        jy: 1403,
        jm: 4,
        jd: 15,
        timeSlot: '10:30',
        serviceId: 1,
      });
      expect(payload).toEqual({
        service_id: 1,
        jy: 1403,
        jm: 4,
        jd: 15,
        time_slot: '10:30',
      });
    });
  });

  describe('formatJalaaliKeyForDisplay', () => {
    it('کلید را برای نمایش فارسی فرمت می‌کند', () => {
      expect(formatJalaaliKeyForDisplay('1403/04/15')).toBe('15 تیر 1403');
    });
  });

  describe('compareJalaaliKeys', () => {
    it('دو کلید را مقایسه می‌کند', () => {
      expect(compareJalaaliKeys('1403/04/01', '1403/04/15')).toBeLessThan(0);
      expect(compareJalaaliKeys('1403/04/15', '1403/04/01')).toBeGreaterThan(0);
      expect(compareJalaaliKeys('1403/04/15', '1403/04/15')).toBe(0);
    });
  });

  describe('isFutureKey / isPastKey', () => {
    it('کلید آینده را تشخیص می‌دهد', () => {
      expect(isFutureKey('9999/01/01')).toBe(true);
      expect(isFutureKey('1300/01/01')).toBe(false);
    });

    it('کلید گذشته را تشخیص می‌دهد', () => {
      expect(isPastKey('1300/01/01')).toBe(true);
      expect(isPastKey('9999/01/01')).toBe(false);
    });
  });
});
