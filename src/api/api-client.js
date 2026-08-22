// src/api/api-client.js
/**
* 🛡️ API Client - لایه نهایی درخواست‌ها
*
* تمام درخواست‌ها از این لایه عبور می‌کنند.
* مسئولیت‌ها:
*   - نرمال‌سازی Response (شامل fieldMapper و pagination)
*   - مدیریت خطا
*/
import api from './axios-instance';
import { normalizeSuccessResponse, normalizeErrorResponse } from './response-normalizer';

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
      const response = await api.post(url, data, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  async patch(url, data = {}, config = {}) {
    try {
      const response = await api.patch(url, data, config);
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
      const response = await api.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },
};

export default apiClient;