// src/utils/cancellation-utils.js
/**
 * ⏰ منطق لغو نوبت
 *
 * قوانین نهایی:
 * - زیر ۱۲ ساعت: امکان لغو وجود ندارد
 * - ۱۲ ساعت به بالا: لغو با استرداد کامل بیعانه (بدون جریمه)
 *
 * ✅ FIX COMP-02: اعتبارسنجی جامع ورودی‌ها برای جلوگیری از کرش و NaN
 */

import { toGregorian } from './dateUtils';
import { toPersianDigit, toEnglishDigits } from './numberUtils';

export const CANCELLATION_THRESHOLD_HOURS = 12;

// ═══════════════════════════════════════════════════════
//    ✅ COMP-02 FIX: توابع کمکی اعتبارسنجی
// ═══════════════════════════════════════════════════════

/**
 * بررسی معتبر بودن عدد
 */
const isValidNumber = (val) =>
  typeof val === 'number' && !isNaN(val) && isFinite(val);

/**
 * اعتبارسنجی آبجکت تاریخ جلالی
 * @param {*} dateObj - ورودی برای بررسی
 * @returns {{ valid: boolean, reason: string }}
 */
const validateDateObj = (dateObj) => {
  if (!dateObj || typeof dateObj !== 'object') {
    return {
      valid: false,
      reason: `dateObj باید یک آبجکت باشد. دریافت شد: ${typeof dateObj} (${dateObj})`,
    };
  }

  const { jy, jm, jd } = dateObj;

  if (!isValidNumber(jy)) {
    return { valid: false, reason: `dateObj.jy نامعتبر: ${jy}` };
  }
  if (!isValidNumber(jm) || jm < 1 || jm > 12) {
    return { valid: false, reason: `dateObj.jm باید بین ۱ تا ۱۲ باشد. دریافت شد: ${jm}` };
  }
  if (!isValidNumber(jd) || jd < 1 || jd > 31) {
    return { valid: false, reason: `dateObj.jd باید بین ۱ تا ۳۱ باشد. دریافت شد: ${jd}` };
  }

  return { valid: true, reason: '' };
};

/**
 * اعتبارسنجی و نرمال‌سازی timeSlot
 * @param {*} timeSlot - ورودی ساعت
 * @returns {{ valid: boolean, hours: number, minutes: number, reason: string }}
 */
const validateTimeSlot = (timeSlot) => {
  if (timeSlot === null || timeSlot === undefined) {
    return { valid: false, hours: 0, minutes: 0, reason: 'timeSlot خالی است' };
  }

  // تبدیل به رشته و سپس اعداد انگلیسی
  const timeStr = toEnglishDigits(String(timeSlot)).trim();

  if (!timeStr) {
    return { valid: false, hours: 0, minutes: 0, reason: 'timeSlot پس از تبدیل خالی است' };
  }

  // پشتیبانی از فرمت‌های مختلف: "14:30"، "14؛30"، "1430"
  const parts = timeStr.split(/\D+/).filter(Boolean);

  let hours, minutes;

  if (parts.length >= 2) {
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
  } else if (parts.length === 1) {
    const digits = parts[0];
    if (digits.length === 4) {
      hours = parseInt(digits.slice(0, 2), 10);
      minutes = parseInt(digits.slice(2), 10);
    } else if (digits.length === 3) {
      hours = parseInt(digits[0], 10);
      minutes = parseInt(digits.slice(1), 10);
    } else {
      return {
        valid: false,
        hours: 0,
        minutes: 0,
        reason: `فرمت timeSlot قابل تشخیص نیست: "${timeSlot}"`,
      };
    }
  } else {
    return {
      valid: false,
      hours: 0,
      minutes: 0,
      reason: `timeSlot عددی ندارد: "${timeSlot}"`,
    };
  }

  if (isNaN(hours) || hours < 0 || hours > 23) {
    return {
      valid: false,
      hours: 0,
      minutes: 0,
      reason: `ساعت نامعتبر: ${hours} (باید ۰ تا ۲۳ باشد)`,
    };
  }
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return {
      valid: false,
      hours: 0,
      minutes: 0,
      reason: `دقیقه نامعتبر: ${minutes} (باید ۰ تا ۵۹ باشد)`,
    };
  }

  return { valid: true, hours, minutes, reason: '' };
};

/**
 * محاسبه ساعات باقی‌مانده تا نوبت
 * ✅ COMP-02 FIX: اعتبارسنجی جامع ورودی‌ها
 *
 * @param {{ jy: number, jm: number, jd: number }} dateObj - آبجکت تاریخ جلالی
 * @param {string} timeSlot - ساعت نوبت (مثلاً "14:30")
 * @returns {number} تعداد ساعات باقی‌مانده (Infinity در صورت ورودی نامعتبر)
 */
