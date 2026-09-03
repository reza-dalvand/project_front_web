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
/**
* تبدیل یک کلید camelCase به snake_case
* @example 'timeSlot' → 'time_slot'
* @example 'serviceId' → 'service_id'
*/
const camelToSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

/**
* تبدیل بازگشتی تمام کلیدهای یک آبجکت از camelCase به snake_case
* - FormData, File, Blob دست‌نخورده باقی می‌مانند
* - آرایه‌ها element-wise تبدیل می‌شوند
*/
const toSnakeCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof FormData || obj instanceof File || obj instanceof Blob) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    result[snakeKey] =
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof FormData) &&
      !(value instanceof File) &&
      !(value instanceof Blob)
        ? toSnakeCase(value)
        : value;
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