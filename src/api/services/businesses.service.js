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
  createBusiness: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/businesses/create/', data);
    }
    return apiClient.post('/businesses/create/', data);
  },

  // ═══════════ List ═══════════
  getBusinessList: (params = {}) => {
    return apiClient.get('/businesses/list/', {
      params: {
        ...params,
        _t: Date.now(), // ✅ Cache buster
      },
    });
  },

  // ═══════════ Status ═══════════
  getBusinessStatus: () => {
    return apiClient.get('/businesses/status/', {
      params: { _t: Date.now() }, // ✅ Cache buster
    });
  },

  // ═══════════ Detail (مالک) ═══════════
  getBusinessDetail: () => {
    return apiClient.get('/businesses/detail/', {
      params: { _t: Date.now() }, // ✅ Cache buster
    });
  },

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
  getBankInfo: () => {
    return apiClient.get('/businesses/bank-info/', {
      params: { _t: Date.now() }, // ✅ Cache buster
    });
  },

  /**
   * ویرایش اطلاعات بانکی کسب‌وکار
   * ✅ تبدیل فیلدهای فرانت به نام‌های صحیح بک‌اند
   *
   * فرانت:          بک‌اند:
   * owner_name  →  bank_owner_name
   * sheba       →  bank_sheba
   * card_number →  bank_card_number
   * bankName    →  bank_name
   * bank_id     →  bank_id
   */
  updateBankInfo: (data) => {
    const payload = {
      bank_owner_name: data.owner_name || '',
      bank_national_id: data.national_id || '',
      bank_name: data.bankName || data.bank_name || '',
      bank_id: data.bank_id || '',
      bank_sheba: data.sheba || '',
      bank_card_number: data.card_number || '',
      bank_account_number: data.account_number || '',
    };
    return apiClient.put('/businesses/bank-info/', payload);
  },

  // ═══════════ Delete ═══════════
  deleteBusiness: () => {
    return apiClient.delete('/businesses/delete/');
  },

  // ═══════════ Public (مشتری) ═══════════
  getPublicBusiness: (bookingSlug) => {
    return apiClient.get(`/businesses/public/${bookingSlug}/`, {
      params: { _t: Date.now() }, // ✅ Cache buster
    });
  },

  // ═══════════ Gallery ═══════════
  getGallery: () => {
    return apiClient.get('/businesses/gallery/', {
      params: { _t: Date.now() }, // ✅ Cache buster
    });
  },

  uploadGalleryImage: (imageFile, sortOrder = 0) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('sort_order', sortOrder);
    return apiClient.upload('/businesses/gallery/upload/', formData);
  },

  deleteGalleryImage: (imageId) => {
    return apiClient.delete(`/businesses/gallery/${imageId}/delete/`);
  },

  reorderGallery: (order) => {
    return apiClient.post('/businesses/gallery/reorder/', { order });
  },
};
