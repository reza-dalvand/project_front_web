// src/__tests__/utils/cancellationUtils.test.js
import {
  CANCELLATION_THRESHOLD_HOURS,
  getHoursUntilAppointment,
  canCancelAppointment,
  getCancellationPolicy,
  formatHoursLeft,
} from '@/utils/cancellation-utils';
import { toJalaali } from '@/utils/dateUtils';

describe('cancellation-utils', () => {
  describe('CANCELLATION_THRESHOLD_HOURS', () => {
    it('آستانه ۱۲ ساعت', () => {
      expect(CANCELLATION_THRESHOLD_HOURS).toBe(12);
    });
  });

  describe('getHoursUntilAppointment', () => {
    it('محاسبه ساعت برای تاریخ فردا', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      const j = toJalaali(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      const hours = getHoursUntilAppointment(j, '12:00');
      expect(hours).toBeGreaterThan(12);
      expect(hours).toBeLessThan(48);
    });

    it('ورودی null', () => {
      expect(getHoursUntilAppointment(null, '10:00')).toBe(Infinity);
    });
  });

  describe('canCancelAppointment', () => {
    it('نوبت فردا → قابل لغو', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      const j = toJalaali(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      expect(canCancelAppointment(j, '18:00')).toBe(true);
    });

    it('نوبت ۲ ساعت دیگر → غیرقابل لغو', () => {
      const soon = new Date();
      soon.setHours(soon.getHours() + 2);
      const j = toJalaali(soon.getFullYear(), soon.getMonth() + 1, soon.getDate());
      const timeStr = `${String(soon.getHours()).padStart(2, '0')}:${String(soon.getMinutes()).padStart(2, '0')}`;
      expect(canCancelAppointment(j, timeStr)).toBe(false);
    });
  });

  describe('getCancellationPolicy', () => {
    it('سیاست لغو مجاز', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const j = toJalaali(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      const policy = getCancellationPolicy(j, '12:00');
      expect(policy.canCancel).toBe(true);
      expect(policy.penaltyPercent).toBe(0);
      expect(policy.refundPercent).toBe(100);
    });

    it('سیاست لغو غیرمجاز', () => {
      const soon = new Date();
      soon.setHours(soon.getHours() + 1);
      const j = toJalaali(soon.getFullYear(), soon.getMonth() + 1, soon.getDate());
      const timeStr = `${String(soon.getHours()).padStart(2, '0')}:${String(soon.getMinutes()).padStart(2, '0')}`;
      const policy = getCancellationPolicy(j, timeStr);
      expect(policy.canCancel).toBe(false);
    });
  });

  describe('formatHoursLeft', () => {
    it('فرمت ساعت', () => {
      expect(formatHoursLeft(0.5)).toContain('کمتر از ۱ ساعت');
      expect(formatHoursLeft(5)).toContain('۵ ساعت');
      expect(formatHoursLeft(25)).toContain('۱ روز');
    });
  });
});
