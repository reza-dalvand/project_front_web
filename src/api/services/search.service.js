// src/api/services/search.service.js
/**
 * 🔍 Search Service — هماهنگ کامل با بک‌اند
 *
 * ⚠️ نکته مهم: ساختار پاسخ بک‌اند:
 *   GET /search/ → { businesses: [...], services: [...], total, query }
 *   فرانت باید با این ساختار سازگار شود (نه posts/modelRequests)
 *
 * Endpoints:
 *   GET    /search/              → جستجوی کلی
 *   GET    /search/suggestions/  → پیشنهادات (Autocomplete)
 *   GET    /search/history/      → تاریخچه جستجو
 *   DELETE /search/history/      → حذف تاریخچه
 *   GET    /search/nearby/       → نزدیک‌ترین‌ها (ترکیبی)
 */
import apiClient from '../api-client';

export const searchService = {
  /**
   * جستجوی کلی
   * GET /search/?query=&category=&limit=
   *
   * @param {string} query - عبارت جستجو (حداقل ۲ کاراکتر)
   * @param {string} category - 'all' | 'businesses' | 'services'
   * @param {number} limit - حداکثر تعداد نتایج
   *
   * Response:
   * {
   *   businesses: [{
   *     id, name, category_name, city_name, address,
   *     logo, rating, reviews_count, is_vip, booking_slug,
   *     distance?
   *   }],
   *   services: [{
   *     id, name, business_name, business_id,
   *     original_price, discount_percent, final_price,
   *     duration, has_deposit
   *   }],
   *   total: number,
   *   query: string
   * }
   */
  search: (query, category = 'all', limit = 10, locationParams = {}) => {
    return apiClient.get('/search/', {
      params: { query, category, limit, ...locationParams },
    });
  },

  /**
   * پیشنهادات جستجو (Autocomplete)
   * GET /search/suggestions/?q=
   *
   * @param {string} query - عبارت جستجو (حداقل ۲ کاراکتر)
   * @returns {Promise<string[]>} - لیست پیشنهادات
   */
  getSuggestions: (query) => {
    return apiClient.get('/search/suggestions/', { params: { q: query } });
  },

  /**
   * تاریخچه جستجوی کاربر
   * GET /search/history/
   *
   * @param {number} limit - حداکثر تعداد نتایج
   *
   * Response: [{
   *   id, query, result_count, category, created_at
   * }]
   */
  getSearchHistory: (limit = 20) => {
    return apiClient.get('/search/history/', { params: { limit } });
  },

  /**
   * حذف تاریخچه جستجو
   * DELETE /search/history/
   *
   * @param {number} id - شناسه آیتم خاص (خالی = حذف همه)
   */
  clearSearchHistory: (id = null) => {
    const config = id ? { params: { id } } : {};
    return apiClient.delete('/search/history/', config);
  },

  /**
   * 🆕 جستجوی نزدیک‌ترین‌ها (ترکیبی)
   * GET /search/nearby/?lat=&lng=&radius=&category_id=
   *
   * @param {number} lat - عرض جغرافیایی
   * @param {number} lng - طول جغرافیایی
   * @param {number} radius - شعاع جستجو (کیلومتر، پیش‌فرض ۱۰)
   * @param {number} categoryId - فیلتر دسته‌بندی (اختیاری)
   *
   * Response:
   * {
   *   businesses: [...],
   *   model_requests: [...],
   *   line_rentals: [...],
   *   total: number
   * }
   */
  searchNearby: (lat, lng, radius = 10, categoryId = null) => {
    const params = { lat, lng, radius };
    if (categoryId) params.category_id = categoryId;
    return apiClient.get('/search/nearby/', { params });
  },
};
