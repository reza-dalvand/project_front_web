// src/utils/image-utils.js
/**
 * 🖼️ مدیریت تصاویر
 *
 * در production تصاویر از Arvan Storage لود می‌شوند
 * در development از مسیر نسبی
 */
import env from '@/config/env';
import { UPLOAD_CONFIG } from '@/api/config';

/**
 * ساخت URL کامل تصویر
 * @param {string} path - مسیر تصویر از بک‌اند
 * @returns {string} - URL کامل
 */
export const getImageUrl = (path) => {
  if (!path) return null;

  // اگر از قبل URL کامل است، همان را برگردان
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // اگر Arvan CDN تنظیم شده
  if (env.ARVAN_CDN_URL) {
    return `${env.ARVAN_CDN_URL}/${path}`;
  }

  // در development از API_BASE_URL بخوان
  return `${env.API_BASE_URL.replace('/api/v1', '')}${path}`;
};

/**
 * ساخت URL کامل تصویر از مسیر نسبی (مناسب پورتفولیو و گالری)
 *
 * تفاوت با getImageUrl:
 * - اگه مسیر خالی باشه → null
 * - اگه از قبل URL کامل باشه → همون رو برمی‌گردونه
 * - اگه مسیر نسبی باشه → با CDN یا MEDIA_BASE_URL ترکیب می‌کنه
 *
 * @param {string} path - مسیر نسبی تصویر از بک‌اند
 * @returns {string|null} - URL کامل یا null
 */
export const getFullImageUrl = (path) => {
  if (!path) return null;

  // اگه از قبل URL کامل است
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // اگه Arvan CDN تنظیم شده
  if (env.ARVAN_CDN_URL) {
    return `${env.ARVAN_CDN_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  // در غیر این صورت از MEDIA_BASE_URL
  if (env.MEDIA_BASE_URL) {
    return `${env.MEDIA_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  return path;
};

/**
 * ساخت URL برای آپلود (آواتار، تصاویر کسب‌وکار و...)
 * @param {string} path
 * @returns {string}
 */
export const getUploadUrl = (path) => {
  if (!path) return null;
  return getImageUrl(path);
};

/**
 * ساخت URL برای آواتار کاربر
 * @param {string} avatarPath
 * @returns {string}
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  return getImageUrl(avatarPath);
};

/**
 * ساخت URL برای لوگوی کسب‌وکار
 * @param {string} logoPath
 * @returns {string}
 */
export const getBusinessLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  return getImageUrl(logoPath);
};

/**
 * ساخت URL برای کاور کسب‌وکار
 * @param {string} coverPath
 * @returns {string}
 */
export const getBusinessCoverUrl = (coverPath) => {
  if (!coverPath) return null;
  return getImageUrl(coverPath);
};

/**
 * ساخت URL برای تصاویر گالری
 * @param {string} imagePath
 * @returns {string}
 */
export const getGalleryImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return getImageUrl(imagePath);
};

/**
 * ساخت URL برای تصاویر نمونه‌کار
 * @param {string} imagePath
 * @returns {string}
 */
export const getPortfolioImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return getImageUrl(imagePath);
};

/**
 * ساخت URL برای تصاویر پست ویترین
 * @param {string} imagePath
 * @returns {string}
 */
export const getPostImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return getImageUrl(imagePath);
};

/**
 * اعتبارسنجی فایل تصویر
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file, maxSizeMB = null) => {
  const limit = maxSizeMB ?? UPLOAD_CONFIG.MAX_FILE_SIZE_MB;

  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده است' };
  }
  if (!UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'فرمت فایل مجاز نیست (JPEG, PNG, WebP)' };
  }
  if (file.size > limit * 1024 * 1024) {
    return {
      valid: false,
      error: `حجم فایل نباید بیشتر از ${limit} مگابایت باشد`,
    };
  }
  return { valid: true };
};

/**
 * ساخت URL موقت برای پیش‌نمایش تصویر
 * @param {File} file
 * @returns {string}
 */
export const createPreviewUrl = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * آزادسازی URL موقت
 * @param {string} url
 */
export const revokePreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
