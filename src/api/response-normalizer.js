// src/api/response-normalizer.js
/**
 * 🔄 نرمال‌ساز Response بک‌اند → فرانت
 *
 * مسئولیت‌ها:
 *   ۱. تبدیل snake_case → camelCase (fieldMapper)
 *   ۲. نرمال‌سازی ساختار Pagination بک‌اند
 *   ۳. ساخت URL کامل برای تصاویر
 *   ۴. مدیریت خطاها
 *
 * فرمت موفق بک‌اند:
 *   { success: true, data: {...}, message: '...', meta: {...} }
 *
 * فرمت Paginated بک‌اند:
 *   { success: true, pagination: {...}, results: [...] }
 *
 * فرمت خطا بک‌اند:
 *   { success: false, error: { code, message, details } }
 */
import { MEDIA_CONFIG } from './config';

// ═══════════════════════════════════════════════
//    ۱. Field Mapper: snake_case → camelCase
// ═══════════════════════════════════════════════

/**
 * تبدیل یک کلید snake_case به camelCase
 * @param {string} key
 * @returns {string}
 * @example 'first_name' → 'firstName'
 * @example 'is_national_id_verified' → 'isNationalIdVerified'
 * @example 'date_key' → 'dateKey'
 */
const snakeToCamel = (key) => {
  if (!key || typeof key !== 'string') return key;
  return key.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
};

/**
 * فیلدهایی که نباید مقدارشان تغییر کند (فقط کلید تبدیل می‌شود)
 * مثلاً date_key مقدارش "1405/04/22" است و نباید دست بخورد
 */
const VALUE_PRESERVE_KEYS = new Set([
  'dateKey',
  'timeSlot',
  'bookingSlug',
  'phone',
  'trackingCode',
  'refNumber',
  'sheba',
  'cardNumber',
  'nationalId',
  'verificationCode',
  'contactPhone',
  'createdJalali',
  'expiresJalali',
  'lastServiceDate',
  'dueDate',
  'sentDate',
]);

/**
 * فیلدهایی که حاوی URL تصویر هستند و باید کامل شوند
 */
const IMAGE_FIELDS = new Set([
  'avatar',
  'logo',
  'coverImage',
  'ownerPhoto',
  'image',
  'imageUrl',
  'serviceImage',
  'lineImage',
  'firstImage',
  'businessLogo',
]);

/**
 * ساخت URL کامل تصویر از مسیر نسبی
 * @param {string} path - مسیر نسبی مثل /media/avatars/2024/01/photo.jpg
 * @returns {string} - URL کامل
 */
const resolveImageUrl = (path) => {
  if (!path) return null;
  // اگر از قبل URL کامل است
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // اگر CDN تنظیم شده
  if (MEDIA_CONFIG.CDN_URL) {
    return `${MEDIA_CONFIG.CDN_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }
  // در غیر این صورت از MEDIA_BASE_URL
  if (MEDIA_CONFIG.MEDIA_BASE_URL) {
    return `${MEDIA_CONFIG.MEDIA_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }
  return path;
};

/**
 * 🎯 تابع اصلی: تبدیل بازگشتی snake_case → camelCase
 * + ساخت URL تصاویر
 *
 * @param {any} data - داده ورودی (object, array, primitive)
 * @returns {any} - داده تبدیل‌شده
 */
export const mapFields = (data) => {
  // null / undefined / primitive
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  // آرایه
  if (Array.isArray(data)) {
    return data.map((item) => mapFields(item));
  }

  // آبجکت
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    const camelKey = snakeToCamel(key);

    // اگر فیلد تصویری است → URL کامل بساز
    if (IMAGE_FIELDS.has(camelKey) && typeof value === 'string') {
      result[camelKey] = resolveImageUrl(value);
    }
    // اگر فیلد مقدار خاص دارد → فقط کلید تبدیل شود
    else if (VALUE_PRESERVE_KEYS.has(camelKey)) {
      result[camelKey] = value;
    }
    // در غیر این صورت → بازگشتی
    else {
      result[camelKey] = mapFields(value);
    }
  }
  return result;
};

// ═══════════════════════════════════════════════
//    ۲. نرمال‌سازی Pagination
// ═══════════════════════════════════════════════

/**
 * تشخیص اینکه response یک لیست paginated است یا نه
 * بک‌اند برای لیست‌ها برمی‌گرداند:
 *   { success: true, pagination: {...}, results: [...] }
 *
 * @param {object} responseData - بدنه response
 * @returns {boolean}
 */
const isPaginatedResponse = (responseData) => {
  return (
    responseData &&
    typeof responseData === 'object' &&
    'results' in responseData &&
    'pagination' in responseData
  );
};

