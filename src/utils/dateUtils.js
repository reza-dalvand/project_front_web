// src/utils/dateUtils.js
import moment from 'moment-jalaali';

// ═══════════════════════════════════════════════════════
//    نام ماه‌های فارسی (۱۲ ماه)
// ═══════════════════════════════════════════════════════
export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// ═══════════════════════════════════════════════════════
//    نام روزهای هفته فارسی
//    ایندکس ۰ = شنبه (مطابق فرمول (dayOfWeek + 1) % 7)
// ═══════════════════════════════════════════════════════
export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

// ═══════════════════════════════════════════════════════
//    تبدیل تاریخ میلادی به جلالی
//    @param {number} year  - سال میلادی
//    @param {number} month - ماه میلادی (1-12)
//    @param {number} day   - روز میلادی
//    @returns {{ jy, jm, jd }}
// ═══════════════════════════════════════════════════════
export const toJalaali = (year, month, day) => {
  const m = moment(new Date(year, month - 1, day));
  return {
    jy: m.jYear(),
    jm: m.jMonth() + 1, // 0-based → 1-based
    jd: m.jDate(),
  };
};

// ═══════════════════════════════════════════════════════
//    تبدیل تاریخ جلالی به میلادی
//    @param {number} jy - سال جلالی
//    @param {number} jm - ماه جلالی (1-12)
//    @param {number} jd - روز جلالی
//    @returns {{ year, month, day }}
// ═══════════════════════════════════════════════════════
export const toGregorian = (jy, jm, jd) => {
  const m = moment().jYear(jy).jMonth(jm - 1).jDate(jd);
  return {
    year: m.year(),
    month: m.month() + 1,
    day: m.date(),
  };
};

// ═══════════════════════════════════════════════════════
//    فرمت تاریخ جلالی به صورت فارسی
//    @param {{ jy, jm, jd }} date
//    @returns {string} - مثال: "۱۵ تیر ۱۴۰۳"
// ═══════════════════════════════════════════════════════
export const formatJalaaliDate = (date) => {
  if (!date) return '';
  return `${date.jd} ${PERSIAN_MONTHS[date.jm - 1]} ${date.jy}`;
};