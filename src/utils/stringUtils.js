// src/utils/stringUtils.js

/**
 * کوتاه کردن متن با افزودن "..."
 * @param {string} text - متن ورودی
 * @param {number} maxLength - حداکثر طول (پیش‌فرض: 300)
 * @returns {string}
 */
export const truncateText = (text, maxLength = 300) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * تبدیل اولین حرف به بزرگ (برای متن‌های انگلیسی)
 * @param {string} text
 * @returns {string}
 */
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * حذف فاصله‌های اضافی از ابتدا و انتهای متن
 * @param {string} text
 * @returns {string}
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * بررسی خالی بودن متن
 * @param {string} text
 * @returns {boolean}
 */
export const isEmpty = (text) => {
  return !text || text.trim().length === 0;
};

/**
 * تبدیل اعداد فارسی در متن به انگلیسی
 * @param {string} text
 * @returns {string}
 */
export const normalizeNumbers = (text) => {
  if (!text) return '';
  return text
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
};
