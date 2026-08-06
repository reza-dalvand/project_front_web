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
//    محاسبه کارمزد اپلیکیشن
// ═══════════════════════════════════════════════════════

/**
 * محاسبه کارمزد اپلیکیشن بر اساس قیمت اصلی خدمت
 *
 * @param {number} basePrice - قیمت پایه خدمت (تومان)
 * @returns {number} - مبلغ کارمزد (تومان)
 */
export const calculateAppFee = (basePrice) => {
  if (!basePrice || basePrice <= 0) return 10000;
  if (basePrice <= 500000) return 10000;
  if (basePrice <= 1000000) return 20000;
  if (basePrice <= 1500000) return 30000;
  // هر ۵۰۰ هزار تومان ۱۰ هزار تومان اضافه می‌شود
  const extra = Math.ceil((basePrice - 1500000) / 500000) * 10000;
  return 30000 + extra;
};

/**
 * 🆕 لیست بازه‌های کارمزد برای نمایش در مدال راهنما
 */
export const APP_FEE_TIERS = [
  { min: 100000, max: 500000, fee: 10000 },
  { min: 500000, max: 1000000, fee: 20000 },
  { min: 1000000, max: 1500000, fee: 30000 },
];

/**
 * پیدا کردن ردیف فعلی کارمزد برای هایلایت کردن
 */
export const getCurrentFeeTier = (basePrice) => {
  if (!basePrice || basePrice <= 0) return APP_FEE_TIERS[0];
  // پیدا کردن ردیف مناسب
  const tier = APP_FEE_TIERS.find((t) => basePrice >= t.min && basePrice <= t.max);
  if (tier) return tier;
  // اگر بالاتر از جدول باشد، آخرین ردیف
  if (basePrice > 1500000) return APP_FEE_TIERS[APP_FEE_TIERS.length - 1];
  return APP_FEE_TIERS[0];
};
