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
    production: 'https://zibano.app',
    staging: 'https://staging.zibano.app',
  },
};

// لینک پیش‌فرض برای وب
export const DEFAULT_STORE_URL = 'https://zibano.app';

// نام استور پیش‌فرض
export const DEFAULT_STORE_NAME = 'زیبانو وب';

/**
* تبدیل "1.2.3" به عدد قابل مقایسه (10203)
*/
export const versionToNumber = (version) => {
  if (!version) return 0;
  const parts = String(version).split('.').map(Number);
  return (
    (parts[0] || 0) * 10000 +
    (parts[1] || 0) * 100 +
    (parts[2] || 0)
  );
};

/**
* مقایسه دو نسخه: -1 (a < b), 0 (a = b), 1 (a > b)
*/
export const compareVersions = (a, b) => {
  const numA = versionToNumber(a);
  const numB = versionToNumber(b);
  if (numA < numB) return -1;
  if (numA > numB) return 1;
  return 0;
};