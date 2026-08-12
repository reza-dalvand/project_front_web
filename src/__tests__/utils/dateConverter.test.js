// src/__tests__/utils/dateConverter.test.js
import {
  toJalaaliKey,
  fromJalaaliKey,
  dateObjToKey,
  keyToDateObj,
  formatJalaaliKeyForDisplay,
  compareJalaaliKeys,
  isTodayKey,
  isFutureKey,
  isPastKey,
  buildAppointmentPayload,
} from '@/utils/date-converter';

describe('date-converter', () => {
  describe('toJalaaliKey', () => {
    it('تبدیل به فرمت YYYY/MM/DD', () => {
      expect(toJalaaliKey(1403, 4, 15)).toBe('1403/04/15');
      expect(toJalaaliKey(1403, 12, 29)).toBe('1403/12/29');
      expect(toJalaaliKey(1403, 1, 1)).toBe('1403/01/01');
    });

    it('padding صفر برای ماه و روز تک‌رقمی', () => {
      expect(toJalaaliKey(1403, 4, 5)).toBe('1403/04/05');
      expect(toJalaaliKey(1403, 1, 1)).toBe('1403/01/01');
    });

    it('ورودی نامعتبر', () => {
      expect(toJalaaliKey(0, 0, 0)).toBe('');
      expect(toJalaaliKey(null, 4, 15)).toBe('');
    });
  });

  describe('fromJalaaliKey', () => {
    it('تبدیل از فرمت YYYY/MM/DD', () => {
      expect(fromJalaaliKey('1403/04/15')).toEqual({ jy: 1403, jm: 4, jd: 15 });
    });

    it('ورودی نامعتبر', () => {
      expect(fromJalaaliKey('')).toEqual({ jy: 0, jm: 0, jd: 0 });
      expect(fromJalaaliKey('invalid')).toEqual({ jy: 0, jm: 0, jd: 0 });
    });

    it('رفت و برگشت (round-trip)', () => {
      const key = toJalaaliKey(1403, 4, 15);
      const obj = fromJalaaliKey(key);
      expect(toJalaaliKey(obj.jy, obj.jm, obj.jd)).toBe(key);
    });
  });

  describe('compareJalaaliKeys', () => {
    it('مقایسه صحیح', () => {
      expect(compareJalaaliKeys('1403/04/01', '1403/04/15')).toBeLessThan(0);
      expect(compareJalaaliKeys('1403/04/15', '1403/04/01')).toBeGreaterThan(0);
      expect(compareJalaaliKeys('1403/04/15', '1403/04/15')).toBe(0);
    });
  });

  describe('buildAppointmentPayload', () => {
    it('ساخت payload صحیح', () => {
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
});
