// src/api/services/price-list.service.js
/**
 * 🏷️ Price List Service — بدون یادداشت
 *
 * قیمت‌ها فقط از بخش «خدمات» خوانده می‌شوند.
 * فقط theme و is_published قابل تغییر هستند.
 */
import apiClient from '../api-client';

export const priceListService = {
  /**
   * دریافت لیست قیمت کسب‌وکار
   * GET /services/price-list/
   */
  getPriceList: () => {
    return apiClient.get('/services/price-list/');
  },

  /**
   * بروزرسانی لیست قیمت (فقط تم و وضعیت انتشار)
   * PUT /services/price-list/
   *
   * Payload:
   * {
   *   theme?: 'rose' | 'gold' | 'mint' | 'classic',
   *   is_published?: boolean,
   * }
   */
  updatePriceList: (data) => {
    return apiClient.put('/services/price-list/', data);
  },
};
