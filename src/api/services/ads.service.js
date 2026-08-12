// src/api/services/ads.service.js
/**
 * 📢 Ads Service
 *
 * مدیریت آگهی‌ها:
 * - درخواست‌های مدل (Model Requests)
 * - آگهی‌های اجاره لاین (Line Rentals)
 */
import apiClient from '../api-client';

export const adsService = {
  // ═══════════ Model Requests - Public ═══════════

  /**
   * لیست درخواست‌های مدل (عمومی)
   * GET /ads/model-requests/
   */
  getModelRequests: (params = {}) => {
    return apiClient.get('/ads/model-requests/', { params });
  },

  /**
   * جزئیات درخواست مدل
   * GET /ads/model-requests/{pk}/
   */
  getModelRequestDetail: (requestId) => {
    return apiClient.get(`/ads/model-requests/${requestId}/`);
  },

  // ═══════════ Model Requests - Business ═══════════

  /**
   * لیست درخواست‌های مدل من
   * GET /ads/my-model-requests/
   */
  getMyModelRequests: () => {
    return apiClient.get('/ads/my-model-requests/');
  },

  /**
   * ایجاد درخواست مدل
   * POST /ads/my-model-requests/create/
   */
  createModelRequest: (data) => {
    return apiClient.post('/ads/my-model-requests/create/', data);
  },

  /**
   * حذف درخواست مدل
   * DELETE /ads/my-model-requests/{pk}/delete/
   */
  deleteModelRequest: (requestId) => {
    return apiClient.delete(`/ads/my-model-requests/${requestId}/delete/`);
  },

  // ═══════════ Line Rentals - Public ═══════════

  /**
   * لیست آگهی‌های اجاره لاین (عمومی)
   * GET /ads/line-rentals/
   */
  getLineRentals: (params = {}) => {
    return apiClient.get('/ads/line-rentals/', { params });
  },

  /**
   * جزئیات آگهی اجاره لاین
   * GET /ads/line-rentals/{pk}/
   */
  getLineRentalDetail: (rentalId) => {
    return apiClient.get(`/ads/line-rentals/${rentalId}/`);
  },

  // ═══════════ Line Rentals - Business ═══════════

  /**
   * لیست آگهی‌های اجاره لاین من
   * GET /ads/my-line-rentals/
   */
  getMyLineRentals: () => {
    return apiClient.get('/ads/my-line-rentals/');
  },

  /**
   * ایجاد آگهی اجاره لاین
   * POST /ads/my-line-rentals/create/
   */
  createLineRental: (data) => {
    return apiClient.post('/ads/my-line-rentals/create/', data);
  },

  /**
   * حذف آگهی اجاره لاین
   * DELETE /ads/my-line-rentals/{pk}/delete/
   */
  deleteLineRental: (rentalId) => {
    return apiClient.delete(`/ads/my-line-rentals/${rentalId}/delete/`);
  },
};
