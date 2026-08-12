// src/api/services/services.service.js
/**
 * 💆 Services Service
 *
 * مدیریت خدمات کسب‌وکار:
 * - لیست خدمات
 * - جزئیات خدمت
 * - فعال/غیرفعال کردن
 */
import apiClient from '../api-client';

export const servicesService = {
  /**
   * لیست خدمات کسب‌وکار
   * GET /services/
   */
  getServices: () => {
    return apiClient.get('/services/');
  },

  /**
   * جزئیات یک خدمت
   * GET /services/{pk}/
   */
  getServiceDetail: (serviceId) => {
    return apiClient.get(`/services/${serviceId}/`);
  },

  /**
   * فعال/غیرفعال کردن خدمت
   * POST /services/{pk}/toggle-active/
   */
  toggleServiceActive: (serviceId) => {
    return apiClient.post(`/services/${serviceId}/toggle-active/`);
  },

  /**
   * ایجاد خدمت جدید
   * POST /services/
   */
  createService: (data) => {
    return apiClient.post('/services/', data);
  },

  /**
   * بروزرسانی خدمت
   * PUT /services/{pk}/
   */
  updateService: (serviceId, data) => {
    return apiClient.put(`/services/${serviceId}/`, data);
  },

  /**
   * حذف خدمت
   * DELETE /services/{pk}/
   */
  deleteService: (serviceId) => {
    return apiClient.delete(`/services/${serviceId}/`);
  },
};
