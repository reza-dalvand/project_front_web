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

// ═══════════════════════════════════════════════════════
//    تاریخ امروز جلالی
//    @returns {{ jy, jm, jd }}
// ═══════════════════════════════════════════════════════
export const todayJalaali = () => {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

// ═══════════════════════════════════════════════════════
//    تعداد روزهای یک ماه جلالی
//    @param {number} jy - سال جلالی
//    @param {number} jm - ماه جلالی (1-12)
//    @returns {number} - تعداد روزها (29/30/31)
// ═══════════════════════════════════════════════════════
export const jalaaliMonthLength = (jy, jm) => {
  return moment().jYear(jy).jMonth(jm - 1).jDaysInMonth();
};

// ═══════════════════════════════════════════════════════
//    روز هفته‌ی اولین روز ماه جلالی
//    @returns {number} - 0=شنبه، 1=یکشنبه، ... 6=جمعه
// ═══════════════════════════════════════════════════════
export const getFirstDayOfWeekJalaali = (jy, jm) => {
  const g = toGregorian(jy, jm, 1);
  const d = new Date(g.year, g.month - 1, g.day);
  const dayOfWeek = d.getDay(); // 0=Sunday ... 6=Saturday
  // تبدیل به هفته فارسی: شنبه=0
  return (dayOfWeek + 1) % 7;
};