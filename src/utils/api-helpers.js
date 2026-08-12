// src/utils/api-helpers.js
/**
 * 🔧 توابع کمکی برای کار با API
 */

/**
 * ساخت query string از آبجکت پارامترها
 * @param {object} params
 * @returns {string}
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';

  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return query ? `?${query}` : '';
};

/**
 * ساخت URL کامل endpoint
 * @param {string} endpoint - مسیر endpoint (مثلاً '/businesses/public/')
 * @param {object} params - پارامترهای query
 * @returns {string}
 */
export const buildApiUrl = (endpoint, params = {}) => {
  const queryString = buildQueryString(params);
  return `${endpoint}${queryString}`;
};

/**
 * استخراج خطا از response بک‌اند
 * @param {object} error - خطای ApiError
 * @returns {{ message: string, code: string, details: object }}
 */
export const extractApiError = (error) => {
  if (!error) {
    return {
      message: 'خطای ناشناخته',
      code: 'UNKNOWN_ERROR',
      details: {},
    };
  }

  if (error.isApiError) {
    return {
      message: error.message || 'خطا در انجام عملیات',
      code: error.code || 'ERROR',
      details: error.details || {},
    };
  }

  if (error.message) {
    return {
      message: error.message,
      code: 'ERROR',
      details: {},
    };
  }

  return {
    message: 'خطای ناشناخته',
    code: 'UNKNOWN_ERROR',
    details: {},
  };
};

/**
 * آیا خطای اعتبارسنجی است؟
 * @param {object} error
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  if (!error) return false;
  return error.code === 'VALIDATION_ERROR' || error.code === 'BAD_REQUEST';
};

/**
 * آیا خطای احراز هویت است؟
 * @param {object} error
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  if (!error) return false;
  return error.code === 'UNAUTHORIZED' || error.code === 'TOKEN_EXPIRED';
};

/**
 * آیا خطای دسترسی است؟
 * @param {object} error
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  if (!error) return false;
  return error.code === 'FORBIDDEN' || error.code === 'PERMISSION_DENIED';
};

/**
 * آیا خطای شبکه است؟
 * @param {object} error
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  if (!error) return false;
  return error.code === 'NETWORK_ERROR' || error.code === 'OFFLINE';
};

/**
 * ساخت پیام خطای کاربرپسند
 * @param {object} error
 * @returns {string}
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (!error) return 'خطای ناشناخته‌ای رخ داد';

  if (isNetworkError(error)) {
    return 'خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید';
  }

  if (isAuthError(error)) {
    return 'لطفاً وارد حساب کاربری خود شوید';
  }

  if (isPermissionError(error)) {
    return 'شما دسترسی لازم برای این عملیات را ندارید';
  }

  if (isValidationError(error)) {
    return error.message || 'داده‌های ورودی معتبر نیست';
  }

  return error.message || 'خطا در انجام عملیات';
};

/**
 * ساخت payload برای آپلود فایل
 * @param {File} file
 * @param {string} fieldName - نام فیلد در FormData
 * @returns {FormData}
 */
export const buildUploadPayload = (file, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
};

/**
 * ساخت payload برای آپلود چند فایل
 * @param {File[]} files
 * @param {string} fieldName - نام فیلد در FormData
 * @returns {FormData}
 */
export const buildMultiUploadPayload = (files, fieldName = 'files') => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  return formData;
};
