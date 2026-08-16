// src/utils/numberUtils.js
/**
 * 🔢 ابزارهای فرمت اعداد فارسی
 *
 * ⚠️ FIX P1: توابع calculateAppFee، APP_FEE_TIERS، MAX_APP_FEE
 *    و getCurrentFeeTier از این فایل حذف شدند.
 *    منبع اصلی: '@/utils/price-utils'
 */

// تبدیل اعداد انگلیسی به فارسی
export const toPersianDigit = (str) => String(str ?? '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// تبدیل اعداد فارسی/عربی به انگلیسی
export const toEnglishDigits = (str) =>
  String(str ?? '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

// استخراج عدد از رشته
export const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

// فرمت قیمت با تومان
export const formatPrice = (num) => `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

// فرمت کوتاه قیمت (K و M)
export const formatPriceShort = (num) => {
  if (num >= 1000000) return `${toPersianDigit((num / 1000000).toFixed(1))}M`;
  if (num >= 1000) return `${toPersianDigit((num / 1000).toFixed(0))}K`;
  return toPersianDigit(num);
};

// فرمت ورودی قیمت (با جداکننده هزارگان)
export const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(parseInt(cleaned, 10).toLocaleString('en-US'));
};

// فرمت ورودی درصد (حداکثر ۱۰۰)
export const formatPercentInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(String(Math.min(parseInt(cleaned, 10), 100)));
};

// ═══════════════════════════════════════════════════════
//    ⚠️ DEPRECATED — فقط برای سازگاری موقت
//    این export‌ها صرفاً re-export از price-utils هستند
//    تا فایل‌هایی که هنوز import قدیمی دارند نشکنند.
//    در مرحله بعدی import آن فایل‌ها تغییر می‌کند و
//    این بخش حذف می‌شود.
// ═══════════════════════════════════════════════════════
export { calculateAppFee, APP_FEE_TIERS, MAX_APP_FEE, getCurrentFeeTier } from './price-utils';
