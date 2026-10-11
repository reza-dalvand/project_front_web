// src/utils/dateUtils.js
// ✅ الگوریتم خالص تبدیل تاریخ — بدون وابستگی خارجی
// ✅ FIX فاز ۱: رفع باگ‌های کبیسه و ترتیب توابع
// ✅ FIX فاز ۳: کش برای تبدیل‌های تکراری (رفع افت عملکرد در لیست‌ها)
// ✅ FIX باگ ۵.۲: رفع مشکل timeToMinutes با جداکننده‌های غیر انگلیسی (مثل ؛ یا /)
// ✅ FIX COMP-01: اعتبارسنجی ورودی‌ها برای جلوگیری از NaN خاموش
// حجم: ~2.5KB | بدون کتابخانه

// ═══════════════════════════════════════════════════════
//    ✅ COMP-01 FIX: توابع کمکی اعتبارسنجی
// ═══════════════════════════════════════════════════════

/**
 * بررسی معتبر بودن عدد (نه undefined، null، NaN، یا Infinity)
 */
const isValidNumber = (val) =>
  typeof val === 'number' && !isNaN(val) && isFinite(val);

/**
 * اعتبارسنجی ورودی‌های تاریخ جلالی
 * @throws {Error} اگر ورودی‌ها نامعتبر باشند
 */
const validateJalaaliInputs = (jy, jm, jd, fnName = 'Jalaali') => {
  if (!isValidNumber(jy) || !isValidNumber(jm) || !isValidNumber(jd)) {
    throw new Error(
      `${fnName}: ورودی‌های نامعتبر — jy=${jy}, jm=${jm}, jd=${jd}. ` +
        `تمام مقادیر باید عدد معتبر باشند.`
    );
  }
  // بررسی محدوده ماه
  if (jm < 1 || jm > 12) {
    throw new Error(`${fnName}: ماه باید بین ۱ تا ۱۲ باشد. jm=${jm}`);
  }
  // بررسی محدوده روز
  if (jd < 1 || jd > 31) {
    throw new Error(`${fnName}: روز باید بین ۱ تا ۳۱ باشد. jd=${jd}`);
  }
};

/**
 * اعتبارسنجی ورودی‌های تاریخ میلادی
 * @throws {Error} اگر ورودی‌ها نامعتبر باشند
 */
