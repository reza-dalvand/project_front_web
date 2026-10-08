// src/api/api-client.js
/**
 * 🛡️ API Client - لایه نهایی درخواست‌ها
 *
 * تمام درخواست‌ها از این لایه عبور می‌کنند.
 * مسئولیت‌ها:
 *   - تبدیل خودکار camelCase → snake_case برای سازگاری با Django
 *   - نرمال‌سازی Response (شامل fieldMapper و pagination)
 *   - مدیریت خطا
 */
import api from './axios-instance';
import { normalizeSuccessResponse, normalizeErrorResponse } from './response-normalizer';

// ═══════════════════════════════════════════════
//    تبدیل کلیدها: camelCase → snake_case
// ═══════════════════════════════════════════════

// ✅ FIX 7.1: کش برای جلوگیری از محاسبات تکراری Regex روی دیتای بزرگ
const _snakeKeyCache = new Map();

/**
 * تبدیل یک کلید camelCase به snake_case
 * @example 'timeSlot' → 'time_slot'
 * @example 'serviceId' → 'service_id'
 */
const camelToSnake = (str) => {
  if (_snakeKeyCache.has(str)) return _snakeKeyCache.get(str);
  
  // Fast path: اگر حرف بزرگی ندارد، نیازی به تبدیل نیست (از قبل snake_case یا lowercase است)
  if (!/[A-Z]/.test(str)) {
    _snakeKeyCache.set(str, str);
    return str;
  }
  
  const snake = str.replace(/([A-Z])/g, '_$1').toLowerCase();
  _snakeKeyCache.set(str, snake);
  return snake;
};

/**
 * تبدیل بازگشتی تمام کلیدهای یک آبجکت از camelCase به snake_case
 * - FormData, File, Blob, Date, TypedArray دست‌نخورده باقی می‌مانند
 * - آرایه‌ها element-wise تبدیل می‌شوند
 * - ✅ FIX 7.1: استفاده از for...in برای عملکرد بهتر روی آبجکت‌های بزرگ
 */
const toSnakeCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  // نادیده گرفتن انواع خاصی که نباید پیمایش شوند
  if (
    obj instanceof FormData ||
    obj instanceof File ||
    obj instanceof Blob ||
    obj instanceof Date ||
    ArrayBuffer.isView(obj)
  ) {
    return obj;
  }
  
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  const result = {};
  // استفاده از for...in سریع‌تر از Object.entries است
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnake(key);
      const value = obj[key];
      
      result[snakeKey] =
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof FormData) &&
        !(value instanceof File) &&
        !(value instanceof Blob) &&
        !(value instanceof Date) &&
        !ArrayBuffer.isView(value)
          ? toSnakeCase(value)
          : value;
    }
  }
  return result;
};

// ═══════════════════════════════════════════════
//    متدهای اصلی
// ═══════════════════════════════════════════════
const apiClient = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, toSnakeCase(data), config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, toSnakeCase(data), config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
  async patch(url, data = {}, config = {}) {
    try {
      const response = await api.patch(url, toSnakeCase(data), config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
  async upload(url, formData, config = {}) {
    try {
      const method = (config.method || 'POST').toUpperCase();
      const headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      };
      let response;
      if (method === 'PUT') {
        response = await api.put(url, formData, { headers });
      } else if (method === 'PATCH') {
        response = await api.patch(url, formData, { headers });
      } else {
        response = await api.post(url, formData, { headers });
      }
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
};
export default apiClient;