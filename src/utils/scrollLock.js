// src/utils/scrollLock.js
/**
 * مدیریت مرکزی قفل اسکرول (Scroll Lock Manager)
 * مشکل: وقتی چند مدال همزمان باز هستند، بستن یکی باعث آزاد شدن اسکرول می‌شود
 * راه‌حل: سیستم Stack-based - اسکرول فقط وقتی آزاد می‌شود که هیچ مدالی باز نباشد
 */

let lockStack = [];

/**
 * قفل کردن اسکرول برای یک کامپوننت خاص
 * @param {string} id - شناسه یکتای کامپوننت
 */
export const acquireScrollLock = (id) => {
  if (typeof window === 'undefined') return;
  if (!lockStack.includes(id)) {
    lockStack.push(id);
  }
  document.body.style.overflow = 'hidden';
};

/**
 * آزاد کردن قفل اسکرول برای یک کامپوننت خاص
 * @param {string} id - شناسه یکتای کامپوننت
 */
export const releaseScrollLock = (id) => {
  if (typeof window === 'undefined') return;
  lockStack = lockStack.filter((lockId) => lockId !== id);
  if (lockStack.length === 0) {
    document.body.style.overflow = '';
  }
};

/**
 * دریافت تعداد قفل‌های فعال (برای دیباگ)
 */
export const getActiveLockCount = () => lockStack.length;