export const getHoursUntilAppointment = (dateObj, timeSlot) => {
  // ─── بررسی اولیه وجود ورودی ───
  if (!dateObj || !timeSlot) return Infinity;

  // ─── ✅ COMP-02 FIX: اعتبارسنجی شکل dateObj ───
  const dateValidation = validateDateObj(dateObj);
  if (!dateValidation.valid) {
    console.warn(`[getHoursUntilAppointment] ${dateValidation.reason}`);
    return Infinity;
  }

  // ─── ✅ COMP-02 FIX: اعتبارسنجی و استخراج timeSlot ───
  const timeValidation = validateTimeSlot(timeSlot);
  if (!timeValidation.valid) {
    console.warn(`[getHoursUntilAppointment] ${timeValidation.reason}`);
    return Infinity;
  }

  // ─── تبدیل تاریخ جلالی به میلادی ───
  let g;
  try {
    g = toGregorian(dateObj.jy, dateObj.jm, dateObj.jd);
  } catch (err) {
    console.warn(`[getHoursUntilAppointment] خطا در تبدیل تاریخ: ${err.message}`);
    return Infinity;
  }

  if (!g || !isValidNumber(g.year) || !isValidNumber(g.month) || !isValidNumber(g.day)) {
    console.warn('[getHoursUntilAppointment] نتیجه toGregorian نامعتبر بود');
    return Infinity;
  }

  // ─── ساخت Date نوبت ───
  const appointmentDate = new Date(
    g.year,
    g.month - 1,
    g.day,
    timeValidation.hours,
    timeValidation.minutes,
    0
  );

  // بررسی اعتبار Date ساخته‌شده
  if (isNaN(appointmentDate.getTime())) {
    console.warn('[getHoursUntilAppointment] Date ساخته‌شده نامعتبر بود');
    return Infinity;
  }

  const now = new Date();
  const diffMs = appointmentDate.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
};

/**
 * آیا امکان لغو نوبت وجود دارد؟
 * ✅ COMP-02 FIX: استفاده از getHoursUntilAppointment با محافظت
 */
export const canCancelAppointment = (dateObj, timeSlot) => {
  const hoursLeft = getHoursUntilAppointment(dateObj, timeSlot);
  // اگر Infinity باشد (ورودی نامعتبر)، لغو مجاز نیست
  if (!isValidNumber(hoursLeft)) return false;
  return hoursLeft >= CANCELLATION_THRESHOLD_HOURS;
};

/**
 * دریافت سیاست لغو نوبت
 * ✅ COMP-02 FIX: مدیریت ورودی‌های نامعتبر
 */
export const getCancellationPolicy = (dateObj, timeSlot) => {
  const hoursLeft = getHoursUntilAppointment(dateObj, timeSlot);

  // ─── ✅ COMP-02 FIX: ورودی نامعتبر ───
  if (!isValidNumber(hoursLeft)) {
    return {
      canCancel: false,
      hoursLeft: 0,
      message: 'اطلاعات نوبت ناقص یا نامعتبر است',
      penaltyPercent: 0,
      refundPercent: 0,
      invalidInput: true,
    };
  }

  if (hoursLeft < CANCELLATION_THRESHOLD_HOURS) {
    return {
      canCancel: false,
      hoursLeft: Math.max(0, hoursLeft),
      message: `امکان لغو نوبت وجود ندارد (کمتر از ${CANCELLATION_THRESHOLD_HOURS} ساعت مانده)`,
      penaltyPercent: 0,
      refundPercent: 0,
      invalidInput: false,
    };
  }

  return {
    canCancel: true,
    hoursLeft,
    message: 'لغو با استرداد کامل بیعانه',
    penaltyPercent: 0,
    refundPercent: 100,
    invalidInput: false,
  };
};

/**
 * فرمت ساعات باقی‌مانده برای نمایش
 * @param {number} hoursLeft
 * @returns {string}
 */
export const formatHoursLeft = (hoursLeft) => {
  // ✅ COMP-02 FIX: محافظت در برابر NaN و Infinity
  if (!isValidNumber(hoursLeft)) return 'نامشخص';

  if (hoursLeft < 0) return 'گذشته';
  if (hoursLeft < 1) return 'کمتر از ۱ ساعت';

  if (hoursLeft < 24) {
    const h = Math.floor(hoursLeft);
    const m = Math.round((hoursLeft - h) * 60);
    if (m > 0) {
      return `${toPersianDigit(h)} ساعت و ${toPersianDigit(m)} دقیقه`;
    }
    return `${toPersianDigit(h)} ساعت`;
  }

  const days = Math.floor(hoursLeft / 24);
  const remainingHours = Math.floor(hoursLeft % 24);
  if (remainingHours > 0) {
    return `${toPersianDigit(days)} روز و ${toPersianDigit(remainingHours)} ساعت`;
  }
  return `${toPersianDigit(days)} روز`;
};