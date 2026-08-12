// src/utils/image-utils.js
/**
 * 🖼️ مدیریت تصاویر
 *
 * در production تصاویر از Arvan Storage لود می‌شوند
 * در development از مسیر نسبی
 */
import env from '@/config/env';

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
export const validateImageFile = (file) => {
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده است' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'فرمت فایل مجاز نیست (JPEG, PNG, WebP)' };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `حجم فایل نباید بیشتر از ${MAX_FILE_SIZE_MB} مگابایت باشد` };
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
