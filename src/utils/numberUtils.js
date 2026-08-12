// src/utils/numberUtils.js

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
//    محاسبه کارمزد اپلیکیشن (کمیسیون) - ✅ اصلاح شده
// ═══════════════════════════════════════════════════════
/**
 * محاسبه کمیسیون اپلیکیشن بر اساس قیمت اصلی خدمت
 * این مبلغ از قیمت کل کسر می‌شود (نه اضافه)
 *
 * قوانین (نسخه نهایی — هماهنگ با تست‌ها):
 * - زیر ۲۵۰ هزار تومان: ۷ هزار تومان ثابت
 * - از ۲۵۰ هزار تا ۵۰۰ هزار تومان: ۴ درصد
 * - از ۵۰۰ هزار تومان به بالا: ۵ درصد
 * - سقف کمیسیون: ۵۰ هزار تومان
 *
 * @param {number} basePrice - قیمت پایه خدمت (تومان)
 * @returns {number} - مبلغ کمیسیون (تومان)
 */
export const calculateAppFee = (basePrice) => {
  if (!basePrice || basePrice <= 0) return 0;

  let fee = 0;

  if (basePrice < 250000) {
    // زیر ۲۵۰ هزار تومان: ۷ هزار تومان ثابت
    fee = 7000;
  } else if (basePrice <= 500000) {
    // ✅ اصلاح: از ۲۵۰ تا ۵۰۰ هزار: ۴ درصد
    fee = Math.round(basePrice * 0.04);
  } else {
    // ✅ اصلاح: از ۵۰۰ هزار به بالا: ۵ درصد
    fee = Math.round(basePrice * 0.05);
  }

  // سقف کمیسیون: ۵۰ هزار تومان
  return Math.min(fee, 50000);
};

/**
 * 🆕 لیست بازه‌های کمیسیون برای نمایش در مدال راهنما
 * ✅ اصلاح: درصدها هماهنگ با تست‌ها
 */
export const APP_FEE_TIERS = [
  {
    min: 0,
    max: 250000,
    fee: 7000,
    type: 'fixed',
    label: 'ثابت',
    description: '۷ هزار تومان',
  },
  {
    min: 250000,
    max: 500000,
    fee: 4, // ✅ اصلاح: ۴٪
    type: 'percent',
    label: 'درصدی',
    description: '۴٪ از مبلغ خدمت',
  },
  {
    min: 500000,
    max: Infinity,
    fee: 5, // ✅ اصلاح: ۵٪
    type: 'percent',
    label: 'درصدی',
    description: '۵٪ از مبلغ خدمت',
  },
];

/**
 * سقف کمیسیون
 */
export const MAX_APP_FEE = 50000;

/**
 * پیدا کردن ردیف فعلی کمیسیون برای هایلایت کردن
 */
export const getCurrentFeeTier = (basePrice) => {
  if (!basePrice || basePrice <= 0) return APP_FEE_TIERS[0];

  const tier = APP_FEE_TIERS.find((t) => basePrice > t.min && basePrice <= t.max);
  if (tier) return tier;

  if (basePrice <= APP_FEE_TIERS[0].max) return APP_FEE_TIERS[0];
  return APP_FEE_TIERS[APP_FEE_TIERS.length - 1];
};
