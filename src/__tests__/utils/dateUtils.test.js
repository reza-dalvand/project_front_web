// src/__tests__/utils/dateUtils.test.js
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
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  // ═══════ toJalaali ═══════
  describe('toJalaali', () => {
    // ✅ FIX فاز ۱: ۲۰ ژوئن ۲۰۲۴ = خرداد ۳۱ (نه تیر ۱)
    // تیر ۱ ۱۴۰۳ = ۲۱ ژوئن ۲۰۲۴
    it('تبدیل صحیح تاریخ میلادی به جلالی', () => {
      const result = toJalaali(2024, 6, 20);
      expect(result.jy).toBe(1403);
      expect(result.jm).toBe(3);
      expect(result.jd).toBe(31);
    });

    it('تبدیل اول فروردین', () => {
      // ۲۰ مارس ۲۰۲۴ = ۱ فروردین ۱۴۰۳ ✓ (بدون تغییر)
      const result = toJalaali(2024, 3, 20);
      expect(result.jy).toBe(1403);
      expect(result.jm).toBe(1);
      expect(result.jd).toBe(1);
    });

    // ✅ FIX فاز ۱: ۱۴۰۳ کبیسه نیست (اسفند ۲۹ روزه)
    // ۲۰ مارس ۲۰۲۵ = ۲۹ اسفند ۱۴۰۳ (آخرین روز سال)
    it('تبدیل آخر اسفند (سال عادی)', () => {
      const result = toJalaali(2025, 3, 20);
      expect(result.jy).toBe(1403);
      expect(result.jm).toBe(12);
      expect(result.jd).toBe(29);
    });

    it('تبدیل تاریخ‌های مرزی', () => {
      const result = toJalaali(2000, 1, 1);
      expect(result.jy).toBe(1378);
      expect(result.jm).toBe(10);
      expect(result.jd).toBe(11);
    });
  });

  // ═══════ toGregorian ═══════
  describe('toGregorian', () => {
    // ✅ FIX فاز ۱: تیر ۱ ۱۴۰۳ = ۲۱ ژوئن ۲۰۲۴ (نه ۲۰ ژوئن)
    it('تبدیل صحیح تاریخ جلالی به میلادی', () => {
      const result = toGregorian(1403, 4, 1);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(21);
    });

    it('رفت و برگشت تبدیل (round-trip)', () => {
      const jalaali = { jy: 1403, jm: 6, jd: 15 };
      const gregorian = toGregorian(jalaali.jy, jalaali.jm, jalaali.jd);
      const back = toJalaali(gregorian.year, gregorian.month, gregorian.day);
      expect(back).toEqual(jalaali);
    });
  });

  // ═══════ formatJalaaliDate ═══════
  describe('formatJalaaliDate', () => {
    it('فرمت صحیح تاریخ جلالی', () => {
      expect(formatJalaaliDate({ jy: 1403, jm: 4, jd: 15 })).toBe('15 تیر 1403');
    });
    it('فرمت ماه‌های مختلف', () => {
      expect(formatJalaaliDate({ jy: 1403, jm: 1, jd: 1 })).toBe('1 فروردین 1403');
      expect(formatJalaaliDate({ jy: 1403, jm: 12, jd: 29 })).toBe('29 اسفند 1403');
    });
    it('ورودی null', () => {
      expect(formatJalaaliDate(null)).toBe('');
      expect(formatJalaaliDate(undefined)).toBe('');
    });
  });

  // ═══════ todayJalaali ═══════
  describe('todayJalaali', () => {
    it('برگشت آبجکت با فیلدهای jy, jm, jd', () => {
      const today = todayJalaali();
      expect(today).toHaveProperty('jy');
      expect(today).toHaveProperty('jm');
      expect(today).toHaveProperty('jd');
      expect(today.jy).toBeGreaterThan(1400);
      expect(today.jm).toBeGreaterThanOrEqual(1);
      expect(today.jm).toBeLessThanOrEqual(12);
      expect(today.jd).toBeGreaterThanOrEqual(1);
      expect(today.jd).toBeLessThanOrEqual(31);
    });
  });

  // ═══════ jalaaliMonthLength ═══════
  describe('jalaaliMonthLength', () => {
    it('ماه‌های ۱ تا ۶ → ۳۱ روز', () => {
      for (let m = 1; m <= 6; m++) {
        expect(jalaaliMonthLength(1403, m)).toBe(31);
      }
    });
    it('ماه‌های ۷ تا ۱۱ → ۳۰ روز', () => {
      for (let m = 7; m <= 11; m++) {
        expect(jalaaliMonthLength(1403, m)).toBe(30);
      }
    });
    // ✅ FIX فاز ۱: ۱۴۰۳ کبیسه نیست → اسفند ۲۹ روزه
    it('اسفند سال عادی → ۲۹ روز', () => {
      expect(jalaaliMonthLength(1403, 12)).toBe(29);
    });
    // ✅ FIX فاز ۱: سال کبیسه واقعی ۱۴۰۴ است (نه ۱۴۰۳)
    it('اسفند سال کبیسه → ۳۰ روز', () => {
      expect(jalaaliMonthLength(1404, 12)).toBe(30);
    });
  });

  // ═══════ timeToMinutes / minutesToTime ═══════
  describe('timeToMinutes', () => {
    it('تبدیل ساعت به دقیقه', () => {
      expect(timeToMinutes('09:00')).toBe(540);
      expect(timeToMinutes('14:30')).toBe(870);
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('23:59')).toBe(1439);
    });
    it('تبدیل اعداد فارسی', () => {
      expect(timeToMinutes('۰۹:۰۰')).toBe(540);
      expect(timeToMinutes('۱۴:۳۰')).toBe(870);
    });
    it('ورودی نامعتبر', () => {
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes(null)).toBe(0);
      expect(timeToMinutes('invalid')).toBe(0);
    });
  });

  describe('minutesToTime', () => {
    it('تبدیل دقیقه به ساعت', () => {
      expect(minutesToTime(540)).toBe('09:00');
      expect(minutesToTime(870)).toBe('14:30');
      expect(minutesToTime(0)).toBe('00:00');
    });
    it('ورودی نامعتبر', () => {
      expect(minutesToTime(-1)).toBe('00:00');
      expect(minutesToTime(NaN)).toBe('00:00');
    });
    it('رفت و برگشت (round-trip)', () => {
      const time = '14:30';
      expect(minutesToTime(timeToMinutes(time))).toBe(time);
    });
  });

  // ═══════ jalaaliToNumber ═══════
  describe('jalaaliToNumber', () => {
    it('تبدیل به عدد قابل مقایسه', () => {
      expect(jalaaliToNumber({ jy: 1403, jm: 4, jd: 15 })).toBe(14030415);
      expect(jalaaliToNumber({ jy: 1403, jm: 12, jd: 29 })).toBe(14031229);
    });
    it('مقایسه تاریخ‌ها', () => {
      const d1 = jalaaliToNumber({ jy: 1403, jm: 4, jd: 1 });
      const d2 = jalaaliToNumber({ jy: 1403, jm: 4, jd: 15 });
      expect(d1).toBeLessThan(d2);
    });
  });

  // ═══════ isSameJalaaliDay ═══════
  describe('isSameJalaaliDay', () => {
    it('دو تاریخ یکسان', () => {
      const d1 = { jy: 1403, jm: 4, jd: 15 };
      const d2 = { jy: 1403, jm: 4, jd: 15 };
      expect(isSameJalaaliDay(d1, d2)).toBe(true);
    });
    it('دو تاریخ متفاوت', () => {
      const d1 = { jy: 1403, jm: 4, jd: 15 };
      const d2 = { jy: 1403, jm: 4, jd: 16 };
      expect(isSameJalaaliDay(d1, d2)).toBe(false);
    });
    it('ورودی null', () => {
      expect(isSameJalaaliDay(null, { jy: 1403, jm: 4, jd: 15 })).toBe(false);
      expect(isSameJalaaliDay({ jy: 1403, jm: 4, jd: 15 }, null)).toBe(false);
    });
  });

  // ═══════ subtractJalaaliMonths ═══════
  describe('subtractJalaaliMonths', () => {
    it('کم کردن ماه در همان سال', () => {
      const result = subtractJalaaliMonths({ jy: 1403, jm: 6, jd: 15 }, 3);
      expect(result.jy).toBe(1403);
      expect(result.jm).toBe(3);
      expect(result.jd).toBe(15);
    });
    it('کم کردن ماه با تغییر سال', () => {
      const result = subtractJalaaliMonths({ jy: 1403, jm: 2, jd: 15 }, 3);
      expect(result.jy).toBe(1402);
      expect(result.jm).toBe(11);
      expect(result.jd).toBe(15);
    });
    // ✅ FIX فاز ۱: ۱۴۰۳ کبیسه نیست → اسفند ۲۹ روزه
    it('محدودیت روز در ماه اسفند', () => {
      const result = subtractJalaaliMonths({ jy: 1403, jm: 1, jd: 31 }, 1);
      expect(result.jm).toBe(12);
      expect(result.jd).toBeLessThanOrEqual(29);
    });
  });

  // ═══════ ثابت‌ها ═══════
  describe('constants', () => {
    it('۱۲ ماه فارسی', () => {
      expect(PERSIAN_MONTHS).toHaveLength(12);
      expect(PERSIAN_MONTHS[0]).toBe('فروردین');
      expect(PERSIAN_MONTHS[11]).toBe('اسفند');
    });
    it('۷ روز هفته', () => {
      expect(PERSIAN_WEEKDAYS).toHaveLength(7);
      expect(PERSIAN_WEEKDAYS[0]).toBe('شنبه');
      expect(PERSIAN_WEEKDAYS[6]).toBe('جمعه');
    });
  });
});
