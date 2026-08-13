// src/api/services/businesses.service.js
/**
 * 🏪 Businesses Service — نسخه نهایی هماهنگ با بک‌اند
 *
 * Endpoints:
 *   POST   /businesses/create/              → ثبت کسب‌وکار (MultiPart)
 *   GET    /businesses/list/                → لیست عمومی (با فیلتر)
 *   GET    /businesses/status/              → وضعیت کسب‌وکار من
 *   GET    /businesses/detail/              → جزئیات (مالک)
 *   PUT    /businesses/detail/              → بروزرسانی (مالک)
 *   GET    /businesses/bank-info/           → اطلاعات بانکی
 *   PUT    /businesses/bank-info/           → ویرایش اطلاعات بانکی
 *   DELETE /businesses/delete/              → حذف کسب‌وکار
 *   GET    /businesses/public/{slug}/       → جزئیات عمومی (مشتری)
 *   GET    /businesses/gallery/             → لیست گالری
 *   POST   /businesses/gallery/upload/      → آپلود تصویر گالری
 *   DELETE /businesses/gallery/{pk}/delete/ → حذف تصویر گالری
 *   POST   /businesses/gallery/reorder/     → تغییر ترتیب گالری
 */
import apiClient from '../api-client';
import api from '../axios-instance';
import { normalizeSuccessResponse } from '../response-normalizer';

export const businessesService = {
  // ═══════════ Registration ═══════════
  /**
   * ثبت کسب‌وکار جدید
   * POST /businesses/create/
   * @param {FormData|object} data - FormData (با تصاویر) یا JSON
   */
  createBusiness: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/businesses/create/', data);
    }
    return apiClient.post('/businesses/create/', data);
  },

  // ═══════════ List (جدید — در فرانت نبود) ═══════════
  /**
   * لیست عمومی کسب‌وکارها با فیلتر
   * GET /businesses/list/
   * @param {object} params - { province_id, city_id, category_id, search, lat, lng, radius, page, page_size }
   */
  getBusinessList: (params = {}) => {
    return apiClient.get('/businesses/list/', { params });
  },

  // ═══════════ Status ═══════════
  /**
   * وضعیت کسب‌وکار کاربر فعلی
   * GET /businesses/status/
   */
  getBusinessStatus: () => {
    return apiClient.get('/businesses/status/');
  },

  // ═══════════ Detail (مالک) ═══════════
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
   * @param {FormData|object} data
   */
  updateBusiness: async (data) => {
    if (data instanceof FormData) {
      const response = await api.put('/businesses/detail/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return normalizeSuccessResponse(response);
    }
    return apiClient.put('/businesses/detail/', data);
  },

  // ═══════════ Bank Info ═══════════
  /**
   * دریافت اطلاعات بانکی کسب‌وکار
   * GET /businesses/bank-info/
   */
  getBankInfo: () => {
    return apiClient.get('/businesses/bank-info/');
  },

  /**
   * ویرایش اطلاعات بانکی کسب‌وکار
   * PUT /businesses/bank-info/
   * @param {object} data - { bank_owner_name, bank_national_id, bank_name, bank_id, bank_sheba, bank_card_number, bank_account_number }
   */
  updateBankInfo: (data) => {
    return apiClient.put('/businesses/bank-info/', data);
  },

  // ═══════════ Delete ═══════════
  /**
   * حذف کسب‌وکار
   * DELETE /businesses/delete/
   */
  deleteBusiness: () => {
    return apiClient.delete('/businesses/delete/');
  },

  // ═══════════ Public (مشتری) ═══════════
  /**
   * جزئیات عمومی کسب‌وکار (برای مشتریان)
   * GET /businesses/public/{booking_slug}/
   * @param {string} bookingSlug
   */
  getPublicBusiness: (bookingSlug) => {
    return apiClient.get(`/businesses/public/${bookingSlug}/`);
  },

  // ═══════════ Gallery ═══════════
  /**
   * لیست تصاویر گالری کسب‌وکار
   * GET /businesses/gallery/
   */
  getGallery: () => {
    return apiClient.get('/businesses/gallery/');
  },

  /**
   * آپلود تصویر به گالری (حداکثر ۳ تصویر)
   * POST /businesses/gallery/upload/
   * @param {File} imageFile
   * @param {number} sortOrder
   */
  uploadGalleryImage: (imageFile, sortOrder = 0) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('sort_order', sortOrder);
    return apiClient.upload('/businesses/gallery/upload/', formData);
  },

  /**
   * حذف تصویر از گالری
   * DELETE /businesses/gallery/{pk}/delete/
   * @param {number} imageId
   */
  deleteGalleryImage: (imageId) => {
    return apiClient.delete(`/businesses/gallery/${imageId}/delete/`);
  },

  /**
   * تغییر ترتیب تصاویر گالری
   * POST /businesses/gallery/reorder/
   * @param {number[]} order - لیست شناسه‌ها به ترتیب دلخواه
   */
  reorderGallery: (order) => {
    return apiClient.post('/businesses/gallery/reorder/', { order });
  },
};
