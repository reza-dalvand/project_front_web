import {
  toJalaali,
  toGregorian,
  formatJalaaliDate,
  todayJalaali,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali,
  timeToMinutes,
  minutesToTime,
  jalaaliToNumber,
  jalaaliToDate,
  isSameJalaaliDay,
  subtractJalaaliMonths,
  toJalaaliKey,
  fromJalaaliKey,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('toJalaali', () => {
    it('تاریخ میلادی را به جلالی تبدیل می‌کند (نوروز ۱۴۰۳)', () => {
      expect(toJalaali(2024, 3, 20)).toEqual({ jy: 1403, jm: 1, jd: 1 });
    });
  });

  describe('toGregorian', () => {
    it('تاریخ جلالی را به میلادی تبدیل می‌کند', () => {
      expect(toGregorian(1403, 1, 1)).toEqual({ year: 2024, month: 3, day: 20 });
    });
  });

  describe('formatJalaaliDate', () => {
    it('تاریخ جلالی را فارسی فرمت می‌کند', () => {
      expect(formatJalaaliDate({ jy: 1403, jm: 4, jd: 15 })).toBe('15 تیر 1403');
    });

    it('برای تاریخ نامعتبر، رشته خالی برمی‌گرداند', () => {
      expect(formatJalaaliDate(null)).toBe('');
    });
  });

  describe('todayJalaali', () => {
    it('تاریخ امروز را با فیلدهای معتبر برمی‌گرداند', () => {
      const today = todayJalaali();
      expect(today.jy).toBeGreaterThan(1400);
      expect(today.jm).toBeGreaterThanOrEqual(1);
      expect(today.jm).toBeLessThanOrEqual(12);
      expect(today.jd).toBeGreaterThanOrEqual(1);
      expect(today.jd).toBeLessThanOrEqual(31);
    });
  });

  describe('jalaaliMonthLength', () => {
    it('ماه‌های ۱ تا ۶ سی‌ویک‌روزه هستند', () => {
      for (let m = 1; m <= 6; m++) {
        expect(jalaaliMonthLength(1403, m)).toBe(31);
      }
    });

    it('ماه‌های ۷ تا ۱۱ سی‌روزه هستند', () => {
      for (let m = 7; m <= 11; m++) {
        expect(jalaaliMonthLength(1403, m)).toBe(30);
      }
    });

    it('ماه ۱۲، ۲۹ یا ۳۰ روز است', () => {
      const len = jalaaliMonthLength(1403, 12);
      expect([29, 30]).toContain(len);
    });
  });

  describe('getFirstDayOfWeekJalaali', () => {
    it('روز هفته اولین روز فروردین ۱۴۰۳ (چهارشنبه) را برمی‌گرداند', () => {
      // 20 مارس 2024 = چهارشنبه → اندیس 4
      expect(getFirstDayOfWeekJalaali(1403, 1)).toBe(4);
    });
  });

  describe('timeToMinutes', () => {
    it('ساعت را به دقیقه تبدیل می‌کند', () => {
      expect(timeToMinutes('09:00')).toBe(540);
      expect(timeToMinutes('14:30')).toBe(870);
    });

    it('ساعت فارسی را تبدیل می‌کند', () => {
      expect(timeToMinutes('۰۹:۰۰')).toBe(540);
    });

    it('برای ورودی نامعتبر صفر برمی‌گرداند', () => {
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes(null)).toBe(0);
      expect(timeToMinutes('invalid')).toBe(0);
    });
  });

  describe('minutesToTime', () => {
    it('دقیقه را به ساعت تبدیل می‌کند', () => {
      expect(minutesToTime(540)).toBe('09:00');
      expect(minutesToTime(870)).toBe('14:30');
      expect(minutesToTime(0)).toBe('00:00');
    });

    it('برای ورودی نامعتبر، صفر برمی‌گرداند', () => {
      expect(minutesToTime(-1)).toBe('00:00');
      expect(minutesToTime(NaN)).toBe('00:00');
    });
  });

  describe('jalaaliToNumber', () => {
    it('تاریخ را به عدد قابل مقایسه تبدیل می‌کند', () => {
      expect(jalaaliToNumber({ jy: 1403, jm: 4, jd: 15 })).toBe(14030415);
    });
  });

  describe('isSameJalaaliDay', () => {
    it('دو تاریخ یکسان را تشخیص می‌دهد', () => {
      const d1 = { jy: 1403, jm: 4, jd: 15 };
      const d2 = { jy: 1403, jm: 4, jd: 15 };
      expect(isSameJalaaliDay(d1, d2)).toBe(true);
    });

    it('دو تاریخ متفاوت را تشخیص می‌دهد', () => {
      const d1 = { jy: 1403, jm: 4, jd: 15 };
      const d2 = { jy: 1403, jm: 4, jd: 16 };
      expect(isSameJalaaliDay(d1, d2)).toBe(false);
    });

    it('برای تاریخ نامعتبر، خالی برمی‌گرداند', () => {
      expect(isSameJalaaliDay(null, { jy: 1403, jm: 4, jd: 15 })).toBe(false);
    });
  });

  describe('subtractJalaaliMonths', () => {
    it('ماه‌ها را در همان سال کم می‌کند', () => {
      const result = subtractJalaaliMonths({ jy: 1403, jm: 6, jd: 15 }, 3);
      expect(result.jy).toBe(1403);
      expect(result.jm).toBe(3);
      expect(result.jd).toBe(15);
    });

    it('با تغییر سال، ماه را کم می‌کند', () => {
      const result = subtractJalaaliMonths({ jy: 1403, jm: 2, jd: 15 }, 3);
      expect(result.jy).toBe(1402);
      expect(result.jm).toBe(11);
    });
  });

  describe('toJalaaliKey / fromJalaaliKey', () => {
    it('رفت و برگشت کلید و تاریخ', () => {
      const key = toJalaaliKey(1403, 4, 15);
      expect(key).toBe('1403/04/15');
      expect(fromJalaaliKey(key)).toEqual({ jy: 1403, jm: 4, jd: 15 });
    });
  });

  describe('ثابت‌ها', () => {
    it('۱۲ ماه فارسی وجود دارد', () => {
      expect(PERSIAN_MONTHS).toHaveLength(12);
      expect(PERSIAN_MONTHS[0]).toBe('فروردین');
      expect(PERSIAN_MONTHS[11]).toBe('اسفند');
    });

    it('۷ روز هفته وجود دارد', () => {
      expect(PERSIAN_WEEKDAYS).toHaveLength(7);
      expect(PERSIAN_WEEKDAYS[0]).toBe('شنبه');
    });
  });
});
