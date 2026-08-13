// src/api/api-client.js
/**
 * 🛡️ API Client - لایه نهایی درخواست‌ها
 *
 * تمام درخواست‌ها از این لایه عبور می‌کنند.
 * مسئولیت‌ها:
 *   - انتخاب بین Mock و Real API
 *   - نرمال‌سازی Response (شامل fieldMapper و pagination)
 *   - مدیریت خطا
 *   - افزودن delay شبیه‌سازی برای Mock
 */
import api from './axios-instance';
import { USE_MOCK } from './config';
import { normalizeSuccessResponse, normalizeErrorResponse } from './response-normalizer';
import { getMockHandler } from './mock/mock-adapter';

// ═══════════════════════════════════════════════
//    delay شبیه‌سازی برای Mock
// ═══════════════════════════════════════════════
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// ═══════════════════════════════════════════════
//    متدهای اصلی
// ═══════════════════════════════════════════════
const apiClient = {
  /**
   * GET Request
   * @param {string} url
   * @param {object} config - Axios config (params, headers, ...)
   * @returns {Promise<{data, meta, message}>}
   */
  async get(url, config = {}) {
    if (USE_MOCK) {
      await simulateDelay();
      const mockHandler = getMockHandler('GET', url, config.params);
      return mockHandler;
    }
    try {
      const response = await api.get(url, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  /**
   * POST Request
   * @param {string} url
   * @param {object} data - Body
   * @param {object} config
   */
  async post(url, data = {}, config = {}) {
    if (USE_MOCK) {
      await simulateDelay();
      const mockHandler = getMockHandler('POST', url, data);
      return mockHandler;
    }
    try {
      const response = await api.post(url, data, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  /**
   * PUT Request
   */
  async put(url, data = {}, config = {}) {
    if (USE_MOCK) {
      await simulateDelay();
      const mockHandler = getMockHandler('PUT', url, data);
      return mockHandler;
    }
    try {
      const response = await api.put(url, data, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  /**
   * PATCH Request
   */
  async patch(url, data = {}, config = {}) {
    if (USE_MOCK) {
      await simulateDelay();
      const mockHandler = getMockHandler('PATCH', url, data);
      return mockHandler;
    }
    try {
      const response = await api.patch(url, data, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  /**
   * DELETE Request
   */
  async delete(url, config = {}) {
    if (USE_MOCK) {
      await simulateDelay();
      const mockHandler = getMockHandler('DELETE', url, config.params);
      return mockHandler;
    }
    try {
      const response = await api.delete(url, config);
      return normalizeSuccessResponse(response);
    } catch (error) {
      throw normalizeErrorResponse(error);
    }
  },

  /**
   * Upload فایل (FormData)
   */
  async upload(url, formData, config = {}) {
    if (USE_MOCK) {
      await simulateDelay(500, 1500);
      const mockHandler = getMockHandler('UPLOAD', url, formData);
      return mockHandler;
    }
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
