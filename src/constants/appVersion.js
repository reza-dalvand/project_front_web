// src/constants/appVersion.js
/**
 * 📦 اطلاعات نسخه اپلیکیشن (نسخه وب)
 */

// نسخه فعلی اپلیکیشن
export const APP_VERSION = '1.0.0';

// شماره نسخه عددی
export const APP_BUILD_NUMBER = 1;

// لینک‌های مربوط به نسخه وب
export const STORE_URLS = {
  web: {
    production: 'https://beauclub.ir',
    staging: 'https://staging.beauclub.ir',
    develop: 'https://develop.beauclub.ir',
  },
};

// لینک پیش‌فرض برای وب
export const DEFAULT_STORE_URL = 'https://beauclub.ir';

// نام استور پیش‌فرض
export const DEFAULT_STORE_NAME = 'بیو کلاب وب';

/**
 * ✅ مقایسه دو نسخه به‌صورت بخش‌به‌بخش
 * بدون محدودیت اندازه — برای هر نسخه‌ای درست کار می‌کند.
 *
 * @param {string} a - نسخه اول (مثلاً "1.0.0")
 * @param {string} b - نسخه دوم (مثلاً "1.1.0")
 * @returns {number} -1 (a < b), 0 (a = b), 1 (a > b)
 */
export const compareVersions = (a, b) => {
  if (!a || !b) return 0;
  
  const partsA = String(a).split('.').map(Number);
  const partsB = String(b).split('.').map(Number);
  const len = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < len; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
};