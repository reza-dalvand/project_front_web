// src/api/services/ads.service.js
/**
 * 📢 Ads Service — هماهنگ کامل با بک‌اند
 *
 * Endpoints ModelRequest:
 *   GET    /ads/model-requests/
 *   GET    /ads/model-requests/{pk}/
 *   GET    /ads/my-model-requests/
 *   POST   /ads/my-model-requests/create/
 *   PUT    /ads/my-model-requests/{pk}/update/
 *   DELETE /ads/my-model-requests/{pk}/delete/
 *
 * Endpoints LineRental:
 *   GET    /ads/line-rentals/
 *   GET    /ads/line-rentals/{pk}/
 *   GET    /ads/my-line-rentals/
 *   POST   /ads/my-line-rentals/create/
 *   PUT    /ads/my-line-rentals/{pk}/update/
 *   DELETE /ads/my-line-rentals/{pk}/delete/
 */
import apiClient from '../api-client';

export const adsService = {
  // ═══════════ Model Requests - Public ═══════════

  /**
   * لیست درخواست‌های مدل (عمومی)
   * GET /ads/model-requests/
   *
   * Params: { page, lat, lng, radius }
   *
   * Response: ModelRequestListSerializer[]
   *   { id, title, description, cost_type, cost_type_display,
   *     discount, is_urgent, contact_phone,
   *     business, business_name, business_logo,
   *     service, service_name,
   *     created_jalali, expires_jalali, created_at, distance }
   */
  getModelRequests: (params = {}) => {
    return apiClient.get('/ads/model-requests/', { params });
  },

  /**
   * جزئیات درخواست مدل
   * GET /ads/model-requests/{pk}/
   *
   * Response: ModelRequestDetailSerializer
   *   ModelRequestListSerializer + business_booking_slug, service_image_url
   */
  getModelRequestDetail: (requestId) => {
    return apiClient.get(`/ads/model-requests/${requestId}/`);
  },

  // ═══════════ Model Requests - Business ═══════════

  /**
   * لیست درخواست‌های مدل کسب‌وکار من
   * GET /ads/my-model-requests/
   */
  getMyModelRequests: () => {
    return apiClient.get('/ads/my-model-requests/');
  },

  /**
   * ایجاد درخواست مدل
   * POST /ads/my-model-requests/create/
   *
   * Payload (FormData):
   * {
   *   service: number,          // Service ID
   *   title: string,            // max 100
   *   description: string,      // max 500
   *   service_image: File,
   *   cost_type: 'paid' | 'material_cost' | 'free',
   *   discount: number,         // 0-100
   *   is_urgent: boolean,
   *   contact_phone: string,    // 11 رقم
   * }
   */
  createModelRequest: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/ads/my-model-requests/create/', data);
    }
    return apiClient.post('/ads/my-model-requests/create/', data);
  },

  /**
   * ویرایش درخواست مدل
   * PUT /ads/my-model-requests/{pk}/update/
   *
   * Payload: title, description, service_image, cost_type, discount, is_urgent, contact_phone
   */
  updateModelRequest: (requestId, data) => {
    if (data instanceof FormData) {
      return apiClient.upload(`/ads/my-model-requests/${requestId}/update/`, data, {
        method: 'PUT',
      });
    }
    return apiClient.put(`/ads/my-model-requests/${requestId}/update/`, data);
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
   *
   * Params: { page, lat, lng, radius }
   *
   * Response: LineRentalListSerializer[]
   *   { id, title, description, collab_type, collab_type_display,
   *     percent_salon, percent_partner, fixed_amount, fixed_deposit, hourly_rate,
   *     contact_phone, business, business_name,
   *     service_category, service_category_name,
   *     sub_service, sub_service_name,
   *     created_jalali, expires_jalali, created_at, distance }
   */
  getLineRentals: (params = {}) => {
    return apiClient.get('/ads/line-rentals/', { params });
  },

  /**
   * جزئیات آگهی اجاره لاین
   * GET /ads/line-rentals/{pk}/
   *
   * Response: LineRentalDetailSerializer
   *   LineRentalListSerializer + business_booking_slug, line_image_url
   */
  getLineRentalDetail: (rentalId) => {
    return apiClient.get(`/ads/line-rentals/${rentalId}/`);
  },

  // ═══════════ Line Rentals - Business ═══════════

  /**
   * لیست آگهی‌های اجاره لاین کسب‌وکار من
   * GET /ads/my-line-rentals/
   */
  getMyLineRentals: () => {
    return apiClient.get('/ads/my-line-rentals/');
  },

  /**
   * ایجاد آگهی اجاره لاین
   * POST /ads/my-line-rentals/create/
   *
   * Payload (FormData):
   * {
   *   title: string,            // max 100
   *   description: string,      // max 500
   *   line_image: File,
   *   service_category: number, // ServiceCategory ID
   *   sub_service: number,      // SubService ID
   *   collab_type: 'percent' | 'fixed' | 'hourly',
   *   percent_salon?: number,   // فقط برای percent
   *   percent_partner?: number, // فقط برای percent
   *   fixed_amount?: number,    // فقط برای fixed
   *   fixed_deposit?: number,   // فقط برای fixed
   *   hourly_rate?: number,     // فقط برای hourly
   *   contact_phone: string,    // 11 رقم
   * }
   */
  createLineRental: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/ads/my-line-rentals/create/', data);
    }
    return apiClient.post('/ads/my-line-rentals/create/', data);
  },

  /**
   * ویرایش آگهی اجاره لاین
   * PUT /ads/my-line-rentals/{pk}/update/
   */
  updateLineRental: (rentalId, data) => {
    if (data instanceof FormData) {
      return apiClient.upload(`/ads/my-line-rentals/${rentalId}/update/`, data, {
        method: 'PUT',
      });
    }
    return apiClient.put(`/ads/my-line-rentals/${rentalId}/update/`, data);
  },

  /**
   * حذف آگهی اجاره لاین
   * DELETE /ads/my-line-rentals/{pk}/delete/
   */
  deleteLineRental: (rentalId) => {
    return apiClient.delete(`/ads/my-line-rentals/${rentalId}/delete/`);
  },
};
