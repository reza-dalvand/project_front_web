import {
  CANCELLATION_THRESHOLD_HOURS,
  getHoursUntilAppointment,
  canCancelAppointment,
  getCancellationPolicy,
  formatHoursLeft,
} from '@/utils/cancellation-utils';

const futureDate = { jy: 1410, jm: 1, jd: 1 };
const pastDate = { jy: 1400, jm: 1, jd: 1 };

describe('cancellation-utils', () => {
  describe('CANCELLATION_THRESHOLD_HOURS', () => {
    it('آستانه لغو ۱۲ ساعت است', () => {
      expect(CANCELLATION_THRESHOLD_HOURS).toBe(12);
    });
  });

  describe('getHoursUntilAppointment', () => {
    it('برای تاریخ آینده، عدد مثبت برمی‌گرداند', () => {
      const hours = getHoursUntilAppointment(futureDate, '12:00');
      expect(hours).toBeGreaterThan(12);
    });

    it('برای تاریخ گذشته، عدد منفی برمی‌گرداند', () => {
      const hours = getHoursUntilAppointment(pastDate, '12:00');
      expect(hours).toBeLessThan(0);
    });

    it('برای ورودی نامعتبر، بی‌نهایت برمی‌گرداند', () => {
      expect(getHoursUntilAppointment(null, '12:00')).toBe(Infinity);
      expect(getHoursUntilAppointment(futureDate, null)).toBe(Infinity);
    });
  });

  describe('canCancelAppointment', () => {
    it('برای تاریخ آینده، مجاز است', () => {
      expect(canCancelAppointment(futureDate, '12:00')).toBe(true);
    });

    it('برای تاریخ گذشته، مجاز نیست', () => {
      expect(canCancelAppointment(pastDate, '12:00')).toBe(false);
    });
  });

  describe('getCancellationPolicy', () => {
    it('برای تاریخ آینده، سیاست لغو مجاز برمی‌گرداند', () => {
      const policy = getCancellationPolicy(futureDate, '12:00');
      expect(policy.canCancel).toBe(true);
      expect(policy.penaltyPercent).toBe(0);
      expect(policy.refundPercent).toBe(100);
    });

    it('برای تاریخ گذشته، سیاست لغو غیرمجاز برمی‌گرداند', () => {
      const policy = getCancellationPolicy(pastDate, '12:00');
      expect(policy.canCancel).toBe(false);
      expect(policy.penaltyPercent).toBe(0);
      expect(policy.refundPercent).toBe(0);
    });
  });

  describe('formatHoursLeft', () => {
    it('زمان کمتر از یک ساعت را فرمت می‌کند', () => {
      expect(formatHoursLeft(0.5)).toContain('کمتر از ۱ ساعت');
    });

    it('زمان ساعتی را فرمت می‌کند', () => {
      expect(formatHoursLeft(5)).toContain('۵ ساعت');
    });

    it('زمان روز و ساعت را فرمت می‌کند', () => {
      expect(formatHoursLeft(25)).toContain('۱ روز و ۱ ساعت');
    });

    it('زمان روز کامل را فرمت می‌کند', () => {
      expect(formatHoursLeft(48)).toContain('۲ روز');
    });
  });
});