const validateGregorianInputs = (year, month, day, fnName = 'Gregorian') => {
  if (!isValidNumber(year) || !isValidNumber(month) || !isValidNumber(day)) {
    throw new Error(
      `${fnName}: ورودی‌های نامعتبر — year=${year}, month=${month}, day=${day}. ` +
        `تمام مقادیر باید عدد معتبر باشند.`
    );
  }
  if (month < 1 || month > 12) {
    throw new Error(`${fnName}: ماه باید بین ۱ تا ۱۲ باشد. month=${month}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`${fnName}: روز باید بین ۱ تا ۳۱ باشد. day=${day}`);
  }
};

// ═══════════════════════════════════════════════════════
//    الگوریتم تبدیل میلادی ↔ جلالی
// ═══════════════════════════════════════════════════════

const jalCal = (jy) => {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];
  const bl = breaks.length;
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

const gregorianToJDN = (year, month, day) => {
  // ✅ COMP-01 FIX: اعتبارسنجی ورودی‌ها
  validateGregorianInputs(year, month, day, 'gregorianToJDN');
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

const jdnToGregorian = (jdn) => {
  // ✅ COMP-01 FIX: اعتبارسنجی ورودی JDN
  if (!isValidNumber(jdn)) {
    throw new Error(`jdnToGregorian: JDN نامعتبر — ${jdn}. باید عدد معتبر باشد.`);
  }
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

const jalaaliToJDN = (jy, jm, jd) => {
  // ✅ COMP-01 FIX: اعتبارسنجی ورودی‌ها قبل از محاسبه
  validateJalaaliInputs(jy, jm, jd, 'jalaaliToJDN');
  const gy = jy + 621;
  const r = jalCal(jy);
  const jdn =
    gregorianToJDN(gy, 3, r.march) + (jm - 1) * 31 - Math.floor((jm - 1) / 7) * (jm - 7) + jd - 1;
  return jdn;
};

const jdnToJalaali = (jdn) => {
  // ✅ COMP-01 FIX: اعتبارسنجی ورودی JDN
  if (!isValidNumber(jdn)) {
    throw new Error(`jdnToJalaali: JDN نامعتبر — ${jdn}. باید عدد معتبر باشد.`);
  }
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
    const rNew = jalCal(jy);
    if (rNew.leap === 1) k += 1;
  }
  jm = 7 + Math.floor(k / 30);
  jd = (k % 30) + 1;
  return { jy, jm, jd };
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
//    ✅ FIX فاز ۳: کش ساده برای تبدیل‌های تکراری
// ═══════════════════════════════════════════════════════

const CACHE_MAX_SIZE = 1000;
const _toJalaaliCache = new Map();
const _toGregorianCache = new Map();

const pruneCache = (cache) => {
  if (cache.size < CACHE_MAX_SIZE) return;
  const keysToDelete = Array.from(cache.keys()).slice(0, CACHE_MAX_SIZE / 2);
  keysToDelete.forEach((k) => cache.delete(k));
};

/**
 * تبدیل میلادی به جلالی
 * ✅ COMP-01 FIX: اعتبارسنجی ورودی‌ها
 * @param {number} year - سال میلادی
 * @param {number} month - ماه میلادی (1-12)
 * @param {number} day - روز میلادی
 * @returns {{ jy: number, jm: number, jd: number }}
 * @throws {Error} اگر ورودی‌ها نامعتبر باشند
 */
export const toJalaali = (year, month, day) => {
  // ✅ COMP-01 FIX: اعتبارسنجی قبل از هر چیز
  validateGregorianInputs(year, month, day, 'toJalaali');
  const key = `${year}-${month}-${day}`;
  if (_toJalaaliCache.has(key)) {
    return _toJalaaliCache.get(key);
  }
  const jdn = gregorianToJDN(year, month, day);
  const result = jdnToJalaali(jdn);
  pruneCache(_toJalaaliCache);
  _toJalaaliCache.set(key, result);
  return result;
};

/**
 * تبدیل جلالی به میلادی
 * ✅ COMP-01 FIX: اعتبارسنجی ورودی‌ها
 * @param {number} jy - سال جلالی
 * @param {number} jm - ماه جلالی (1-12)
 * @param {number} jd - روز جلالی
 * @returns {{ year: number, month: number, day: number }}
 * @throws {Error} اگر ورودی‌ها نامعتبر باشند
 */
export const toGregorian = (jy, jm, jd) => {
  // ✅ COMP-01 FIX: اعتبارسنجی قبل از هر چیز
  validateJalaaliInputs(jy, jm, jd, 'toGregorian');
  const key = `${jy}-${jm}-${jd}`;
  if (_toGregorianCache.has(key)) {
    return _toGregorianCache.get(key);
  }
  const jdn = jalaaliToJDN(jy, jm, jd);
  const result = jdnToGregorian(jdn);
  pruneCache(_toGregorianCache);
  _toGregorianCache.set(key, result);
  return result;
};

/**
 * فرمت تاریخ جلالی فارسی
 * @param {{ jy, jm, jd }} date
 * @returns {string} مثال: "۱۵ تیر ۱۴۰۳"
 */
export const formatJalaaliDate = (date) => {
  if (!date) return '';
  // ✅ COMP-01 FIX: بررسی شکل آبجکت
  if (!isValidNumber(date.jy) || !isValidNumber(date.jm) || !isValidNumber(date.jd)) {
    return '';
  }
  const monthIndex = date.jm - 1;
  if (monthIndex < 0 || monthIndex >= PERSIAN_MONTHS.length) return '';
  return `${date.jd} ${PERSIAN_MONTHS[monthIndex]} ${date.jy}`;
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
  // ✅ COMP-01 FIX: اعتبارسنجی
  if (!isValidNumber(jy) || !isValidNumber(jm) || jm < 1 || jm > 12) {
    throw new Error(`jalaaliMonthLength: ورودی نامعتبر — jy=${jy}, jm=${jm}`);
  }
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
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
  // ✅ COMP-01 FIX: اعتبارسنجی
  if (!isValidNumber(jy) || !isValidNumber(jm) || jm < 1 || jm > 12) {
    throw new Error(`getFirstDayOfWeekJalaali: ورودی نامعتبر — jy=${jy}, jm=${jm}`);
  }
  const g = toGregorian(jy, jm, 1);
  const d = new Date(g.year, g.month - 1, g.day);
  const dayOfWeek = d.getDay();
  return (dayOfWeek + 1) % 7;
};

/**
 * تبدیل ساعت "HH:MM" به دقیقه
 * ✅ FIX باگ ۵.۲: پشتیبانی از جداکننده‌های فارسی/عربی و فرمت‌های بدون جداکننده
 * @param {string} timeStr
 * @returns {number}
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;

  // تبدیل اعداد فارسی/عربی به انگلیسی
  const english = timeStr
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  // ✅ FIX: استفاده از regex برای جدا کردن اعداد
  const parts = english.split(/\D+/).filter(Boolean);

  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours * 60 + minutes;
  }

  // Fallback: اگر جداکننده‌ای وجود نداشت
  const digits = english.replace(/\D/g, '');
  if (digits.length === 4) {
    return parseInt(digits.slice(0, 2), 10) * 60 + parseInt(digits.slice(2), 10);
  }
  if (digits.length === 3) {
    return parseInt(digits[0], 10) * 60 + parseInt(digits.slice(1), 10);
  }

  return 0;
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
 * تبدیل آبجکت تاریخ جلالی به عدد قابل مقایسه
 * ✅ COMP-01 FIX: محافظت در برابر ورودی نامعتبر
 */
export const jalaaliToNumber = ({ jy, jm, jd }) => {
  if (!isValidNumber(jy) || !isValidNumber(jm) || !isValidNumber(jd)) {
    return 0; // مقدار پیش‌فرض امن برای فیلتر/مرتب‌سازی
  }
  return jy * 10000 + jm * 100 + jd;
};

/**
 * تبدیل آبجکت تاریخ جلالی به Date میلادی
 * ✅ COMP-01 FIX: محافظت در برابر ورودی نامعتبر
 */
export const jalaaliToDate = (date) => {
  if (!date) return new Date(0);
  if (!isValidNumber(date.jy) || !isValidNumber(date.jm) || !isValidNumber(date.jd)) {
    return new Date(0);
  }
  try {
    const g = toGregorian(date.jy, date.jm, date.jd);
    return new Date(g.year, g.month - 1, g.day);
  } catch {
    return new Date(0);
  }
};

export const isSameJalaaliDay = (d1, d2) =>
  Boolean(d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd);

/**
 * کم کردن ماه از تاریخ جلالی
 * ✅ COMP-01 FIX: اعتبارسنجی ورودی
 */
export const subtractJalaaliMonths = (date, months) => {
  if (!date || !isValidNumber(date.jy) || !isValidNumber(date.jm) || !isValidNumber(date.jd)) {
    throw new Error('subtractJalaaliMonths: ورودی تاریخ نامعتبر است');
  }
  if (!isValidNumber(months)) {
    throw new Error('subtractJalaaliMonths: تعداد ماه باید عدد معتبر باشد');
  }
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

// ═══════════════════════════════════════════════════════
//    توابع سازگاری با بک‌اند
// ═══════════════════════════════════════════════════════

/**
 * تبدیل تاریخ جلالی به date_key (فرمت بک‌اند)
 * @param {number} jy
 * @param {number} jm
 * @param {number} jd
 * @returns {string} - "1405/04/22"
 */
export const toJalaaliKey = (jy, jm, jd) => {
  if (!isValidNumber(jy) || !isValidNumber(jm) || !isValidNumber(jd)) return '';
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
};

/**
 * تبدیل date_key به تاریخ جلالی
 * @param {string} dateKey - "1405/04/22"
 * @returns {{ jy: number, jm: number, jd: number }}
 */
export const fromJalaaliKey = (dateKey) => {
  if (!dateKey || typeof dateKey !== 'string') return { jy: 0, jm: 0, jd: 0 };
  const parts = dateKey.split('/').map(Number);
  if (parts.length !== 3) return { jy: 0, jm: 0, jd: 0 };
  if (!isValidNumber(parts[0]) || !isValidNumber(parts[1]) || !isValidNumber(parts[2])) {
    return { jy: 0, jm: 0, jd: 0 };
  }
  return { jy: parts[0], jm: parts[1], jd: parts[2] };
};


// ═══════════════════════════════════════════════════════
//    فرمت‌دهنده مدت عضویت کاربر
// ═══════════════════════════════════════════════════════

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const toFaDigits = (value) =>
  String(value).replace(/[0-9]/g, (digit) => FA_DIGITS[Number(digit)]);

const normalizeDigits = (value) =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٣٤٥٧٨٩'.indexOf(digit)));

/**
 * تبدیل ورودی‌های مختلف تاریخ به Date معتبر
 * پشتیبانی از:
 * - ISO string
 * - Unix timestamp seconds
 * - Unix timestamp milliseconds
 * - تاریخ شمسی مثل 1403/01/15
 * - تاریخ میلادی مثل 2024-01-15
 */
const parseMembershipDate = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    // اعداد خیلی کوچک احتمالاً timestamp نیستند
    if (!Number.isFinite(value) || value <= 0 || value < 1000000000) {
      return null;
    }

    // اگر کمتر از 100 میلیارد باشد، احتمالاً ثانیه است؛ در غیر این صورت میلی‌ثانیه
    const milliseconds = value < 100000000000 ? value * 1000 : value;
    const date = new Date(milliseconds);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return null;

    const normalized = normalizeDigits(raw);

    // فقط عدد: Unix timestamp
    if (/^\d+$/.test(normalized)) {
      return parseMembershipDate(Number(normalized));
    }

    // تاریخ شمسی: 1403/01/15 یا 1403-01-15
    const jalaliMatch = normalized.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (jalaliMatch) {
      const jy = Number(jalaliMatch[1]);
      const jm = Number(jalaliMatch[2]);
      const jd = Number(jalaliMatch[3]);

      if (jy && jm && jd) {
        try {
          const gregorian = toGregorian(jy, jm, jd);
          const date = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
          return Number.isNaN(date.getTime()) ? null : date;
        } catch {
          return null;
        }
      }
    }

    // تاریخ میلادی بدون ساعت: 2024-01-15
    const gregorianDateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (gregorianDateOnlyMatch) {
      const year = Number(gregorianDateOnlyMatch[1]);
      const month = Number(gregorianDateOnlyMatch[2]);
      const day = Number(gregorianDateOnlyMatch[3]);

      const date = new Date(year, month - 1, day);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    // اگر حاوی حروف فارسی/عربی است، احتمالاً متن خوانا است نه timestamp
    if (/[\u0600-\u06FF]/.test(normalized)) {
      return null;
    }

    // ISO یا تاریخ قابل parse توسط Date
    const isoCandidate = normalized.replace(' ', 'T');
    const date = new Date(isoCandidate);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

/**
 * محاسبه مدت زمان بین دو تاریخ به سال/ماه/روز
 */
const getCalendarDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  if (startDate > endDate) return null;

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPreviousMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return null;
  if (years === 0 && months === 0 && days <= 0) return null;

  return { years, months, days };
};

/**
 * تبدیل مدت زمان به متن فارسی مناسب عضویت
 */
const formatCalendarDurationForMembership = ({ years, months, days }) => {
  const parts = [];

  if (years > 0) {
    parts.push(`${toFaDigits(years)} سال`);
  }

  if (months > 0) {
    parts.push(`${toFaDigits(months)} ماه`);
  }

  // روز فقط وقتی سال نداشته باشیم نمایش داده می‌شود تا متن شلوغ نشود
  if (years === 0 && days > 0) {
    parts.push(`${toFaDigits(days)} روز`);
  }

  if (parts.length === 0) {
    if (days > 0) {
      parts.push(`${toFaDigits(days)} روز`);
    } else {
      return 'عضو جدید';
    }
  }

  // حداکثر دو واحد اصلی نمایش داده می‌شود
  return `${parts.slice(0, 2).join(' و ')} عضو`;
};

/**
 * تابع اصلی:
 * ورودی خام تاریخ/timestamp را به متن مدت عضویت تبدیل می‌کند.
 *
 * مثال:
 * formatMembershipSince('2024-01-15T10:23:45Z')
 * => '۲ سال و ... عضو'
 *
 * formatMembershipSince(1712345678)
 * => '...'
 *
 * formatMembershipSince('عضو جدید')
 * => 'عضو جدید'
 */
export const formatMembershipSince = (value, fallback = 'عضو جدید') => {
  const date = parseMembershipDate(value);

  if (!date) {
    // اگر مقدار از قبل متن فارسی خوانا بود، همان را نگه دار
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed && /[\u0600-\u06FF]/.test(trimmed)) {
        return trimmed;
      }
    }

    return fallback;
  }

  const duration = getCalendarDuration(date, new Date());

  if (!duration) {
    return fallback;
  }

  return formatCalendarDurationForMembership(duration);
};