/**
 * تبدیل ساختار pagination بک‌اند به فرانت
 *
 * بک‌اند:
 * {
 *   pagination: {
 *     count, total_pages, current_page, page_size, next, previous
 *   },
 *   results: [...]
 * }
 *
 * فرانت:
 * {
 *   data: [...],
 *   meta: { count, totalPages, currentPage, pageSize, hasNext, hasPrevious }
 * }
 *
 * @param {object} responseData
 * @returns {{ data: Array, meta: object }}
 */
const normalizePaginatedData = (responseData) => {
  const { pagination, results } = responseData;

  const meta = {
    count: pagination?.count ?? 0,
    totalPages: pagination?.total_pages ?? 0,
    currentPage: pagination?.current_page ?? 1,
    pageSize: pagination?.page_size ?? 20,
    hasNext: pagination?.next !== null && pagination?.next !== undefined,
    hasPrevious: pagination?.previous !== null && pagination?.previous !== undefined,
    next: pagination?.next ?? null,
    previous: pagination?.previous ?? null,
  };

  return {
    data: mapFields(results || []),
    meta,
  };
};

// ═══════════════════════════════════════════════
//    ۳. نرمال‌سازی Response موفق
// ═══════════════════════════════════════════════

/**
 * نرمال‌سازی response موفق Axios
 *
 * دو حالت:
 *   A) ساده:      { success: true, data: {...}, message, meta }
 *   B) paginated: { success: true, pagination: {...}, results: [...] }
 *
 * @param {object} axiosResponse - response کامل Axios
 * @returns {{ data: any, meta: object|null, message: string|null }}
 */
export const normalizeSuccessResponse = (axiosResponse) => {
  const body = axiosResponse.data;

  // اگر success === false بود ولی status 200 → خطا
  if (body && body.success === false) {
    throw new ApiError({
      code: body?.error?.code || 'UNEXPECTED_ERROR',
      message: body?.error?.message || body?.message || 'خطای غیرمنتظره',
      details: body?.error?.details || {},
    });
  }

  // ─── حالت B: Paginated ───
  if (isPaginatedResponse(body)) {
    const { data, meta } = normalizePaginatedData(body);
    return {
      data,
      meta,
      message: body.message || null,
    };
  }

  // ─── حالت A: ساده ───
  const { success, data, message, meta } = body || {};

  return {
    data: mapFields(data),
    meta: meta ? mapFields(meta) : null,
    message: message || null,
  };
};

// ═══════════════════════════════════════════════
//    ۴. کلاس خطای API
// ═══════════════════════════════════════════════

export class ApiError extends Error {
  constructor({ code = 'UNKNOWN_ERROR', message = 'خطای ناشناخته', details = {} }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.isApiError = true;
  }
}

// ═══════════════════════════════════════════════
//    ۵. نرمال‌سازی خطای Axios
// ═══════════════════════════════════════════════

/**
 * تبدیل خطای Axios به ApiError
 *
 * @param {object} axiosError
 * @returns {ApiError}
 */
export const normalizeErrorResponse = (axiosError) => {
  // خطای شبکه (بدون response)
  if (!axiosError.response) {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message: 'خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.',
      details: { originalError: axiosError.message },
    });
  }

  const { status, data } = axiosError.response;
  const apiError = data?.error;

  // فرمت استاندارد خطای بک‌اند
  if (apiError) {
    return new ApiError({
      code: apiError.code || 'ERROR',
      message: apiError.message || 'خطا در انجام عملیات',
      details: apiError.details || {},
    });
  }

  // فرمت خطای DRF (ValidationError)
  if (status === 400 && data) {
    const messages = Object.entries(data)
      .map(([field, errors]) => {
        const errorText = Array.isArray(errors) ? errors.join('، ') : String(errors);
        return `${field}: ${errorText}`;
      })
      .join('\n');

    return new ApiError({
      code: 'VALIDATION_ERROR',
      message: messages || 'داده‌های ورودی معتبر نیست',
      details: data,
    });
  }

  // خطاهای HTTP عمومی
  const httpErrorMessages = {
    400: 'درخواست نامعتبر',
    401: 'لطفاً وارد حساب کاربری خود شوید',
    403: 'شما دسترسی لازم برای این عملیات را ندارید',
    404: 'منبع مورد نظر یافت نشد',
    405: 'روش درخواست پشتیبانی نمی‌شود',
    429: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.',
    500: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.',
    502: 'سرور در دسترس نیست',
    503: 'سرویس موقتاً در دسترس نیست',
  };

  return new ApiError({
    code: `HTTP_${status}`,
    message: httpErrorMessages[status] || `خطا (${status})`,
    details: { status, data },
  });
};
