// src/api/services/services.service.js
/**
 * 💆 Services Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET    /services/                    → لیست خدمات
 *   POST   /services/                    → ایجاد خدمت
 *   GET    /services/{pk}/               → جزئیات خدمت
 *   PUT    /services/{pk}/               → بروزرسانی خدمت
 *   PATCH  /services/{pk}/               → بروزرسانی جزئی
 *   DELETE /services/{pk}/               → حذف خدمت
 *   POST   /services/{pk}/toggle-active/ → فعال/غیرفعال
 *   GET    /services/price-list/         → لیست قیمت
 *   PUT    /services/price-list/         → بروزرسانی لیست قیمت
 */
import apiClient from '../api-client';

export const servicesService = {
  // ═══════════ CRUD ═══════════

  /**
   * لیست خدمات کسب‌وکار
   * GET /services/
   * @param {object} params - فیلترهای اختیاری
   */
  getServices: (params = {}) => {
    return apiClient.get('/services/', { params });
  },

  /**
   * ایجاد خدمت جدید
   * POST /services/
   * @param {object} data
   * {
   *   name: string,
   *   category: number,       // ServiceCategory ID
   *   sub_service: number,    // SubService ID
   *   description: string,
   *   original_price: number,
   *   discount_percent: number,
   *   has_deposit: boolean,
   *   deposit_amount: number,
   *   duration: number,       // دقیقه
   *   renewal_days: number,
   *   is_active: boolean,
   * }
   */
  createService: (data) => {
    return apiClient.post('/services/', data);
  },

  /**
   * جزئیات یک خدمت
   * GET /services/{pk}/
   */
  getServiceDetail: (serviceId) => {
    return apiClient.get(`/services/${serviceId}/`);
  },

  /**
   * بروزرسانی کامل خدمت
   * PUT /services/{pk}/
   */
  updateService: (serviceId, data) => {
    return apiClient.put(`/services/${serviceId}/`, data);
  },

  /**
   * بروزرسانی جزئی خدمت
   * PATCH /services/{pk}/
   */
  patchService: (serviceId, data) => {
    return apiClient.patch(`/services/${serviceId}/`, data);
  },

  /**
   * حذف خدمت
   * DELETE /services/{pk}/
   */
  deleteService: (serviceId) => {
    return apiClient.delete(`/services/${serviceId}/`);
  },

  /**
   * فعال/غیرفعال کردن خدمت
   * POST /services/{pk}/toggle-active/
   */
  toggleServiceActive: (serviceId) => {
    return apiClient.post(`/services/${serviceId}/toggle-active/`);
  },

  // ═══════════ Price List ═══════════

  /**
   * دریافت لیست قیمت
   * GET /services/price-list/
   */
  getPriceList: () => {
    return apiClient.get('/services/price-list/');
  },

  /**
   * بروزرسانی لیست قیمت
   * PUT /services/price-list/
   * @param {object} data - { theme, is_published, notes: [{label, min_value, max_value}] }
   */
  updatePriceList: (data) => {
    return apiClient.put('/services/price-list/', data);
  },
};
