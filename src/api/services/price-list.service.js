// src/api/services/price-list.service.js
import apiClient from '../api-client';

export const priceListService = {
  /**
   * دریافت لیست قیمت کسب‌وکار خودم (مالک)
   * GET /services/price-list/
   */
  getPriceList: () => {
    return apiClient.get('/services/price-list/');
  },

  /**
   * ✅ جدید: دریافت لیست قیمت عمومی (برای مشتری)
   * GET /services/price-list/public/?business_id=X
   */
  getPublicPriceList: (businessId) => {
    return apiClient.get('/services/price-list/public/', {
      params: { business_id: businessId },
    });
  },

  /**
   * بروزرسانی لیست قیمت (فقط مالک)
   * PUT /services/price-list/
   */
  updatePriceList: (data) => {
    return apiClient.put('/services/price-list/', data);
  },
};