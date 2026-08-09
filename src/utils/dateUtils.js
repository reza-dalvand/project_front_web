// src/utils/dateUtils.js
// ✅ بدون وابستگی به moment-jalaali — الگوریتم خالص تبدیل تاریخ
// حجم: ~2KB به جای ~115KB

// ═══════════════════════════════════════════════════════
//    الگوریتم تبدیل میلادی ↔ جلالی (بدون کتابخانه)
// ═══════════════════════════════════════════════════════

// تبدیل میلادی به عدد روز از مبدأ (Julian Day Number)
const gregorianToJDN = (year, month, day) => {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
};

// تبدیل عدد روز به میلادی
const jdnToGregorian = (jdn) => {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
};

// تبدیل جلالی به عدد روز (JDN)
const jalaaliToJDN = (jy, jm, jd) => {
  const gy = jy + 621;
  const r = jalCal(jy);
  const jdn =
    gregorianToJDN(gy, 3, r.march) + (jm - 1) * 31 - Math.floor((jm - 1) / 7) * (jm - 7) + jd - 1;
  return jdn;
};

// تبدیل عدد روز به جلالی
const jdnToJalaali = (jdn) => {
  const gy = jdnToGregorian(jdn).year;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = gregorianToJDN(gy, 3, r.march);
  let jd, jm, k;

  k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + Math.floor(k / 31);
      jd = (k % 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }

  jm = 7 + Math.floor(k / 30);
  jd = (k % 30) + 1;
  return { jy, jm, jd };
};

// محاسبه سال جلالی (الگوریتم تقویم جلالی)
const jalCal = (jy) => {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];
  let bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error('Invalid Jalaali year ' + jy);
  }

  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1;

  const leapG = Math.floor(gy / 4) - Math.floor(((Math.floor(gy / 100) + 1) * 3) / 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;

  let leap = (((n + 1) % 33) - 1) % 4;
  if (leap === -1) leap = 4;

  return { leap, march };
};

// ═══════════════════════════════════════════════════════
//    نام ماه‌ها و روزهای هفته
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
//    API عمومی (همان interface قبلی)
// ═══════════════════════════════════════════════════════

/**
 * تبدیل میلادی به جلالی
 * @param {number} year - سال میلادی
 * @param {number} month - ماه میلادی (1-12)
 * @param {number} day - روز میلادی
 * @returns {{ jy: number, jm: number, jd: number }}
 */
export const toJalaali = (year, month, day) => {
  const jdn = gregorianToJDN(year, month, day);
  return jdnToJalaali(jdn);
};

/**
 * تبدیل جلالی به میلادی
 * @param {number} jy - سال جلالی
 * @param {number} jm - ماه جلالی (1-12)
 * @param {number} jd - روز جلالی
 * @returns {{ year: number, month: number, day: number }}
 */
export const toGregorian = (jy, jm, jd) => {
  const jdn = jalaaliToJDN(jy, jm, jd);
  return jdnToGregorian(jdn);
};

/**
 * فرمت تاریخ جلالی فارسی
 * @param {{ jy, jm, jd }} date
 * @returns {string} مثال: "۱۵ تیر ۱۴۰۳"
 */
export const formatJalaaliDate = (date) => {
  if (!date) return '';
  return `${date.jd} ${PERSIAN_MONTHS[date.jm - 1]} ${date.jy}`;
};

/**
 * تاریخ امروز جلالی
 * @returns {{ jy, jm, jd }}
 */
export const todayJalaali = () => {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

/**
 * تعداد روزهای یک ماه جلالی
 * @param {number} jy - سال جلالی
 * @param {number} jm - ماه جلالی (1-12)
 * @returns {number}
 */
export const jalaaliMonthLength = (jy, jm) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // اسفند
  const r = jalCal(jy);
  return r.leap === 1 ? 30 : 29;
};

/**
 * روز هفته اولین روز ماه جلالی
 * @param {number} jy
 * @param {number} jm
 * @returns {number} 0=شنبه ... 6=جمعه
 */
export const getFirstDayOfWeekJalaali = (jy, jm) => {
  const g = toGregorian(jy, jm, 1);
  const d = new Date(g.year, g.month - 1, g.day);
  const dayOfWeek = d.getDay(); // 0=Sunday ... 6=Saturday
  return (dayOfWeek + 1) % 7; // شنبه=0
};

/**
 * تبدیل ساعت "HH:MM" به دقیقه
 * @param {string} timeStr
 * @returns {number}
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  // تبدیل اعداد فارسی به انگلیسی
  const english = timeStr
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const parts = english.split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
};

/**
 * تبدیل دقیقه به "HH:MM"
 * @param {number} totalMinutes
 * @returns {string}
 */
export const minutesToTime = (totalMinutes) => {
  if (typeof totalMinutes !== 'number' || isNaN(totalMinutes) || totalMinutes < 0) {
    return '00:00';
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// ═══════════════════════════════════════════════════════
//    توابع کمکی مقایسه و فیلتر
// ═══════════════════════════════════════════════════════

/**
 * تبدیل تاریخ جلالی به عدد قابل مقایسه
 */
export const jalaaliToNumber = ({ jy, jm, jd }) => jy * 10000 + jm * 100 + jd;

/**
 * تبدیل تاریخ جلالی به Date
 */
export const jalaaliToDate = (date) => {
  if (!date) return new Date(0);
  const g = toGregorian(date.jy, date.jm, date.jd);
  return new Date(g.year, g.month - 1, g.day);
};

/**
 * آیا دو تاریخ جلالی یک روز هستند؟
 */
export const isSameJalaaliDay = (d1, d2) =>
  Boolean(d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd);

/**
 * کم کردن ماه از تاریخ جلالی
 */
export const subtractJalaaliMonths = (date, months) => {
  let jy = date.jy;
  let jm = date.jm - months;
  let jd = date.jd;
  while (jm < 1) {
    jm += 12;
    jy -= 1;
  }
  const maxDay = jalaaliMonthLength(jy, jm);
  return { jy, jm, jd: Math.min(jd, maxDay) };
};

/**
 * فرمت تاریخ با Intl (سبک‌تر و native)
 */
export const formatDateIntl = (date, options = {}) => {
  if (!date) return '';
  const d = date instanceof Date ? date : jalaaliToDate(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
};
