// src/api/services/businesses.service.js
/**
 * 🏪 Businesses Service
 *
 * مدیریت کسب‌وکار:
 * - ثبت کسب‌وکار جدید
 * - وضعیت کسب‌وکار
 * - جزئیات و بروزرسانی
 * - اطلاعات بانکی
 * - حذف کسب‌وکار
 * - مشاهده عمومی (با booking_slug)
 */
import apiClient from '../api-client';

export const businessesService = {
  // ═══════════ Registration ═══════════

  /**
   * ثبت کسب‌وکار جدید
   * POST /businesses/create/
   */
  createBusiness: (data) => {
    return apiClient.post('/businesses/create/', data);
  },

  /**
   * وضعیت کسب‌وکار کاربر
   * GET /businesses/status/
   */
  getBusinessStatus: () => {
    return apiClient.get('/businesses/status/');
  },

  // ═══════════ Management ═══════════

  /**
   * جزئیات کسب‌وکار (برای مالک)
   * GET /businesses/detail/
   */
  getBusinessDetail: () => {
    return apiClient.get('/businesses/detail/');
  },

  /**
   * بروزرسانی کسب‌وکار
   * PUT /businesses/detail/
   */
  updateBusiness: (data) => {
    return apiClient.put('/businesses/detail/', data);
  },

  /**
   * ثبت/ویرایش اطلاعات بانکی
   * PUT /businesses/bank-info/
   */
  updateBankInfo: (data) => {
    return apiClient.put('/businesses/bank-info/', data);
  },

  /**
   * حذف کسب‌وکار
   * DELETE /businesses/delete/
   */
  deleteBusiness: () => {
    return apiClient.delete('/businesses/delete/');
  },

  // ═══════════ Public ═══════════

  /**
   * جزئیات عمومی کسب‌وکار (برای مشتریان)
   * GET /businesses/public/{booking_slug}/
   */
  getPublicBusiness: (bookingSlug) => {
    return apiClient.get(`/businesses/public/${bookingSlug}/`);
  },
};
