// src/utils/price-utils.js
/**
 * 💰 محاسبات قیمت و کمیسیون — منبع اصلی (Single Source of Truth)
 *
 * ⚠️ FIX P1: این فایل تنها منبع توابع کمیسیون است.
 *    numberUtils.js فقط re-export می‌کند.
 *
 * قوانین کمیسیون (نسخه نهایی):
 * - زیر ۲۵۰ هزار تومان: ۷ هزار تومان ثابت
 * - از ۲۵۰ هزار تا ۵۰۰ هزار تومان: ۳ درصد ✅
 * - از ۵۰۰ هزار تومان به بالا: ۴ درصد ✅
 * - سقف کمیسیون: ۵۰ هزار تومان
 */

/**
 * سقف کمیسیون
 */
export const MAX_APP_FEE = 50000;

/**
 * حداقل قیمت نهایی خدمت
 */
export const MIN_FINAL_PRICE = 50000;

/**
 * حداقل مبلغ بیعانه
 */
export const MIN_DEPOSIT = 50000;

/**
 * محاسبه کمیسیون اپلیکیشن بر اساس قیمت اصلی خدمت
 * @param {number} basePrice - قیمت پایه خدمت (تومان)
 * @returns {number} - مبلغ کمیسیون (تومان)
 */
export const calculateAppFee = (basePrice) => {
  if (!basePrice || basePrice <= 0) return 0;

  let fee = 0;

  if (basePrice < 250000) {
    fee = 7000;
  } else if (basePrice <= 500000) {
    // ✅ ۳ درصد
    fee = Math.round(basePrice * 0.03);
  } else {
    // ✅ ۴ درصد
    fee = Math.round(basePrice * 0.04);
  }

  return Math.min(fee, MAX_APP_FEE);
};

/**
 * لیست بازه‌های کمیسیون برای نمایش در مدال راهنما
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
    fee: 3,
    type: 'percent',
    label: 'درصدی',
    description: '۳٪ از مبلغ خدمت',
  },
  {
    min: 500000,
    max: Infinity,
    fee: 4,
    type: 'percent',
    label: 'درصدی',
    description: '۴٪ از مبلغ خدمت',
  },
];

/**
 * پیدا کردن ردیف فعلی کمیسیون برای هایلایت کردن
 * @param {number} basePrice
 * @returns {object}
 */
export const getCurrentFeeTier = (basePrice) => {
  if (!basePrice || basePrice <= 0) return APP_FEE_TIERS[0];

  const tier = APP_FEE_TIERS.find((t) => basePrice > t.min && basePrice <= t.max);
  if (tier) return tier;

  if (basePrice <= APP_FEE_TIERS[0].max) return APP_FEE_TIERS[0];

  return APP_FEE_TIERS[APP_FEE_TIERS.length - 1];
};

/**
 * محاسبه قیمت نهایی با تخفیف
 * @param {number} originalPrice - قیمت اصلی
 * @param {number} discountPercent - درصد تخفیف
 * @returns {number}
 */
export const calculateFinalPrice = (originalPrice, discountPercent = 0) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = Math.round((originalPrice * discountPercent) / 100);
  return Math.max(0, originalPrice - discount);
};

/**
 * محاسبه مبلغ تخفیف
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @returns {number}
 */
export const calculateDiscountAmount = (originalPrice, discountPercent = 0) => {
  if (!originalPrice || !discountPercent) return 0;
  return Math.round((originalPrice * discountPercent) / 100);
};

/**
 * محاسبه بیعانه بر اساس قوانین
 * @param {number} finalPrice - قیمت نهایی خدمت
 * @param {boolean} hasDeposit - آیا بیعانه دارد؟
 * @param {number} depositPercent - درصد بیعانه (پیش‌فرض ۳۰٪)
 * @returns {number}
 */
export const calculateDeposit = (finalPrice, hasDeposit = false, depositPercent = 30) => {
  if (!hasDeposit || !finalPrice) return 0;
  const deposit = Math.round((finalPrice * depositPercent) / 100);
  return Math.max(deposit, MIN_DEPOSIT);
};

/**
 * محاسبه مبلغ باقی‌مانده (پرداخت در سالن)
 * @param {number} finalPrice
 * @param {number} depositAmount
 * @returns {number}
 */
export const calculateRemaining = (finalPrice, depositAmount = 0) => {
  return Math.max(0, finalPrice - depositAmount);
};

/**
 * محاسبه سهم کسب‌وکار پس از کسر کمیسیون
 * @param {number} finalPrice - قیمت نهایی خدمت
 * @returns {number}
 */
export const calculateBusinessShare = (finalPrice) => {
  const fee = calculateAppFee(finalPrice);
  return Math.max(0, finalPrice - fee);
};

/**
 * ساخت خلاصه قیمت برای نمایش
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @param {boolean} hasDeposit
 * @param {number} depositPercent
 * @returns {object}
 */
export const buildPriceSummary = (
  originalPrice,
  discountPercent = 0,
  hasDeposit = false,
  depositPercent = 30
) => {
  const discountAmount = calculateDiscountAmount(originalPrice, discountPercent);
  const finalPrice = calculateFinalPrice(originalPrice, discountPercent);
  const appFee = calculateAppFee(finalPrice);
  const depositAmount = calculateDeposit(finalPrice, hasDeposit, depositPercent);
  const remaining = calculateRemaining(finalPrice, depositAmount);
  const businessShare = calculateBusinessShare(finalPrice);

  return {
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    appFee,
    hasDeposit,
    depositPercent,
    depositAmount,
    remaining,
    businessShare,
  };
};
