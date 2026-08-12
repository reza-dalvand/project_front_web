// src/api/config.js
/**
 * ⚙️ پیکربندی لایه API
 *
 * ⚠️ نکته مهم:
 * فعلاً USE_MOCK = true است و هیچ درخواست واقعی به بک‌اند نمی‌رود.
 * هنگام اتصال به بک‌اند، فقط همین یک خط را به false تغییر دهید.
 */
import env from '@/config/env';

// ═══════════════════════════════════════════════
//    سوئیچ اصلی: Mock یا Real API
// ═══════════════════════════════════════════════
export const USE_MOCK = true; // ← بعداً: false

// ═══════════════════════════════════════════════
//    تنظیمات Axios
// ═══════════════════════════════════════════════
export const API_CONFIG = {
  baseURL: env.API_BASE_URL,
  timeout: 15000, // 15 ثانیه
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// ═══════════════════════════════════════════════
//    تنظیمات JWT (هماهنگ با بک‌اند)
// ═══════════════════════════════════════════════
export const JWT_CONFIG = {
  ACCESS_TOKEN_KEY: 'zibano_access_token',
  REFRESH_TOKEN_KEY: 'zibano_refresh_token',
  TOKEN_TYPE: 'Bearer',
  // بک‌اند: ACCESS_TOKEN_LIFETIME = 1 ساعت
  ACCESS_TOKEN_LIFETIME_SECONDS: 3600,
  // بک‌اند: REFRESH_TOKEN_LIFETIME = 30 روز
  REFRESH_TOKEN_LIFETIME_DAYS: 30,
};

// ═══════════════════════════════════════════════
//    تنظیمات Pagination (هماهنگ با بک‌اند)
// ═══════════════════════════════════════════════
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// ═══════════════════════════════════════════════
//    تنظیمات OTP (هماهنگ با بک‌اند)
// ═══════════════════════════════════════════════
export const OTP_CONFIG = {
  CODE_LENGTH: 5,
  EXPIRY_SECONDS: 300, // 5 دقیقه
  RESEND_COOLDOWN_SECONDS: 60, // 60 ثانیه
};

// ═══════════════════════════════════════════════
//    تنظیمات آپلود فایل
// ═══════════════════════════════════════════════
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};
