// src/api/config.js

import env from '@/config/env';

// ═══════════════════════════════════════════════
//    تنظیمات Axios
// ═══════════════════════════════════════════════
export const API_CONFIG = {
  baseURL: env.API_BASE_URL, // http://localhost:8000/api/v1
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// ═══════════════════════════════════════════════
//    تنظیمات JWT (هماهنگ با بک‌اند)
// ═══════════════════════════════════════════════
export const JWT_CONFIG = {
  ACCESS_TOKEN_KEY: 'beau_access_token',
  REFRESH_TOKEN_KEY: 'beau_refresh_token',
  TOKEN_TYPE: 'Bearer',
  ACCESS_TOKEN_LIFETIME_SECONDS: 3600, // ۱ ساعت
  REFRESH_TOKEN_LIFETIME_DAYS: 30, // ۳۰ روز
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
  EXPIRY_SECONDS: 300,
  RESEND_COOLDOWN_SECONDS: 120,
};

// ═══════════════════════════════════════════════
//    تنظیمات آپلود فایل
// ═══════════════════════════════════════════════
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 5, // سقف نهایی بعد از فشرده‌سازی
  MAX_INPUT_SIZE_MB: 20, // ✅ جدید: سقف فایل خام ورودی کاربر
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// ═══════════════════════════════════════════════
//    تنظیمات Media (برای ساخت URL تصاویر)
// ═══════════════════════════════════════════════
export const MEDIA_CONFIG = {
  MEDIA_BASE_URL: env.MEDIA_BASE_URL || env.API_BASE_URL?.replace('/api/v1', '') || '',
  CDN_URL: env.ARVAN_CDN_URL || '',
};
